'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trophy, Sparkles, Volume2, VolumeX, Shield, Flame, ShoppingBag, ListOrdered, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameHud } from './game-hud';
import { OrderQueue, ActiveOrder } from './order-queue';
import { CookingStation, FloatingParticle } from './cooking-station';
import { IngredientPantry } from './ingredient-pantry';
import { EventBanner, GameEventType } from './event-banner';
import { GameOverModal } from './game-over-modal';
import { LevelCompleteModal } from './level-complete-modal';
import { PauseModal } from './pause-modal';
import { GameShopModal } from './game-shop-modal';
import {
  GAME_LEVELS,
  RECIPES,
  INGREDIENTS,
  CUSTOMERS,
  UPGRADES,
  GameLevel,
  GameRecipe,
  CustomerType,
  GameUpgrade,
} from '@/lib/game-data';
import { gameAudio } from '@/lib/game-audio';
import { useSession } from 'next-auth/react';

type GameState = 'menu' | 'playing' | 'paused' | 'level_complete' | 'game_over';

export function SavorRushGame() {
  const { data: session } = useSession();

  // ─── CORE GAME STATES ─────────────────────────────────────
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [maxLives, setMaxLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(1);
  const [maxComboRun, setMaxComboRun] = useState<number>(1);
  const [ordersServedTotal, setOrdersServedTotal] = useState<number>(0);
  const [ordersInCurrentLevel, setOrdersInCurrentLevel] = useState<number>(0);

  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Plating Station State
  const [currentPlate, setCurrentPlate] = useState<string[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);
  const [shakeKey, setShakeKey] = useState<number>(0);
  const [lastMistakeText, setLastMistakeText] = useState<string | null>(null);

  // Active Orders Queue
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);

  // Special Events
  const [currentEvent, setCurrentEvent] = useState<GameEventType>(null);
  const [isKitchenChaos, setIsKitchenChaos] = useState<boolean>(false);

  // Upgrades & Progression State
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [equippedTheme, setEquippedTheme] = useState<string>('classic');
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);

  // References for timers
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const orderSpawnRef = useRef<NodeJS.Timeout | null>(null);
  const eventTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLevel: GameLevel = GAME_LEVELS[currentLevelIndex] || GAME_LEVELS[0];

  // ─── INITIALIZATION & PERSISTENCE ─────────────────────────

  useEffect(() => {
    // Load local highscore and progression
    const savedHigh = localStorage.getItem('savor_rush_highscore');
    if (savedHigh) setHighScore(parseInt(savedHigh, 10));

    const savedCoins = localStorage.getItem('savor_rush_coins');
    if (savedCoins) setCoins(parseInt(savedCoins, 10));

    const savedUpgrades = localStorage.getItem('savor_rush_upgrades');
    if (savedUpgrades) {
      try {
        setUnlockedItems(JSON.parse(savedUpgrades));
      } catch {}
    }

    setIsMuted(gameAudio.isMuted());

    // Fetch cloud progression if authenticated
    if (session?.user) {
      fetch('/api/game/progress')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.progress) {
            if (data.progress.coins) setCoins((c) => Math.max(c, data.progress.coins));
            if (data.progress.highestScore) setHighScore((h) => Math.max(h, data.progress.highestScore));
            if (data.progress.unlockedItems?.length) {
              setUnlockedItems((prev) => Array.from(new Set([...prev, ...data.progress.unlockedItems])));
            }
          }
        })
        .catch(() => {});
    }
  }, [session]);

  // Apply purchased upgrades effects
  const hasGoldenSpatula = unlockedItems.includes('golden_spatula');
  const hasTurboStove = unlockedItems.includes('turbo_stove');
  const hasIceClock = unlockedItems.includes('ice_clock');
  const hasMasterApron = unlockedItems.includes('master_apron');

  // Compute available ingredient IDs for the current level
  const availableIngredientIds = Array.from(
    new Set(
      currentLevel.availableRecipes.flatMap((recipeId) => RECIPES[recipeId]?.ingredients || [])
    )
  );

  // ─── ORDER SPAWNER ────────────────────────────────────────

  const spawnOrder = useCallback(() => {
    setActiveOrders((prev) => {
      if (prev.length >= currentLevel.maxActiveOrders) return prev;

      // Select random recipe from level pool
      const recipeKey =
        currentLevel.availableRecipes[
          Math.floor(Math.random() * currentLevel.availableRecipes.length)
        ];
      const recipe = RECIPES[recipeKey];
      if (!recipe) return prev;

      // Select customer persona
      let customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
      let isVip = false;
      let isSpeed = false;

      // Trigger Special events based on chance
      if (currentEvent === 'vip' || (Math.random() < 0.15 && currentLevel.level >= 2)) {
        customer = CUSTOMERS.find((c) => c.isVip) || customer;
        isVip = true;
      } else if (currentEvent === 'speed_order' || (Math.random() < 0.15 && currentLevel.level >= 3)) {
        customer = CUSTOMERS.find((c) => c.isSpeed) || customer;
        isSpeed = true;
      }

      // Calculate patience duration
      let duration = recipe.baseTime * currentLevel.timeMultiplier * customer.patienceMultiplier;
      if (hasIceClock) duration *= 1.2;
      if (isSpeed) duration = Math.min(12, duration * 0.6);

      const newOrder: ActiveOrder = {
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        recipe,
        customer,
        totalTime: duration,
        timeLeft: duration,
        isVip,
        isSpeed,
        createdAt: Date.now(),
      };

      if (isVip) gameAudio.playVIP();

      return [...prev, newOrder];
    });
  }, [currentLevel, currentEvent, hasIceClock]);

  // ─── PARTICLES & FEEDBACK ─────────────────────────────────

  const addParticle = (text: string, color: string = '#FBBF24', isCombo: boolean = false) => {
    const newP: FloatingParticle = {
      id: `p-${Date.now()}-${Math.random()}`,
      text,
      x: 40 + Math.random() * 20,
      y: 50 + Math.random() * 10,
      color,
      isCombo,
    };
    setFloatingParticles((prev) => [...prev, newP]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newP.id));
    }, 900);
  };

  const triggerMistake = (message: string) => {
    gameAudio.playError();
    setShakeKey((k) => k + 1);
    setLastMistakeText(message);
    setCombo(1); // Reset combo

    // Screen flash red effect
    setTimeout(() => {
      setLastMistakeText(null);
    }, 1500);
  };

  // ─── INGREDIENT SELECTION & DISH MATCHING ─────────────────

  const handleSelectIngredient = (ingredientId: string) => {
    if (gameState !== 'playing') return;

    gameAudio.playPop();

    // Check if adding this ingredient is valid for any active order
    const testPlate = [...currentPlate, ingredientId];

    // Find if there is any active order whose ingredient sequence starts with testPlate
    const matchingOrder = activeOrders.find((o) => {
      if (testPlate.length > o.recipe.ingredients.length) return false;
      return testPlate.every((ing, idx) => o.recipe.ingredients[idx] === ing);
    });

    if (matchingOrder) {
      // Correct ingredient placed!
      gameAudio.playSizzle();
      setCurrentPlate(testPlate);
      setSelectedOrderId(matchingOrder.id);
    } else {
      // Wrong ingredient for the current sequence
      const ingName = INGREDIENTS[ingredientId]?.name || 'ingredient';
      triggerMistake(`❌ Wrong item (${ingName})! Check the active order recipe!`);
    }
  };

  // ─── DISH SERVING ─────────────────────────────────────────

  // Check if plate matches any active order ready to be served
  const readyToServeOrder = activeOrders.find(
    (o) =>
      o.recipe.ingredients.length === currentPlate.length &&
      o.recipe.ingredients.every((ing, idx) => currentPlate[idx] === ing)
  );

  const canServe = !!readyToServeOrder;

  const handleServeDish = () => {
    if (!readyToServeOrder || gameState !== 'playing') return;

    gameAudio.playBell();

    const order = readyToServeOrder;
    const basePts = order.recipe.basePoints;
    const baseCoins = order.recipe.baseCoins;

    // Multipliers
    const comboMult = combo >= 5 ? 3.0 : combo >= 4 ? 2.5 : combo >= 3 ? 2.0 : combo >= 2 ? 1.5 : 1.0;
    const spatulaBoost = hasGoldenSpatula ? 1.25 : 1.0;
    const vipBoost = order.isVip ? 2.5 : order.isSpeed ? 2.0 : 1.0;
    const rushHourBoost = currentEvent === 'rush_hour' ? 1.5 : 1.0;

    const earnedPoints = Math.round(basePts * comboMult * spatulaBoost * vipBoost * rushHourBoost);
    const earnedCoins = Math.round(baseCoins * (order.isVip ? 3.0 : 1.0) * (currentEvent === 'rush_hour' ? 1.5 : 1.0));

    // Update stats
    setScore((s) => {
      const nextScore = s + earnedPoints;
      if (nextScore > highScore) {
        setHighScore(nextScore);
        localStorage.setItem('savor_rush_highscore', String(nextScore));
      }
      return nextScore;
    });

    setCoins((c) => {
      const nextCoins = c + earnedCoins;
      localStorage.setItem('savor_rush_coins', String(nextCoins));
      return nextCoins;
    });

    // Combo handling
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setMaxComboRun((m) => Math.max(m, nextCombo));
    gameAudio.playCombo(nextCombo);

    // Particle animations
    addParticle(`+${earnedPoints} PTS!`, '#4ADE80');
    if (nextCombo > 1) {
      setTimeout(() => {
        addParticle(`${comboMult.toFixed(1)}x COMBO! 🔥`, '#FB923C', true);
      }, 150);
    }
    gameAudio.playCoin();

    // Remove fulfilled order
    setActiveOrders((prev) => prev.filter((o) => o.id !== order.id));
    setCurrentPlate([]);
    setSelectedOrderId(null);

    // Increment orders served counters
    setOrdersServedTotal((t) => t + 1);
    const nextLevelOrders = ordersInCurrentLevel + 1;
    setOrdersInCurrentLevel(nextLevelOrders);

    // Check Level Complete condition
    if (nextLevelOrders >= currentLevel.ordersToComplete) {
      handleLevelComplete();
    }
  };

  const handleTrashPlate = () => {
    if (currentPlate.length === 0 || gameState !== 'playing') return;
    gameAudio.playTrash();
    setCurrentPlate([]);
    setSelectedOrderId(null);
    addParticle('Plate Cleared 🗑️', '#EF4444');
  };

  // ─── LEVEL PROGRESSION & GAME OVER ────────────────────────

  const handleLevelComplete = () => {
    gameAudio.playLevelWin();
    setGameState('level_complete');

    // Give level reward coins
    setCoins((c) => {
      const nextCoins = c + currentLevel.rewardCoins;
      localStorage.setItem('savor_rush_coins', String(nextCoins));
      return nextCoins;
    });
  };

  const handleNextLevel = () => {
    const nextIndex = currentLevelIndex + 1;
    if (nextIndex < GAME_LEVELS.length) {
      setCurrentLevelIndex(nextIndex);
      setOrdersInCurrentLevel(0);
      setActiveOrders([]);
      setCurrentPlate([]);
      setGameState('playing');
    } else {
      // Infinite mode
      setOrdersInCurrentLevel(0);
      setActiveOrders([]);
      setCurrentPlate([]);
      setGameState('playing');
    }
  };

  const handleGameOver = () => {
    gameAudio.playGameOver();
    setGameState('game_over');
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (orderSpawnRef.current) clearInterval(orderSpawnRef.current);
  };

  const startNewGame = () => {
    const startingLives = hasMasterApron ? 4 : 3;
    setLives(startingLives);
    setMaxLives(startingLives);
    setScore(0);
    setCombo(1);
    setMaxComboRun(1);
    setOrdersServedTotal(0);
    setOrdersInCurrentLevel(0);
    setCurrentLevelIndex(0);
    setActiveOrders([]);
    setCurrentPlate([]);
    setSelectedOrderId(null);
    setCurrentEvent(null);
    setIsKitchenChaos(false);
    setGameState('playing');
  };

  // ─── GAME TICK LOOP (TIMERS & DECAY) ──────────────────────

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setActiveOrders((prev) => {
        const updated: ActiveOrder[] = [];
        let lostLife = false;

        prev.forEach((order) => {
          const nextTime = order.timeLeft - 0.2;
          if (nextTime <= 0) {
            // Customer walked away in anger!
            lostLife = true;
            triggerMistake(`💔 ${order.customer.name} left in frustration!`);
          } else {
            updated.push({ ...order, timeLeft: nextTime });
          }
        });

        if (lostLife) {
          setLives((l) => {
            const nextLives = l - 1;
            if (nextLives <= 0) {
              setTimeout(() => handleGameOver(), 100);
            }
            return Math.max(0, nextLives);
          });
        }

        return updated;
      });
    }, 200);

    gameLoopRef.current = interval;
    return () => clearInterval(interval);
  }, [gameState]);

  // Order Spawning Interval
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Initial spawn if empty
    if (activeOrders.length === 0) {
      spawnOrder();
    }

    const spawnDelay = currentEvent === 'rush_hour' ? 3000 : 5500;
    const interval = setInterval(() => {
      spawnOrder();
    }, spawnDelay);

    orderSpawnRef.current = interval;
    return () => clearInterval(interval);
  }, [gameState, activeOrders.length, currentEvent, spawnOrder]);

  // Random Dynamic Events Generator
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      if (Math.random() < currentLevel.eventChance && !currentEvent) {
        const eventTypes: GameEventType[] = ['rush_hour', 'vip', 'speed_order', 'happy_hour', 'kitchen_chaos'];
        const chosen = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        setCurrentEvent(chosen);

        if (chosen === 'rush_hour') gameAudio.playRushHour();
        else if (chosen === 'vip') gameAudio.playVIP();
        else if (chosen === 'kitchen_chaos') setIsKitchenChaos(true);

        // Auto end event after 12 seconds
        setTimeout(() => {
          setCurrentEvent(null);
          setIsKitchenChaos(false);
        }, 12000);
      }
    }, 18000);

    eventTimerRef.current = interval;
    return () => clearInterval(interval);
  }, [gameState, currentLevel.eventChance, currentEvent]);

  // ─── KEYBOARD HOTKEYS CONTROLLER ──────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      // Global shortcuts
      if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        if (gameState === 'playing') setGameState('paused');
        else if (gameState === 'paused') setGameState('playing');
        return;
      }

      if (e.key.toLowerCase() === 'm') {
        const nextMuted = gameAudio.toggleMute();
        setIsMuted(nextMuted);
        return;
      }

      if (gameState !== 'playing') return;

      // Serving & Trash
      if (e.code === 'Space') {
        e.preventDefault();
        if (canServe) handleServeDish();
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleTrashPlate();
        return;
      }

      // Hotkey for ingredients
      const pressedKey = e.key.toLowerCase();
      const matchedIng = Object.values(INGREDIENTS).find(
        (ing) => ing.key?.toLowerCase() === pressedKey && availableIngredientIds.includes(ing.id)
      );

      if (matchedIng) {
        handleSelectIngredient(matchedIng.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, canServe, availableIngredientIds, currentPlate]);

  // ─── UPGRADE PURCHASE HANDLER ─────────────────────────────

  const handleBuyUpgrade = async (upgrade: GameUpgrade): Promise<boolean> => {
    if (coins < upgrade.cost) return false;

    // Optimistic local update
    const newCoins = coins - upgrade.cost;
    const newUnlocked = [...unlockedItems, upgrade.id];
    setCoins(newCoins);
    setUnlockedItems(newUnlocked);
    localStorage.setItem('savor_rush_coins', String(newCoins));
    localStorage.setItem('savor_rush_upgrades', JSON.stringify(newUnlocked));

    if (session?.user) {
      try {
        await fetch('/api/game/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: upgrade.id }),
        });
      } catch {}
    }

    return true;
  };

  const handleToggleMute = () => {
    const nextMuted = gameAudio.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // ─── RENDER: MENU SCREEN ──────────────────────────────────

  if (gameState === 'menu') {
    return (
      <div
        ref={containerRef}
        className="w-full min-h-[600px] flex flex-col items-center justify-center p-4 relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-center shadow-2xl"
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
          {/* Logo & Chef Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-amber-500 p-0.5 shadow-[0_0_40px_rgba(230,81,0,0.5)] mb-6 flex items-center justify-center"
          >
            <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center text-4xl">
              🍳
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/30 px-3.5 py-1 rounded-full">
              Official SAVOR Arcade Game
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mt-3 mb-2">
              SAVOR RUSH
            </h1>
            <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-amber-400 via-primary to-orange-500 bg-clip-text text-transparent mb-4">
              Kitchen Dash ⚡
            </p>
            <p className="text-xs md:text-sm text-zinc-400 mb-8 max-w-md">
              Run the hottest restaurant in town! Fulfill fast-paced orders, master real SAVOR recipes, build massive combos, and climb the global chef leaderboards.
            </p>
          </motion.div>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-2xl">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-zinc-300">High: {highScore.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-2xl">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">{coins} Coins</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-3">
            <Button
              onClick={startNewGame}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-amber-500 hover:from-primary/90 hover:to-amber-400 text-zinc-950 font-black text-base uppercase tracking-wider shadow-[0_0_30px_rgba(230,81,0,0.5)] gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>Start Chef Shift</span>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setIsShopOpen(true)}
                className="h-12 rounded-2xl border-white/15 hover:bg-white/10 text-xs font-extrabold gap-2"
              >
                <ShoppingBag className="h-4 w-4 text-amber-400" />
                <span>Upgrades Shop</span>
              </Button>

              <Button
                variant="outline"
                asChild
                className="h-12 rounded-2xl border-white/15 hover:bg-white/10 text-xs font-extrabold gap-2"
              >
                <a href="#leaderboard">
                  <ListOrdered className="h-4 w-4 text-cyan-400" />
                  <span>Leaderboard</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Shop Modal */}
        {isShopOpen && (
          <GameShopModal
            coins={coins}
            unlockedItems={unlockedItems}
            equippedTheme={equippedTheme}
            onBuyUpgrade={handleBuyUpgrade}
            onEquipTheme={(t) => setEquippedTheme(t)}
            onClose={() => setIsShopOpen(false)}
          />
        )}
      </div>
    );
  }

  // ─── RENDER: ACTIVE GAME SCREEN ───────────────────────────

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col gap-4 p-3 md:p-6 rounded-3xl relative overflow-hidden select-none ${
        equippedTheme === 'theme_cyberpunk'
          ? 'bg-gradient-to-b from-indigo-950 via-purple-950 to-black border-cyan-500/30'
          : equippedTheme === 'theme_royal'
          ? 'bg-gradient-to-b from-amber-950 via-stone-900 to-black border-amber-500/30'
          : 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border-white/10'
      }`}
    >
      {/* Dynamic Event Banner */}
      <EventBanner event={currentEvent} />

      {/* Top HUD */}
      <GameHud
        score={score}
        highScore={highScore}
        coins={coins}
        lives={lives}
        maxLives={maxLives}
        level={currentLevel.level}
        ordersCompleted={ordersInCurrentLevel}
        ordersRequired={currentLevel.ordersToComplete}
        combo={combo}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onPause={() => setGameState('paused')}
        onRestart={startNewGame}
        onOpenShop={() => setIsShopOpen(true)}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Active Orders Queue */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-primary" /> Active Customer Tickets ({activeOrders.length}/{currentLevel.maxActiveOrders})
          </span>
          <span className="text-[11px] text-zinc-500">Tap a ticket to inspect or auto-plate</span>
        </div>
        <OrderQueue
          orders={activeOrders}
          currentPlatedIngredients={currentPlate}
          selectedOrderId={selectedOrderId}
          onSelectOrder={(id) => setSelectedOrderId(id)}
        />
      </div>

      {/* Center Cooking Station Plating Counter */}
      <CookingStation
        currentPlate={currentPlate}
        activeTargetRecipe={
          selectedOrderId ? activeOrders.find((o) => o.id === selectedOrderId)?.recipe || null : null
        }
        canServe={canServe}
        onServe={handleServeDish}
        onTrash={handleTrashPlate}
        floatingParticles={floatingParticles}
        shakeKey={shakeKey}
        lastMistakeText={lastMistakeText}
      />

      {/* Bottom Ingredient Pantry Shelf */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <ChefHat className="h-3.5 w-3.5 text-amber-400" /> Kitchen Pantry Shelf
          </span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">Use hotkeys or tap items in recipe sequence</span>
        </div>
        <IngredientPantry
          availableIngredientIds={availableIngredientIds}
          onSelectIngredient={handleSelectIngredient}
          isKitchenChaos={isKitchenChaos}
        />
      </div>

      {/* Modals */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={() => setGameState('playing')}
          onRestart={startNewGame}
          onOpenShop={() => setIsShopOpen(true)}
          onQuit={() => setGameState('menu')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {gameState === 'level_complete' && (
        <LevelCompleteModal
          completedLevel={currentLevel}
          nextLevel={GAME_LEVELS[currentLevelIndex + 1] || null}
          score={score}
          coinsEarned={coins}
          bonusCoins={currentLevel.rewardCoins}
          onNextLevel={handleNextLevel}
          onOpenShop={() => setIsShopOpen(true)}
        />
      )}

      {gameState === 'game_over' && (
        <GameOverModal
          score={score}
          highScore={highScore}
          level={currentLevel.level}
          ordersServed={ordersServedTotal}
          maxCombo={maxComboRun}
          coinsEarned={coins}
          defaultPlayerName={session?.user?.name || 'Master Chef'}
          onRestart={startNewGame}
          onOpenShop={() => setIsShopOpen(true)}
          onViewLeaderboard={() => {
            setGameState('menu');
            const el = document.getElementById('leaderboard');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {isShopOpen && (
        <GameShopModal
          coins={coins}
          unlockedItems={unlockedItems}
          equippedTheme={equippedTheme}
          onBuyUpgrade={handleBuyUpgrade}
          onEquipTheme={(t) => setEquippedTheme(t)}
          onClose={() => setIsShopOpen(false)}
        />
      )}
    </div>
  );
}
