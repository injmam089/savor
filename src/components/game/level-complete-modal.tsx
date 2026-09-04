'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Coins, ArrowRight, ShoppingBag, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameLevel } from '@/lib/game-data';

interface LevelCompleteModalProps {
  completedLevel: GameLevel;
  nextLevel: GameLevel | null;
  score: number;
  coinsEarned: number;
  bonusCoins: number;
  onNextLevel: () => void;
  onOpenShop: () => void;
}

export function LevelCompleteModal({
  completedLevel,
  nextLevel,
  score,
  coinsEarned,
  bonusCoins,
  onNextLevel,
  onOpenShop,
}: LevelCompleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-zinc-900 to-black border border-primary/40 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(230,81,0,0.4)] relative overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Celebratory Stars Animation */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 300 }}
            >
              <Star className="h-9 w-9 fill-amber-400 text-amber-400 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
            </motion.div>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-1">
          Level Cleared! 🎉
        </h2>
        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-5">
          {completedLevel.title}
        </p>

        {/* Reward Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                <Trophy className="h-3 w-3 text-amber-400" /> Current Score
              </div>
              <div className="text-lg font-black text-white">{score.toLocaleString()}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                <Coins className="h-3 w-3 text-amber-400" /> Level Reward
              </div>
              <div className="text-lg font-black text-amber-400">+{completedLevel.rewardCoins} Coins</div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 border-t border-white/5 pt-2 flex items-center justify-between">
            <span>Total Coins Pocketed:</span>
            <span className="font-bold text-white">+{coinsEarned + completedLevel.rewardCoins} 🪙</span>
          </div>
        </div>

        {/* Next Level Preview */}
        {nextLevel ? (
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-3 mb-6 text-left">
            <div className="text-[10px] uppercase font-black text-primary mb-0.5">Up Next</div>
            <div className="font-bold text-xs text-white">{nextLevel.title}</div>
            <div className="text-[11px] text-zinc-400">{nextLevel.subtitle}</div>
          </div>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 mb-6 text-xs text-amber-300 font-bold">
            👑 You have mastered all restaurant tiers! Entering Endless Dinner Rush!
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Button
            onClick={onNextLevel}
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-500 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/30 gap-2"
          >
            <span>Continue To {nextLevel ? `Level ${nextLevel.level}` : 'Endless Rush'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={onOpenShop}
            className="h-10 rounded-xl border-white/15 hover:bg-white/10 text-xs font-bold gap-1.5"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-amber-400" />
            <span>Visit Upgrades Shop</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
