import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true, avatar: true } } }
        },
        _count: {
          select: { favorites: true, reviews: { where: { isApproved: true } } }
        }
      }
    });

    if (!item) {
      return NextResponse.json({ success: false, error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch menu item' }, { status: 500 });
  }
}