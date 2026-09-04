'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Volume2, VolumeX, Home, Keyboard, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenShop: () => void;
  onQuit: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function PauseModal({
  onResume,
  onRestart,
  onOpenShop,
  onQuit,
  isMuted,
  onToggleMute,
}: PauseModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-gradient-to-b from-zinc-900 to-black border border-white/15 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]"
      >
        <div className="text-3xl mb-2">⏸️</div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-1">Game Paused</h2>
        <p className="text-xs text-zinc-400 mb-5">Take a breather, chef! The kitchen is waiting.</p>

        {/* Keyboard Controls Cheatsheet */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-6 text-left">
          <div className="text-[11px] uppercase font-bold text-primary mb-2 flex items-center gap-1.5">
            <Keyboard className="h-3.5 w-3.5" /> Desktop Hotkeys Guide
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-400">Pantry Items:</span>
              <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-white text-[10px]">1-9 / Q-M</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Serve Dish:</span>
              <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-white text-[10px]">Space</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Trash Plate:</span>
              <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-white text-[10px]">Del / Bksp</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Mute Audio:</span>
              <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-white text-[10px]">M</kbd>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <Button
            onClick={onResume}
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 text-zinc-950 font-black text-sm uppercase tracking-wider gap-2 shadow-lg shadow-primary/30"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Resume Game (Esc)</span>
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={onRestart}
              className="h-10 rounded-xl border-white/15 hover:bg-white/10 text-xs font-bold gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restart Run</span>
            </Button>

            <Button
              variant="outline"
              onClick={onToggleMute}
              className="h-10 rounded-xl border-white/15 hover:bg-white/10 text-xs font-bold gap-1.5"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-red-400" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span>{isMuted ? 'Unmute (M)' : 'Mute (M)'}</span>
            </Button>
          </div>

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
              variant="destructive"
              onClick={onQuit}
              className="h-10 rounded-xl text-xs font-bold gap-1.5"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Exit To Menu</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
