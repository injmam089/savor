import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    await requireAdmin();
    const body = await request.json();
    const updated = await prisma.coupon.update({
      where: { id: params.id },
      data: body
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    await requireAdmin();
    const updated = await prisma.coupon.update({
      where: { id: params.id },
      data: { isActive: false }
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error deactivating coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to deactivate coupon' }, { status: 500 });
  }
}