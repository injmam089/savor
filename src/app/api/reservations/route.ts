import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const reservations = await prisma.reservation.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      include: { table: true }
    });

    return NextResponse.json({ success: true, data: reservations });
  } catch (error: any) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { date, time, guests, seatingPreference, specialRequest } = await request.json();
    const reservationDate = new Date(`${date}T${time}`);

    if (reservationDate <= new Date()) {
      return NextResponse.json({ success: false, error: 'Date must be in the future' }, { status: 400 });
    }

    const availableTable = await prisma.table.findFirst({
      where: {
        capacity: { gte: guests },
        location: seatingPreference,
        reservations: {
          none: {
            date: reservationDate,
            status: { in: ['PENDING', 'CONFIRMED'] }
          }
        }
      }
    });

    if (!availableTable) {
      return NextResponse.json({ success: false, error: 'No suitable table available for this time' }, { status: 409 });
    }

    const reservation = await prisma.$transaction(async (tx: any) => {
      const res = await tx.reservation.create({
        data: {
          userId: user.id,
          tableId: availableTable.id,
          date: reservationDate,
          time,
          guests,
          specialRequest,
          status: 'PENDING'
        }
      });

      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Reservation Requested',
          message: `Your reservation for ${guests} guests on ${date} at ${time} is pending confirmation.`,
          type: 'SYSTEM'
        }
      });

      return res;
    });

    return NextResponse.json({ success: true, data: reservation }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ success: false, error: 'Failed to create reservation' }, { status: 500 });
  }
}