import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const {
      playerName,
      score,
      levelReached,
      ordersServed,
      maxCombo,
      coinsEarned,
    } = body;

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid score' },
        { status: 400 }
      );
    }

    const userId = session?.user?.id || null;
    const finalPlayerName = session?.user?.name || playerName || 'Chef Guest';

    // 1. Create Game Score Entry
    const gameScore = await prisma.gameScore.create({
      data: {
        userId,
        playerName: finalPlayerName,
        score: Math.floor(score),
        levelReached: levelReached || 1,
        ordersServed: ordersServed || 0,
        maxCombo: maxCombo || 1,
        coinsEarned: Math.floor(coinsEarned || 0),
      },
    });

    // 2. If user is authenticated, update their persistent GameProgress
    let progress = null;
    if (userId) {
      progress = await prisma.gameProgress.upsert({
        where: { userId },
        create: {
          userId,
          coins: Math.floor(coinsEarned || 0),
          highestScore: Math.floor(score),
          highestLevel: levelReached || 1,
          unlockedItems: [],
        },
        update: {
          coins: { increment: Math.floor(coinsEarned || 0) },
          highestScore: {
            set: Math.max(score, (await prisma.gameProgress.findUnique({ where: { userId } }))?.highestScore || 0),
          },
          highestLevel: {
            set: Math.max(levelReached || 1, (await prisma.gameProgress.findUnique({ where: { userId } }))?.highestLevel || 1),
          },
        },
      });
    }

    // Get rank of this score
    const higherScoresCount = await prisma.gameScore.count({
      where: { score: { gt: score } },
    });

    return NextResponse.json({
      success: true,
      scoreId: gameScore.id,
      rank: higherScoresCount + 1,
      progress,
    });
  } catch (error: any) {
    console.error('Save game score error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to save score' },
      { status: 500 }
    );
  }
}
