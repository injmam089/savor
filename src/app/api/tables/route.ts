import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const guests = searchParams.get('guests');
    const location = searchParams.get('location');

    let where: any = {};
    if (guests) where.capacity = { gte: parseInt(guests) };
    if (location) where.location = location;

    if (date && time) {
      const reservationDate = new Date(`${date}T${time}`);
      where.reservations = {
        none: {
          date: reservationDate,
          status: { in: ['PENDING', 'CONFIRMED'] }
        }
      };
    }

    const tables = await prisma.table.findMany({ where });

    return NextResponse.json({ success: true, data: tables });
  } catch (error: any) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tables' }, { status: 500 });
  }
}