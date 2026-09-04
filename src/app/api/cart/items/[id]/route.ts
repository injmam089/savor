import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { quantity } = await request.json();

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: params.id } });
      return NextResponse.json({ success: true, message: 'Item removed' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ success: false, error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await prisma.cartItem.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Item removed' });
  } catch (error: any) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete cart item' }, { status: 500 });
  }
}