import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Beaker, Scale, Zap } from 'lucide-react';

const categoryInfo = {
  entropy: { label: 'אנטרופיה', icon: Beaker, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' },
  equilibrium: { label: 'שיווי משקל', icon: Scale, color: 'bg-violet-500/20 text-violet-300 border-violet-400/50' },
  energy: { label: 'אנרגיה', icon: Zap, color: 'bg-amber-500/20 text-amber-300 border-amber-400/50' },
};

export default function QuestionCard({ question, currentLevel }) {
  const category = categoryInfo[question.category] || categoryInfo.energy;
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-2xl p-6 backdrop-blur-sm border border-slate-700/50 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline" className={`${category.color} px-3 py-1`}>
          <Icon className="w-4 h-4 ml-1" />
          {category.label}
        </Badge>
        <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-500/50 px-3 py-1">
          שאלה {currentLevel} מתוך 15
        </Badge>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed text-right">
        {question.question_text}
      </h2>

      {question.image_url && (
        <div className="mt-4 flex justify-center">
          <img
            src={question.image_url}
            alt="גרף השאלה"
            className="max-w-full h-auto rounded-lg border border-slate-600"
          />
        </div>
      )}
    </motion.div>
  );
}