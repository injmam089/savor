import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || 'all'; // 'all', 'today', 'week'

    let whereClause: any = {};

    if (timeframe === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      whereClause.createdAt = { gte: todayStart };
    } else if (timeframe === 'week') {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      whereClause.createdAt = { gte: weekStart };
    }

    const scores = await prisma.gameScore.findMany({
      where: whereClause,
      orderBy: { score: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      leaderboard: scores.map((s, index) => ({
        rank: index + 1,
        id: s.id,
        playerName: s.user?.name || s.playerName || 'Anonymous Chef',
        avatar: s.user?.avatar || null,
        score: s.score,
        levelReached: s.levelReached,
        ordersServed: s.ordersServed,
        maxCombo: s.maxCombo,
        coinsEarned: s.coinsEarned,
        createdAt: s.createdAt,
        isRegistered: !!s.userId,
      })),
    });
  } catch (error: any) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
