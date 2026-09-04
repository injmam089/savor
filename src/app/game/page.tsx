import React from 'react';
import { Metadata } from 'next';
import { SavorRushGame } from '@/components/game/savor-rush-game';
import { GameLeaderboard } from '@/components/game/game-leaderboard';
import { ChefHat, Flame, Sparkles, Trophy, ShoppingBag, Zap, Heart, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SAVOR RUSH: Kitchen Dash | Official Restaurant Game',
  description: 'Fast-paced restaurant arcade game! Assemble delicious gourmet dishes, handle customer rushes, build combos, and climb the global leaderboards.',
};

export default function GamePage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Top Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-primary shadow-sm">
            <Flame className="h-4 w-4 fill-primary" />
            <span>Interactive Arcade Experience</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
            SAVOR RUSH
          </h1>
          <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-amber-400 via-primary to-orange-500 bg-clip-text text-transparent">
            Kitchen Dash — Real Playable Restaurant Game
          </p>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
            Step behind the counter at SAVOR! Keep up with demanding customers, assemble dishes in exact recipe order, trigger adrenaline-filled Rush Hours, and compete for the #1 spot on the global leaderboard.
          </p>
        </div>

        {/* Master Game Screen Container */}
        <div className="w-full relative rounded-3xl p-1 bg-gradient-to-b from-primary/30 via-white/5 to-transparent shadow-[0_0_80px_rgba(230,81,0,0.15)]">
          <SavorRushGame />
        </div>

        {/* How To Play & Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-zinc-950/60 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <h3 className="font-black text-lg text-white mb-2">1. Assemble Recipes</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Customers order authentic SAVOR menu dishes. Click ingredients from your pantry in the exact sequence shown on their ticket to assemble each dish.
            </p>
          </div>

          <div className="bg-zinc-950/60 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-black text-lg text-white mb-2">2. Maintain Combos</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Serve orders quickly and flawlessly to build combo multipliers up to 5x! Watch out for VIPs with 3x coins and 10-second Express Blitz challenges.
            </p>
          </div>

          <div className="bg-zinc-950/60 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="font-black text-lg text-white mb-2">3. Upgrade & Dominate</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Spend coins earned during shifts in the Chef Upgrades Shop to unlock Golden Spatulas, Turbo Ranges, Extra Lives, and Cyberpunk Kitchen themes.
            </p>
          </div>
        </div>

        {/* Global Hall of Fame Leaderboard */}
        <GameLeaderboard />
      </div>
    </div>
  );
}
