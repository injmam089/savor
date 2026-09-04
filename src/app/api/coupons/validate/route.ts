import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon) return NextResponse.json({ success: false, error: 'Invalid coupon' }, { status: 404 });
    if (!coupon.isActive) return NextResponse.json({ success: false, error: 'Coupon is inactive' }, { status: 400 });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, error: 'Coupon has expired' }, { status: 400 });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 400 });
    }
    if (subtotal < coupon.minOrder) return NextResponse.json({ success: false, error: `Minimum order amount is ${coupon.minOrder}` }, { status: 400 });

    const discountAmount = coupon.discountType === 'PERCENTAGE' 
      ? (subtotal * coupon.discountValue) / 100 
      : coupon.discountValue;

    return NextResponse.json({ success: true, data: { discountAmount } });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to validate coupon' }, { status: 500 });
  }
}