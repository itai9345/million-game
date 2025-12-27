import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Phone, Users } from 'lucide-react';

export default function LifelineModal({ type, data, onClose }) {
  if (!type) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700 shadow-2xl"
        >
          {type === 'phone' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-violet-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">טלפון לחבר</h3>
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
                <p className="text-slate-300 text-right leading-relaxed">
                  "{data?.advice}"
                </p>
                <p className="text-violet-400 text-sm mt-2 text-right">
                  — החבר שלך
                </p>
              </div>
              <p className="text-amber-400 text-sm">
                ביטחון: {data?.confidence}%
              </p>
            </div>
          )}
          
          {type === 'audience' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-violet-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">שאלת קהל</h3>
              <div className="space-y-3 mb-4">
                {data?.votes?.map((vote, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-slate-400 w-6">{['א', 'ב', 'ג', 'ד'][index]}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-6 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${vote}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                      />
                    </div>
                    <span className="text-white font-bold w-12 text-left">{vote}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Button
            onClick={onClose}
            className="w-full mt-4 bg-violet-600 hover:bg-violet-700"
          >
            הבנתי
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}