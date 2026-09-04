import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    await requireAdmin();
    const body = await request.json();

    if (body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updated = await prisma.menuItem.update({
      where: { id: params.id },
      data: body
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ success: false, error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    await requireAdmin();

    const count = await prisma.orderItem.count({ where: { menuItemId: params.id } });
    if (count > 0) {
      // Soft check
      return NextResponse.json({ success: false, error: 'Cannot delete item with existing orders' }, { status: 400 });
    }

    await prisma.menuItem.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Menu item deleted' });
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete menu item' }, { status: 500 });
  }
}