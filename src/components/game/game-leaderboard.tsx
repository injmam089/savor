'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Calendar, Sparkles, Flame, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
  rank: number;
  id: string;
  playerName: string;
  avatar: string | null;
  score: number;
  levelReached: number;
  ordersServed: number;
  maxCombo: number;
  coinsEarned: number;
  createdAt: string;
  isRegistered: boolean;
}

export function GameLeaderboard() {
  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'today'>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/game/leaderboard?timeframe=${timeframe}`);
      const data = await res.json();
      if (data.success) {
        setEntries(data.leaderboard || []);
      }
    } catch (e) {
      console.error('Failed to load leaderboard', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const top3 = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div id="leaderboard" className="w-full bg-zinc-950/80 border border-white/10 rounded-3xl p-5 md:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest mb-1">
            <Trophy className="h-4 w-4" /> Global Hall of Fame
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Chef Leaderboard
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe Buttons */}
          <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-2xl">
            {(['all', 'week', 'today'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  timeframe === t
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All-Time' : t === 'week' ? 'This Week' : 'Today'}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={fetchLeaderboard}
            disabled={isLoading}
            className="h-9 w-9 rounded-xl border border-white/10 text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-b from-slate-800/60 to-zinc-900/90 border border-slate-400/40 rounded-3xl p-5 text-center relative overflow-hidden flex flex-col items-center justify-center order-2 md:order-1"
            >
              <div className="w-8 h-8 rounded-full bg-slate-300 text-zinc-950 font-black text-xs flex items-center justify-center mb-2 shadow-md">
                2
              </div>
              <div className="text-3xl mb-1">🥈</div>
              <div className="font-black text-base text-white truncate max-w-full">
                {top3[1].playerName}
              </div>
              <div className="text-xl font-black text-slate-300 mt-1">
                {top3[1].score.toLocaleString()} <span className="text-xs font-bold text-zinc-400">PTS</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
                <span>Lvl {top3[1].levelReached}</span>
                <span>•</span>
                <span>{top3[1].ordersServed} Orders</span>
              </div>
            </motion.div>
          )}

          {/* Rank 1 (Gold / Champion) */}
          {top3[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-b from-amber-500/20 via-yellow-600/15 to-zinc-900 border-2 border-amber-400 rounded-3xl p-6 text-center relative overflow-hidden flex flex-col items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] order-1 md:order-2"
            >
              <div className="absolute top-2 right-2 text-amber-400">
                <Crown className="h-5 w-5 animate-bounce" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-zinc-950 font-black text-sm flex items-center justify-center mb-2 shadow-lg">
                1
              </div>
              <div className="text-4xl mb-1">👑</div>
              <div className="font-black text-lg text-amber-300 truncate max-w-full">
                {top3[0].playerName}
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {top3[0].score.toLocaleString()} <span className="text-xs font-bold text-primary">PTS</span>
              </div>
              <div className="text-xs text-amber-400/80 font-bold mt-1 flex items-center gap-2">
                <span>Level {top3[0].levelReached}</span>
                <span>•</span>
                <span>{top3[0].ordersServed} Served</span>
                <span>•</span>
                <span>{top3[0].maxCombo}x Combo</span>
              </div>
            </motion.div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-b from-amber-900/30 to-zinc-900/90 border border-amber-700/40 rounded-3xl p-5 text-center relative overflow-hidden flex flex-col items-center justify-center order-3"
            >
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center mb-2 shadow-md">
                3
              </div>
              <div className="text-3xl mb-1">🥉</div>
              <div className="font-black text-base text-white truncate max-w-full">
                {top3[2].playerName}
              </div>
              <div className="text-xl font-black text-amber-500 mt-1">
                {top3[2].score.toLocaleString()} <span className="text-xs font-bold text-zinc-400">PTS</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
                <span>Lvl {top3[2].levelReached}</span>
                <span>•</span>
                <span>{top3[2].ordersServed} Orders</span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Rankings Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-white/5 bg-zinc-900/40">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-zinc-400 uppercase font-black tracking-wider text-[10px]">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Chef</th>
              <th className="py-3 px-4 text-right">Score</th>
              <th className="py-3 px-4 text-center">Level</th>
              <th className="py-3 px-4 text-center">Orders</th>
              <th className="py-3 px-4 text-center">Max Combo</th>
              <th className="py-3 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-medium">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500">
                  {isLoading ? 'Loading leaderboard scores...' : 'No scores recorded yet in this timeframe. Be the first to set a record!'}
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-black">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-[11px] ${
                        entry.rank === 1
                          ? 'bg-amber-400 text-zinc-950 font-black'
                          : entry.rank === 2
                          ? 'bg-slate-300 text-zinc-950 font-bold'
                          : entry.rank === 3
                          ? 'bg-amber-700 text-white font-bold'
                          : 'text-zinc-400'
                      }`}
                    >
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-primary">
                        {entry.playerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{entry.playerName}</span>
                          {entry.isRegistered && (
                            <span className="bg-primary/20 text-primary text-[9px] font-black uppercase px-1.5 py-0.2 rounded border border-primary/30">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-black text-amber-400 text-sm">
                    {entry.score.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-zinc-300">
                    Lvl {entry.levelReached}
                  </td>
                  <td className="py-3 px-4 text-center text-zinc-400">
                    {entry.ordersServed}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-orange-400">
                    {entry.maxCombo}x
                  </td>
                  <td className="py-3 px-4 text-right text-zinc-500 text-[11px]">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
