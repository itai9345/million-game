import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Trophy, XCircle, RotateCcw } from 'lucide-react';

export default function GameOverModal({ isOpen, isWinner, prize, onRestart }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 max-w-md w-full border border-slate-700 shadow-2xl text-center"
        >
          {isWinner ? (
            <>
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/50"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400 mb-4">
                מזל טוב!
              </h2>
              <p className="text-slate-300 text-lg mb-2">
                {prize === 1000000 ? 'עפת על המיליון!' : 'ענית נכון!'}
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/50"
              >
                <XCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-red-400 mb-4">
                תשובה שגויה!
              </h2>
              <p className="text-slate-300 text-lg mb-2">
                המשחק נגמר
              </p>
            </>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700"
          >
            <p className="text-slate-400 text-sm mb-1">הזכייה שלך</p>
            <p className="text-4xl font-bold text-amber-400">
              ₪{prize?.toLocaleString()}
            </p>
          </motion.div>
          
          <Button
            onClick={onRestart}
            size="lg"
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-lg py-6"
          >
            <RotateCcw className="w-5 h-5 ml-2" />
            משחק חדש
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}