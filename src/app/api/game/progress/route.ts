import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UPGRADES } from '@/lib/game-data';

// GET player's current game progress & unlocked upgrades
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        progress: null,
      });
    }

    const progress = await prisma.gameProgress.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      authenticated: true,
      progress: progress || {
        coins: 0,
        highestScore: 0,
        highestLevel: 1,
        unlockedItems: [],
        equippedTheme: 'classic',
      },
    });
  } catch (error: any) {
    console.error('Fetch progress error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST purchase an upgrade from the shop
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentication required to buy upgrades' },
        { status: 401 }
      );
    }

    const { itemId } = await req.json();
    const upgrade = UPGRADES.find((u) => u.id === itemId);

    if (!upgrade) {
      return NextResponse.json(
        { success: false, message: 'Invalid upgrade item' },
        { status: 400 }
      );
    }

    const progress = await prisma.gameProgress.findUnique({
      where: { userId: session.user.id },
    });

    if (!progress || progress.coins < upgrade.cost) {
      return NextResponse.json(
        { success: false, message: 'Not enough coins!' },
        { status: 400 }
      );
    }

    if (progress.unlockedItems.includes(itemId)) {
      return NextResponse.json(
        { success: false, message: 'Item already owned' },
        { status: 400 }
      );
    }

    const updated = await prisma.gameProgress.update({
      where: { userId: session.user.id },
      data: {
        coins: { decrement: upgrade.cost },
        unlockedItems: { push: itemId },
      },
    });

    return NextResponse.json({
      success: true,
      progress: updated,
    });
  } catch (error: any) {
    console.error('Upgrade purchase error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Purchase failed' },
      { status: 500 }
    );
  }
}
