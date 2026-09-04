import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    await requireAdmin();
    const { isApproved } = await request.json();

    const updated = await prisma.review.update({
      where: { id: params.id },
      data: { isApproved }
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 });
  }
}