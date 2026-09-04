'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Pause, RotateCcw, Flame, Coins, Trophy, Heart, Maximize2, Sparkles, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gameAudio } from '@/lib/game-audio';

interface GameHudProps {
  score: number;
  highScore: number;
  coins: number;
  lives: number;
  maxLives: number;
  level: number;
  ordersCompleted: number;
  ordersRequired: number;
  combo: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onRestart: () => void;
  onOpenShop: () => void;
  onToggleFullscreen: () => void;
}

export function GameHud({
  score,
  highScore,
  coins,
  lives,
  maxLives,
  level,
  ordersCompleted,
  ordersRequired,
  combo,
  isMuted,
  onToggleMute,
  onPause,
  onRestart,
  onOpenShop,
  onToggleFullscreen,
}: GameHudProps) {
  const progressPercent = Math.min(100, (ordersCompleted / Math.max(1, ordersRequired)) * 100);
  const comboMultiplier = combo >= 5 ? 3.0 : combo >= 4 ? 2.5 : combo >= 3 ? 2.0 : combo >= 2 ? 1.5 : 1.0;

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        {/* Left: Level & Lives */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Level Badge */}
          <div className="flex items-center gap-2 bg-primary/20 border border-primary/40 px-3 py-1.5 rounded-xl">
            <ChefHat className="h-5 w-5 text-primary animate-bounce" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-primary/80">Level</div>
              <div className="text-base font-extrabold text-foreground leading-none">{level}</div>
            </div>
          </div>

          {/* Lives (Hearts / Chef Hats) */}
          <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl">
            {Array.from({ length: maxLives }).map((_, i) => {
              const isAlive = i < lives;
              return (
                <motion.div
                  key={i}
                  animate={isAlive ? { scale: [1, 1.15, 1] } : { scale: 0.8, opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isAlive ? 'fill-red-500 text-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'text-zinc-600'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Combo Multiplier Meter */}
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs tracking-wide shadow-lg border ${
                combo >= 5
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-yellow-400 animate-pulse'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              <Flame className="h-4 w-4 fill-current animate-bounce" />
              <span>{comboMultiplier.toFixed(1)}x COMBO ({combo}x)</span>
            </motion.div>
          )}
        </div>

        {/* Center: Score & Progress */}
        <div className="flex items-center gap-4 flex-1 max-w-xs md:max-w-md justify-center">
          <div className="w-full">
            <div className="flex justify-between items-center text-xs mb-1 font-medium">
              <span className="text-zinc-400">Order Goal</span>
              <span className="text-primary font-bold">{ordersCompleted} / {ordersRequired}</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-primary rounded-full shadow-[0_0_10px_rgba(230,81,0,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
          </div>
        </div>

        {/* Right: Score, Coins & Actions */}
        <div className="flex items-center gap-3">
          {/* Score Counter */}
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center justify-end gap-1">
              <Trophy className="h-3 w-3 text-amber-400" /> High: {highScore.toLocaleString()}
            </div>
            <div className="text-lg md:text-xl font-black text-white tracking-wider">
              {score.toLocaleString()} <span className="text-xs text-primary font-bold">PTS</span>
            </div>
          </div>

          {/* Coins Badge */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 group"
            title="Open Upgrades Shop"
          >
            <Coins className="h-4 w-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-extrabold text-sm text-amber-400">{coins}</span>
            <Sparkles className="h-3 w-3 text-amber-300 opacity-60 group-hover:opacity-100" />
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-300 hover:text-white rounded-lg"
              onClick={onToggleMute}
              title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-300 hover:text-white rounded-lg"
              onClick={onPause}
              title="Pause (Esc / P)"
            >
              <Pause className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-300 hover:text-white rounded-lg hidden sm:inline-flex"
              onClick={onRestart}
              title="Restart"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-300 hover:text-white rounded-lg hidden sm:inline-flex"
              onClick={onToggleFullscreen}
              title="Toggle Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
