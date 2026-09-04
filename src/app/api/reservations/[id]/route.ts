import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const reservation = await prisma.reservation.findUnique({ where: { id: params.id } });
    if (!reservation) return NextResponse.json({ success: false, error: 'Reservation not found' }, { status: 404 });
    if (reservation.userId !== user.id) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    if (!['PENDING', 'CONFIRMED'].includes(reservation.status)) {
      return NextResponse.json({ success: false, error: 'Cannot cancel this reservation' }, { status: 400 });
    }

    const updated = await prisma.reservation.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error cancelling reservation:', error);
    return NextResponse.json({ success: false, error: 'Failed to cancel reservation' }, { status: 500 });
  }
}