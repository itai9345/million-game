import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Phone, Users, Percent } from 'lucide-react';
import { cn } from "@/lib/utils";

const LIFELINES = [
  { id: 'fifty', icon: Percent, label: '50:50' },
  { id: 'audience', icon: Users, label: 'קהל' },
  { id: 'phone', icon: Phone, label: 'טלפון' },
];

export default function Lifelines({ usedLifelines, onUseLifeline, disabled }) {
  return (
    <div className="flex gap-3 justify-center">
      {LIFELINES.map((lifeline, index) => {
        const isUsed = usedLifelines.includes(lifeline.id);
        const Icon = lifeline.icon;
        
        return (
          <motion.div
            key={lifeline.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              size="lg"
              disabled={isUsed || disabled}
              onClick={() => onUseLifeline(lifeline.id)}
              className={cn(
                "relative w-20 h-20 rounded-full border-2 transition-all duration-300",
                isUsed 
                  ? "bg-slate-800/50 border-slate-700 opacity-40 cursor-not-allowed" 
                  : "bg-gradient-to-br from-violet-600/20 to-purple-700/20 border-violet-400/50 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/30"
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className={cn(
                  "w-6 h-6",
                  isUsed ? "text-slate-600" : "text-violet-300"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  isUsed ? "text-slate-600" : "text-violet-200"
                )}>
                  {lifeline.label}
                </span>
              </div>
              {isUsed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-0.5 bg-red-500/60 rotate-45 rounded-full" />
                </div>
              )}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}