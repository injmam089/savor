'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Zap, Heart, Shuffle } from 'lucide-react';

export type GameEventType = 'rush_hour' | 'vip' | 'speed_order' | 'happy_hour' | 'kitchen_chaos' | null;

interface EventBannerProps {
  event: GameEventType;
}

export function EventBanner({ event }: EventBannerProps) {
  if (!event) return null;

  const eventConfigs: Record<
    string,
    { title: string; subtitle: string; icon: React.ReactNode; bg: string; border: string; text: string }
  > = {
    rush_hour: {
      title: '🔥 RUSH HOUR ACTIVATED!',
      subtitle: 'Orders arriving at double speed! 2x Combo Booster!',
      icon: <Flame className="h-6 w-6 text-orange-400 animate-bounce" />,
      bg: 'from-orange-600/90 via-red-600/90 to-amber-600/90',
      border: 'border-orange-400',
      text: 'text-white',
    },
    vip: {
      title: '💰 VIP GUEST ARRIVED!',
      subtitle: 'Satisfy this high roller for 3x Golden Coins & Score!',
      icon: <Star className="h-6 w-6 text-yellow-300 animate-spin" />,
      bg: 'from-amber-600/90 via-yellow-500/90 to-amber-700/90',
      border: 'border-yellow-300',
      text: 'text-zinc-950',
    },
    speed_order: {
      title: '⚡ SPEED ORDER CHALLENGE!',
      subtitle: 'Complete the express order before the 10s blitz timer runs out!',
      icon: <Zap className="h-6 w-6 text-cyan-300 animate-pulse" />,
      bg: 'from-cyan-600/90 via-blue-600/90 to-indigo-600/90',
      border: 'border-cyan-300',
      text: 'text-white',
    },
    happy_hour: {
      title: '❤️ HAPPY HOUR IS HERE!',
      subtitle: 'Extra customer patience & instant combo multiplier!',
      icon: <Heart className="h-6 w-6 text-pink-300 fill-current animate-bounce" />,
      bg: 'from-pink-600/90 via-purple-600/90 to-rose-600/90',
      border: 'border-pink-300',
      text: 'text-white',
    },
    kitchen_chaos: {
      title: '💥 KITCHEN CHAOS!',
      subtitle: 'Hold tight! Ingredients are scrambled in the heat of rush!',
      icon: <Shuffle className="h-6 w-6 text-purple-300 animate-spin" />,
      bg: 'from-purple-700/90 via-indigo-700/90 to-violet-800/90',
      border: 'border-purple-400',
      text: 'text-white',
    },
  };

  const current = eventConfigs[event];
  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -80, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-lg w-[92%]"
      >
        <div
          className={`bg-gradient-to-r ${current.bg} border-2 ${current.border} rounded-2xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl flex items-center gap-3`}
        >
          <div className="p-2 bg-black/30 rounded-xl">{current.icon}</div>
          <div className="flex-1">
            <div className={`font-black text-sm md:text-base tracking-wide ${current.text}`}>
              {current.title}
            </div>
            <div className={`text-xs opacity-90 font-medium ${current.text}`}>
              {current.subtitle}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
