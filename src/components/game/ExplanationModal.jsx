import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ExplanationModal({ isOpen, isCorrect, correctAnswer, explanation, onContinue }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 max-w-lg w-full border border-slate-700 shadow-2xl"
          dir="rtl"
        >
          <div className="text-center mb-6">
            {isCorrect ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-emerald-500/50"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-emerald-400 mb-2">
                  נכון מאוד!
                </h2>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-red-500/50"
                >
                  <XCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-red-400 mb-2">
                  תשובה שגויה
                </h2>
                <p className="text-slate-300 text-lg mb-4">
                  התשובה הנכונה היא: <span className="text-emerald-400 font-bold">{correctAnswer}</span>
                </p>
              </>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 rounded-xl p-5 mb-6 border border-slate-700"
          >
            <h3 className="text-violet-300 font-bold mb-3 text-lg">הסבר:</h3>
            <p className="text-slate-200 leading-relaxed text-right">
              {explanation}
            </p>
          </motion.div>

          <Button
            onClick={onContinue}
            size="lg"
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-lg py-6"
          >
            המשך
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}