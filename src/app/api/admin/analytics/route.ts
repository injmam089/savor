import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    // Get total revenue
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'DELIVERED' }
    });
    const totalRevenue = totalRevenueResult._sum?.total || 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.order.count({
      where: { createdAt: { gte: startOfToday } }
    });

    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

    const pendingOrders = await prisma.order.count({
      where: { status: { in: ['PLACED', 'CONFIRMED'] } }
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalReservations = await prisma.reservation.count({
      where: { createdAt: { gte: startOfMonth } }
    });

    // popular dish approximation
    const items = await prisma.orderItem.groupBy({
      by: ['menuItemId', 'name'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 1
    });
    const popularDish = items[0] ? { name: items[0].name, orders: items[0]._sum.quantity } : null;

    // simple orders by status
    const statusGroups = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    });
    const ordersByStatus = statusGroups.reduce((acc: any, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true } } }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        todayOrders,
        totalCustomers,
        pendingOrders,
        totalReservations,
        popularDish,
        ordersByStatus,
        recentOrders,
        revenueByMonth: [] // Placeholder
      }
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}