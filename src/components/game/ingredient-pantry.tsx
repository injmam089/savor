'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shuffle } from 'lucide-react';
import { INGREDIENTS, GameIngredient } from '@/lib/game-data';

interface IngredientPantryProps {
  availableIngredientIds: string[];
  onSelectIngredient: (ingredientId: string) => void;
  isKitchenChaos?: boolean;
}

type PantryCategory = 'all' | 'base' | 'protein' | 'veggie' | 'sauce' | 'garnish';

export function IngredientPantry({
  availableIngredientIds,
  onSelectIngredient,
  isKitchenChaos = false,
}: IngredientPantryProps) {
  const [activeCategory, setActiveCategory] = useState<PantryCategory>('all');

  const categories: { id: PantryCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Items', icon: '🍽️' },
    { id: 'base', label: 'Breads & Bases', icon: '🍞' },
    { id: 'protein', label: 'Proteins & Fillings', icon: '🧀' },
    { id: 'veggie', label: 'Fresh Veggies', icon: '🥬' },
    { id: 'sauce', label: 'Sauces & Gravies', icon: '🥫' },
    { id: 'garnish', label: 'Garnishes & Sweets', icon: '✨' },
  ];

  // Filter ingredients by current level recipe pool and category tab
  const filteredIngredients = Object.values(INGREDIENTS).filter((ing) => {
    // Only show ingredients relevant to the current level recipes to keep UI clean and playable
    const isAvailableInLevel = availableIngredientIds.includes(ing.id);
    if (!isAvailableInLevel) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'garnish') return ing.category === 'garnish' || ing.category === 'beverage';
    return ing.category === activeCategory;
  });

  return (
    <div className="w-full bg-black/60 border border-white/10 rounded-3xl p-3 md:p-5 backdrop-blur-xl shadow-2xl">
      {/* Category Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 mb-3 border-b border-white/5 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {isKitchenChaos && (
          <div className="flex items-center gap-1 bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg animate-pulse min-w-max">
            <Shuffle className="h-3 w-3 animate-spin" /> Kitchen Chaos Active!
          </div>
        )}
      </div>

      {/* Ingredient Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
        {filteredIngredients.map((ing) => {
          return (
            <motion.button
              key={ing.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelectIngredient(ing.id)}
              className="relative group flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all bg-zinc-900/80 hover:bg-zinc-800/90 border-white/10 hover:border-primary/50 shadow-md overflow-hidden"
              style={{
                boxShadow: `inset 0 0 12px ${ing.color}15`,
              }}
            >
              {/* Top Hotkey Badge */}
              {ing.key && (
                <span className="absolute top-1.5 right-1.5 text-[9px] font-black uppercase bg-zinc-800 text-zinc-400 group-hover:text-primary group-hover:bg-primary/20 px-1.5 py-0.5 rounded border border-white/10 transition-colors">
                  {ing.key}
                </span>
              )}

              {/* Icon */}
              <div className="text-2xl sm:text-3xl mb-1 filter drop-shadow-md group-hover:scale-110 transition-transform">
                {ing.icon}
              </div>

              {/* Name */}
              <div className="font-bold text-[11px] sm:text-xs text-zinc-200 group-hover:text-white line-clamp-1 leading-tight">
                {ing.name}
              </div>

              {/* Category Pill */}
              <div className="text-[9px] uppercase tracking-wider text-zinc-500 group-hover:text-primary font-semibold mt-0.5">
                {ing.category}
              </div>

              {/* Accent Underline */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: ing.color }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
