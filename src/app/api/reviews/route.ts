import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const menuItemId = searchParams.get('menuItemId');

    if (!menuItemId) return NextResponse.json({ success: false, error: 'menuItemId is required' }, { status: 400 });

    const reviews = await prisma.review.findMany({
      where: { menuItemId, isApproved: true },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { menuItemId, orderId, rating, comment } = await request.json();

    const existingReview = await prisma.review.findFirst({
      where: { userId: user.id, menuItemId, orderId }
    });

    if (existingReview) {
      return NextResponse.json({ success: false, error: 'Review already exists for this item/order' }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        menuItemId,
        orderId,
        rating,
        comment,
        isApproved: false // Requires admin approval
      }
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, error: 'Failed to create review' }, { status: 500 });
  }
}