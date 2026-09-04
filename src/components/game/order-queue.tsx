'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, Coins, Zap, Check, AlertCircle } from 'lucide-react';
import { GameRecipe, CustomerType, INGREDIENTS } from '@/lib/game-data';

export interface ActiveOrder {
  id: string;
  recipe: GameRecipe;
  customer: CustomerType;
  totalTime: number;
  timeLeft: number;
  isVip?: boolean;
  isSpeed?: boolean;
  createdAt: number;
}

interface OrderQueueProps {
  orders: ActiveOrder[];
  currentPlatedIngredients: string[];
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
}

export function OrderQueue({
  orders,
  currentPlatedIngredients,
  selectedOrderId,
  onSelectOrder,
}: OrderQueueProps) {
  if (orders.length === 0) {
    return (
      <div className="w-full bg-black/40 border border-dashed border-white/10 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2 animate-bounce">🛎️</div>
        <p className="text-zinc-400 font-medium text-sm">Customers are studying the menu... Next order incoming!</p>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      <AnimatePresence mode="popLayout">
        {orders.map((order) => {
          const timePercent = Math.max(0, (order.timeLeft / order.totalTime) * 100);
          const isUrgent = timePercent < 25;
          const isWarning = timePercent < 50 && !isUrgent;
          const isSelected = selectedOrderId === order.id;

          // Calculate matching progress on the recipe sequence
          let matchedCount = 0;
          for (let i = 0; i < currentPlatedIngredients.length; i++) {
            if (i < order.recipe.ingredients.length && currentPlatedIngredients[i] === order.recipe.ingredients[i]) {
              matchedCount++;
            } else {
              break;
            }
          }
          const isPlateCurrentlyMatching = matchedCount === currentPlatedIngredients.length && currentPlatedIngredients.length > 0;
          const isReadyToServe = currentPlatedIngredients.length === order.recipe.ingredients.length && isPlateCurrentlyMatching;

          return (
            <motion.div
              key={order.id}
              layout
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                boxShadow: isReadyToServe
                  ? '0 0 25px rgba(34, 197, 94, 0.5)'
                  : isUrgent
                  ? '0 0 20px rgba(239, 68, 68, 0.4)'
                  : isSelected
                  ? '0 0 20px rgba(249, 115, 22, 0.4)'
                  : '0 4px 12px rgba(0,0,0,0.3)',
              }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => onSelectOrder(order.id)}
              className={`relative cursor-pointer rounded-2xl p-3.5 border transition-all duration-200 backdrop-blur-md overflow-hidden ${
                isReadyToServe
                  ? 'bg-gradient-to-b from-green-950/70 to-zinc-900 border-green-500/80 ring-2 ring-green-500/40'
                  : isUrgent
                  ? 'bg-gradient-to-b from-red-950/60 to-zinc-900 border-red-500/80 animate-pulse'
                  : order.isVip
                  ? 'bg-gradient-to-b from-amber-950/60 to-zinc-900 border-amber-500/70'
                  : isSelected
                  ? 'bg-zinc-900/90 border-primary ring-2 ring-primary/30'
                  : 'bg-zinc-900/80 border-white/10 hover:border-white/20'
              }`}
            >
              {/* VIP / Speed Banner */}
              {order.isVip && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-400 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-md">
                  <Star className="h-3 w-3 fill-current" /> VIP (3x Coins)
                </div>
              )}
              {order.isSpeed && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-500 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-md">
                  <Zap className="h-3 w-3 fill-current" /> Express Blitz
                </div>
              )}

              {/* Customer Header */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="text-2xl w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 shadow-inner">
                  {order.customer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground truncate">{order.customer.name}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate italic">
                    "{order.customer.dialogues.waiting}"
                  </div>
                </div>
              </div>

              {/* Dish Header */}
              <div className="flex items-center gap-2 mb-2 bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-2xl">{order.recipe.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-xs text-white truncate">{order.recipe.name}</div>
                  <div className="text-[10px] text-primary font-semibold flex items-center gap-2">
                    <span>+{order.recipe.basePoints} pts</span>
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <Coins className="h-2.5 w-2.5" /> +{order.recipe.baseCoins * (order.isVip ? 3 : 1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Required Ingredients Steps */}
              <div className="mb-3">
                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1.5 flex items-center justify-between">
                  <span>Recipe Sequence:</span>
                  <span className="text-primary font-mono text-[9px]">{order.recipe.ingredients.length} Steps</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {order.recipe.ingredients.map((ingId, idx) => {
                    const ing = INGREDIENTS[ingId];
                    const isDone = isPlateCurrentlyMatching && idx < currentPlatedIngredients.length;
                    const isNext = isPlateCurrentlyMatching ? idx === currentPlatedIngredients.length : idx === 0 && currentPlatedIngredients.length === 0;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                          isDone
                            ? 'bg-green-500/20 border-green-500 text-green-300'
                            : isNext
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 animate-pulse'
                            : 'bg-zinc-800/80 border-white/10 text-zinc-400'
                        }`}
                        title={ing?.name || ingId}
                      >
                        <span>{ing?.icon || '•'}</span>
                        <span className="hidden sm:inline text-[10px]">{ing?.name.split(' ')[0]}</span>
                        {isDone && <Check className="h-3 w-3 text-green-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Patience Timer Ring / Bar */}
              <div className="mt-2">
                <div className="flex justify-between items-center text-[11px] mb-1 font-mono">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Patience
                  </span>
                  <span
                    className={`font-bold ${
                      isUrgent ? 'text-red-400 animate-bounce' : isWarning ? 'text-amber-400' : 'text-green-400'
                    }`}
                  >
                    {Math.ceil(order.timeLeft)}s
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isUrgent
                        ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                        : isWarning
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-green-500 to-emerald-400'
                    }`}
                    style={{ width: `${timePercent}%` }}
                  />
                </div>
              </div>

              {/* Ready to serve glow tag */}
              {isReadyToServe && (
                <div className="mt-2 text-center bg-green-500 text-zinc-950 text-[11px] font-black uppercase py-1 rounded-lg animate-pulse flex items-center justify-center gap-1 shadow-lg">
                  <span>🛎️ READY TO SERVE! PRESS SPACE</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
