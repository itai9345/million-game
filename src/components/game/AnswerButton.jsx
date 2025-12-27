import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const ANSWER_LETTERS = ['א', 'ב', 'ג', 'ד'];

export default function AnswerButton({ 
  answer, 
  index, 
  onClick, 
  disabled, 
  isSelected, 
  isCorrect, 
  showResult,
  isHidden 
}) {
  const letter = ANSWER_LETTERS[index];
  
  const getButtonState = () => {
    if (isHidden) return 'hidden';
    if (showResult) {
      if (isCorrect) return 'correct';
      if (isSelected && !isCorrect) return 'wrong';
    }
    if (isSelected) return 'selected';
    return 'default';
  };
  
  const state = getButtonState();
  
  const stateStyles = {
    default: "bg-gradient-to-r from-slate-800/90 to-slate-700/90 border-slate-500/50 hover:border-amber-400/70 hover:shadow-lg hover:shadow-amber-500/20",
    selected: "bg-gradient-to-r from-amber-600/40 to-amber-500/40 border-amber-400 shadow-lg shadow-amber-500/30",
    correct: "bg-gradient-to-r from-emerald-600/50 to-green-500/50 border-emerald-400 shadow-lg shadow-emerald-500/40",
    wrong: "bg-gradient-to-r from-red-600/50 to-rose-500/50 border-red-400 shadow-lg shadow-red-500/40",
    hidden: "opacity-20 pointer-events-none bg-slate-900/50 border-slate-700",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!disabled && state === 'default' ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || isHidden}
      className={cn(
        "relative w-full p-4 rounded-xl border-2 text-right transition-all duration-300",
        stateStyles[state]
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 flex-shrink-0",
          state === 'correct' ? "bg-emerald-500/30 border-emerald-400 text-emerald-300" :
          state === 'wrong' ? "bg-red-500/30 border-red-400 text-red-300" :
          state === 'selected' ? "bg-amber-500/30 border-amber-400 text-amber-300" :
          "bg-violet-500/20 border-violet-400/50 text-violet-300"
        )}>
          {letter}
        </div>
        <span className={cn(
          "text-lg font-medium leading-relaxed",
          state === 'correct' ? "text-emerald-200" :
          state === 'wrong' ? "text-red-200" :
          state === 'selected' ? "text-amber-200" :
          state === 'hidden' ? "text-slate-600" :
          "text-slate-200"
        )}>
          {answer}
        </span>
      </div>
      
      {showResult && isCorrect && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-white text-lg">✓</span>
        </motion.div>
      )}
    </motion.button>
  );
}