'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Bell, Sparkles, AlertCircle, ChefHat, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INGREDIENTS, GameRecipe } from '@/lib/game-data';

export interface FloatingParticle {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  isCombo?: boolean;
}

interface CookingStationProps {
  currentPlate: string[];
  activeTargetRecipe: GameRecipe | null;
  canServe: boolean;
  onServe: () => void;
  onTrash: () => void;
  floatingParticles: FloatingParticle[];
  shakeKey: number;
  lastMistakeText: string | null;
}

export function CookingStation({
  currentPlate,
  activeTargetRecipe,
  canServe,
  onServe,
  onTrash,
  floatingParticles,
  shakeKey,
  lastMistakeText,
}: CookingStationProps) {
  return (
    <motion.div
      key={shakeKey}
      animate={shakeKey > 0 ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full relative bg-gradient-to-b from-zinc-900/90 to-black/90 border border-white/10 rounded-3xl p-4 md:p-6 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Floating Particles (Points & Combos) */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <AnimatePresence>
          {floatingParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.5, y: p.y, x: p.x }}
              animate={{ opacity: 1, scale: 1.2, y: p.y - 70 }}
              exit={{ opacity: 0, scale: 1.4, y: p.y - 120 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute font-black tracking-wider text-sm md:text-base drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              style={{ color: p.color, left: `${p.x}%`, top: `${p.y}%` }}
            >
              {p.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header bar of the station */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <ChefHat className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-foreground tracking-tight">Chef's Plating Board</h3>
            <div className="text-[11px] text-zinc-400">
              {activeTargetRecipe ? (
                <span>
                  Preparing: <strong className="text-primary">{activeTargetRecipe.name}</strong> ({currentPlate.length}/{activeTargetRecipe.ingredients.length} items)
                </span>
              ) : (
                <span>Select or start building any active order recipe</span>
              )}
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          {canServe ? (
            <span className="bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
              <Check className="h-3.5 w-3.5" /> Ready to Serve!
            </span>
          ) : currentPlate.length > 0 ? (
            <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> In Assembly
            </span>
          ) : (
            <span className="bg-zinc-800 text-zinc-400 text-xs font-medium px-3 py-1 rounded-full">
              Plate Empty
            </span>
          )}
        </div>
      </div>

      {/* Center Plating Visual Counter */}
      <div className="min-h-[160px] md:min-h-[200px] flex flex-col items-center justify-center relative p-4 rounded-2xl bg-zinc-950/60 border border-white/5 shadow-inner">
        {/* Visual Plating Board Surface */}
        <div className="w-48 sm:w-64 h-8 bg-zinc-800/80 rounded-full border border-white/10 shadow-lg shadow-black/80 absolute bottom-6 z-0 flex items-center justify-center">
          <div className="w-40 sm:w-56 h-4 bg-zinc-900 rounded-full border border-white/5" />
        </div>

        {/* Stacked Ingredients Display */}
        <div className="relative z-10 flex flex-col-reverse items-center justify-end mb-6 gap-1">
          <AnimatePresence>
            {currentPlate.map((ingId, idx) => {
              const ing = INGREDIENTS[ingId];
              return (
                <motion.div
                  key={`${ingId}-${idx}`}
                  initial={{ scale: 0, y: -40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold text-xs shadow-md backdrop-blur-sm"
                  style={{
                    backgroundColor: `${ing?.color || '#333'}25`,
                    borderColor: ing?.color || '#555',
                    color: '#FFF',
                  }}
                >
                  <span className="text-lg">{ing?.icon || '🍴'}</span>
                  <span>{ing?.name || ingId}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {currentPlate.length === 0 && (
            <div className="text-center py-6 text-zinc-500">
              <div className="text-4xl mb-2 opacity-50">🍽️</div>
              <p className="text-xs font-medium">Click ingredients from the pantry below to assemble the dish</p>
              <p className="text-[11px] text-zinc-600 mt-0.5">Use keyboard numbers/letters for lightning speed!</p>
            </div>
          )}
        </div>

        {/* Mistake feedback toast */}
        <AnimatePresence>
          {lastMistakeText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 bg-red-600/90 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg border border-red-400 flex items-center gap-1.5 z-20 animate-bounce"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{lastMistakeText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Station Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Clear / Trash */}
        <Button
          variant="destructive"
          onClick={onTrash}
          disabled={currentPlate.length === 0}
          className="rounded-xl px-4 py-2 text-xs font-bold gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <Trash2 className="h-4 w-4" />
          <span>Trash Plate (Del)</span>
        </Button>

        {/* Right: Serve Dish */}
        <Button
          onClick={onServe}
          disabled={!canServe}
          className={`rounded-xl px-6 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider gap-2 shadow-xl transition-all ${
            canServe
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-zinc-950 shadow-green-500/30 scale-105 animate-pulse'
              : 'bg-zinc-800 text-zinc-500 opacity-60'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>Serve Dish (Space)</span>
        </Button>
      </div>
    </motion.div>
  );
}
