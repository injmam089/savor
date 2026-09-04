'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, ShoppingBag, Send, Award, Flame, Coins, Check, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface GameOverModalProps {
  score: number;
  highScore: number;
  level: number;
  ordersServed: number;
  maxCombo: number;
  coinsEarned: number;
  defaultPlayerName: string;
  onRestart: () => void;
  onOpenShop: () => void;
  onViewLeaderboard: () => void;
}

export function GameOverModal({
  score,
  highScore,
  level,
  ordersServed,
  maxCombo,
  coinsEarned,
  defaultPlayerName,
  onRestart,
  onOpenShop,
  onViewLeaderboard,
}: GameOverModalProps) {
  const [playerName, setPlayerName] = useState(defaultPlayerName || 'Chef Master');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);
  const isNewHighScore = score > highScore && score > 0;

  const handleSubmitScore = async () => {
    if (isSubmitting || submittedRank !== null) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/game/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName,
          score,
          levelReached: level,
          ordersServed,
          maxCombo,
          coinsEarned,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedRank(data.rank);
      }
    } catch (e) {
      console.error('Failed to submit score', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-zinc-900 to-black border border-white/15 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="text-4xl mb-2 animate-bounce">🍳💔</div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-1">
          Shift Ended!
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          The restaurant rush got intense! Here is your shift summary:
        </p>

        {/* High Score Banner */}
        {isNewHighScore && (
          <div className="mb-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 rounded-2xl p-2 text-amber-300 text-xs font-black uppercase flex items-center justify-center gap-1.5 animate-pulse">
            <Trophy className="h-4 w-4 text-amber-400" /> New Personal Best Score!
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
              <Trophy className="h-3 w-3 text-primary" /> Final Score
            </div>
            <div className="text-xl font-black text-white">{score.toLocaleString()}</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
              <Coins className="h-3 w-3 text-amber-400" /> Coins Earned
            </div>
            <div className="text-xl font-black text-amber-400">+{coinsEarned}</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
              <Award className="h-3 w-3 text-green-400" /> Orders Served
            </div>
            <div className="text-lg font-black text-white">{ordersServed}</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-400" /> Max Combo
            </div>
            <div className="text-lg font-black text-orange-400">{maxCombo}x</div>
          </div>
        </div>

        {/* Leaderboard Submission */}
        {submittedRank === null ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-6 text-left">
            <div className="text-[11px] font-bold text-zinc-300 mb-2">Save to Global Leaderboard</div>
            <div className="flex gap-2">
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your Chef Name"
                className="bg-black/50 border-white/15 text-xs text-white h-9 rounded-xl"
                maxLength={20}
              />
              <Button
                onClick={handleSubmitScore}
                disabled={isSubmitting || !playerName.trim()}
                className="h-9 px-3 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold gap-1"
              >
                <Send className="h-3 w-3" />
                {isSubmitting ? 'Saving...' : 'Submit'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-3 mb-6 flex items-center justify-center gap-2 text-green-400 text-xs font-bold">
            <Check className="h-4 w-4" />
            <span>Score Recorded! Leaderboard Rank: #{submittedRank}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <Button
            onClick={onRestart}
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-500 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/30 gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Play Again</span>
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={onOpenShop}
              className="h-10 rounded-xl border-white/15 hover:bg-white/10 text-xs font-bold gap-1.5"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-amber-400" />
              <span>Upgrades Shop</span>
            </Button>

            <Button
              variant="outline"
              onClick={onViewLeaderboard}
              className="h-10 rounded-xl border-white/15 hover:bg-white/10 text-xs font-bold gap-1.5"
            >
              <ListOrdered className="h-3.5 w-3.5 text-cyan-400" />
              <span>Leaderboard</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
