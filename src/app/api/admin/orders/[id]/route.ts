import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    await requireAdmin();
    const { status } = await request.json();

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status }
    });

    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: 'Order Update',
        message: `Your order status has been updated to ${status}.`,
        type: 'ORDER_STATUS'
      }
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}