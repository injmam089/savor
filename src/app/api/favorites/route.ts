import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: { menuItem: true }
    });

    return NextResponse.json({ success: true, data: favorites });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { menuItemId } = await request.json();

    const existing = await prisma.favorite.findUnique({
      where: { userId_menuItemId: { userId: user.id, menuItemId } }
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { userId_menuItemId: { userId: user.id, menuItemId } }
      });
      return NextResponse.json({ success: true, message: 'Unfavorited' });
    } else {
      const fav = await prisma.favorite.create({
        data: { userId: user.id, menuItemId }
      });
      return NextResponse.json({ success: true, data: fav }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle favorite' }, { status: 500 });
  }
}