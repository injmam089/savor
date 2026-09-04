'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Coins, Check, Sparkles, Lock, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UPGRADES, GameUpgrade } from '@/lib/game-data';
import { gameAudio } from '@/lib/game-audio';

interface GameShopModalProps {
  coins: number;
  unlockedItems: string[];
  equippedTheme: string;
  onBuyUpgrade: (item: GameUpgrade) => Promise<boolean>;
  onEquipTheme: (themeId: string) => void;
  onClose: () => void;
}

export function GameShopModal({
  coins,
  unlockedItems,
  equippedTheme,
  onBuyUpgrade,
  onEquipTheme,
  onClose,
}: GameShopModalProps) {
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'equipment' | 'theme'>('all');

  const handlePurchase = async (upgrade: GameUpgrade) => {
    if (coins < upgrade.cost || unlockedItems.includes(upgrade.id) || buyingId) return;
    setBuyingId(upgrade.id);
    const success = await onBuyUpgrade(upgrade);
    if (success) {
      gameAudio.playCoin();
    }
    setBuyingId(null);
  };

  const filteredUpgrades = UPGRADES.filter((u) => {
    if (activeTab === 'all') return true;
    return u.category === activeTab;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-zinc-900 to-black border border-white/15 rounded-3xl p-5 md:p-7 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Chef Upgrades Shop</h2>
              <p className="text-xs text-zinc-400">Spend coins earned from shifts to upgrade kitchen gear</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Coins Balance */}
            <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 px-3 py-1.5 rounded-xl">
              <Coins className="h-4 w-4 text-amber-400 animate-spin" />
              <span className="font-extrabold text-sm text-amber-400">{coins}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-zinc-400 hover:text-white rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-4">
          {(['all', 'equipment', 'theme'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Items' : tab === 'equipment' ? 'Equipment' : 'Kitchen Themes'}
            </button>
          ))}
        </div>

        {/* Upgrades List / Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {filteredUpgrades.map((upgrade) => {
            const isOwned = unlockedItems.includes(upgrade.id);
            const canAfford = coins >= upgrade.cost;
            const isEquippedTheme = upgrade.category === 'theme' && equippedTheme === upgrade.id;

            return (
              <div
                key={upgrade.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isOwned
                    ? 'bg-zinc-900/60 border-green-500/30'
                    : canAfford
                    ? 'bg-zinc-900/90 border-white/15 hover:border-amber-500/50'
                    : 'bg-zinc-950/60 border-white/5 opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl p-2 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                    {upgrade.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">{upgrade.name}</span>
                      {isOwned && (
                        <span className="bg-green-500/20 text-green-400 border border-green-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Check className="h-3 w-3" /> Owned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 max-w-md">{upgrade.description}</p>
                  </div>
                </div>

                {/* Purchase / Equip Button */}
                <div className="w-full sm:w-auto flex items-center justify-end">
                  {isOwned ? (
                    upgrade.category === 'theme' ? (
                      <Button
                        size="sm"
                        onClick={() => onEquipTheme(upgrade.id)}
                        disabled={isEquippedTheme}
                        className={`text-xs font-bold rounded-xl ${
                          isEquippedTheme
                            ? 'bg-primary/20 text-primary border border-primary/40'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                        }`}
                      >
                        {isEquippedTheme ? 'Equipped' : 'Equip Theme'}
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Active in Game
                      </span>
                    )
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(upgrade)}
                      disabled={!canAfford || !!buyingId}
                      className={`text-xs font-black uppercase rounded-xl gap-1.5 px-4 shadow-md ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-zinc-950 shadow-amber-500/20'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="h-3.5 w-3.5" />
                      <span>{upgrade.cost} Coins</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <p className="text-[11px] text-zinc-500">
            Earn coins by fulfilling customer orders with high speed and long combos!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
