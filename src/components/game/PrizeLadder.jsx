import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const PRIZE_LEVELS = [
  { level: 15, prize: 1000000, milestone: true },
  { level: 14, prize: 500000, milestone: false },
  { level: 13, prize: 250000, milestone: false },
  { level: 12, prize: 125000, milestone: false },
  { level: 11, prize: 64000, milestone: false },
  { level: 10, prize: 32000, milestone: true },
  { level: 9, prize: 16000, milestone: false },
  { level: 8, prize: 8000, milestone: false },
  { level: 7, prize: 4000, milestone: false },
  { level: 6, prize: 2000, milestone: false },
  { level: 5, prize: 1000, milestone: true },
  { level: 4, prize: 500, milestone: false },
  { level: 3, prize: 300, milestone: false },
  { level: 2, prize: 200, milestone: false },
  { level: 1, prize: 100, milestone: false },
];

export default function PrizeLadder({ currentLevel }) {
  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-800/90 rounded-2xl p-4 backdrop-blur-sm border border-slate-700/50">
      <div className="space-y-1">
        {PRIZE_LEVELS.map((item) => (
          <motion.div
            key={item.level}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (15 - item.level) * 0.05 }}
            className={cn(
              "flex items-center justify-between px-3 py-1.5 rounded-lg transition-all duration-300",
              currentLevel === item.level && "bg-gradient-to-r from-amber-500/30 to-amber-600/30 border border-amber-400/50 shadow-lg shadow-amber-500/20",
              currentLevel > item.level && "opacity-50",
              item.milestone && currentLevel !== item.level && "bg-violet-900/30 border border-violet-500/30"
            )}
          >
            <span className={cn(
              "text-sm font-medium",
              currentLevel === item.level ? "text-amber-300" : item.milestone ? "text-violet-300" : "text-slate-400"
            )}>
              {item.level}
            </span>
            <span className={cn(
              "text-sm font-bold tracking-wide",
              currentLevel === item.level ? "text-amber-300" : item.milestone ? "text-violet-300" : "text-slate-300"
            )}>
              ₪{item.prize.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export { PRIZE_LEVELS };