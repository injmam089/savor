import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { calculateTax, calculateDeliveryFee, generateOrderNumber } from '@/lib/utils';
import { TAX_RATE, FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from '@/lib/constants';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true, payment: true }
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { orderType, addressId, paymentMethod, couponCode, notes } = body;

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { menuItem: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    let subtotal = 0;
    for (const item of cart.items) {
      if (!item.menuItem.isAvailable) {
        return NextResponse.json({ success: false, error: `Item ${item.menuItem.name} is unavailable` }, { status: 400 });
      }
      subtotal += item.menuItem.price * item.quantity;
    }

    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date()) && (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) && subtotal >= coupon.minOrder) {
        discount = coupon.discountType === 'PERCENTAGE' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
        appliedCoupon = coupon;
      }
    }

    const tax = calculateTax(subtotal, TAX_RATE);
    const deliveryFee = orderType === 'DELIVERY' ? calculateDeliveryFee(subtotal) : 0;
    const total = subtotal + tax + deliveryFee - discount;
    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          orderType,
          status: 'PLACED',
          subtotal,
          tax,
          deliveryFee,
          discount,
          total,
          notes,
          addressId: orderType === 'DELIVERY' ? addressId : null,
          items: {
            create: cart.items.map(item => ({
              menuItemId: item.menuItemId,
              name: item.menuItem.name,
              price: item.menuItem.price,
              quantity: item.quantity,
              customizations: item.customizations || {}
            }))
          },
          payment: {
            create: {
              method: paymentMethod,
              amount: total,
              status: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED'
            }
          }
        },
        include: { items: true, payment: true }
      });

      if (appliedCoupon) {
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { usedCount: { increment: 1 } }
        });
      }

      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Order Placed',
          message: `Your order #${orderNumber} has been placed successfully.`,
          type: 'ORDER'
        }
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order', message: error.message }, { status: 500 });
  }
}