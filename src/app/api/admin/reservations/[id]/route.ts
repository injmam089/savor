import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    await requireAdmin();
    const { status } = await request.json();

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: { status }
    });

    await prisma.notification.create({
      data: {
        userId: reservation.userId,
        title: 'Reservation Update',
        message: `Your reservation on ${reservation.date.toISOString().split('T')[0]} status is now ${status}.`,
        type: 'RESERVATION'
      }
    });

    return NextResponse.json({ success: true, data: reservation });
  } catch (error: any) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ success: false, error: 'Failed to update reservation' }, { status: 500 });
  }
}