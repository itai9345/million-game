import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Loader2, Play, DollarSign, Heart } from 'lucide-react';

import PrizeLadder, { PRIZE_LEVELS } from '@/components/game/PrizeLadder';
import Lifelines from '@/components/game/Lifelines';
import AnswerButton from '@/components/game/AnswerButton';
import QuestionCard from '@/components/game/QuestionCard';
import LifelineModal from '@/components/game/LifelineModal';
import GameOverModal from '@/components/game/GameOverModal';

export default function Game() {
  const [gameState, setGameState] = useState('start'); // start, playing, ended
  const [currentLevel, setCurrentLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [usedLifelines, setUsedLifelines] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [hiddenAnswers, setHiddenAnswers] = useState([]);
  const [lifelineModal, setLifelineModal] = useState({ type: null, data: null });
  const [isWinner, setIsWinner] = useState(false);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: () => base44.entities.Question.list(),
  });

  const currentPrize = useMemo(() => {
    const level = PRIZE_LEVELS.find(l => l.level === currentLevel);
    return level?.prize || 0;
  }, [currentLevel]);

  const guaranteedPrize = useMemo(() => {
    const milestones = PRIZE_LEVELS.filter(l => l.milestone && l.level < currentLevel);
    return milestones.length > 0 ? milestones[0].prize : 0;
  }, [currentLevel]);

  const currentQuestion = useMemo(() => {
    return gameQuestions[currentLevel - 1];
  }, [gameQuestions, currentLevel]);

  const shuffledAnswers = useMemo(() => {
    if (!currentQuestion) return [];
    const answers = [currentQuestion.correct_answer, ...currentQuestion.wrong_answers];
    return answers.sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  const startGame = () => {
    // Select 15 random questions, sorted by difficulty
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const selected = [];

    for (let level = 1; level <= 15; level++) {
      const levelQuestions = shuffled.filter(q =>
        q.difficulty === level && !selected.includes(q)
      );
      if (levelQuestions.length > 0) {
        selected.push(levelQuestions[0]);
      } else {
        // Fallback: use any available question
        const available = shuffled.filter(q => !selected.includes(q));
        if (available.length > 0) {
          selected.push(available[0]);
        }
      }
    }

    setGameQuestions(selected);
    setGameState('playing');
    setCurrentLevel(1);
    setLives(3);
    setUsedLifelines([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setHiddenAnswers([]);
    setIsWinner(false);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answer, index) => {
    if (showResult || selectedAnswer !== null) return;
    setSelectedAnswer(index);

    // Delay before showing result
    setTimeout(() => {
      setShowResult(true);
      const isCorrect = answer === currentQuestion.correct_answer;

      if (isCorrect) {
        // Correct answer - move to next question
        setTimeout(() => {
          if (currentLevel === 15) {
            setIsWinner(true);
            setGameState('ended');
          } else {
            setCurrentLevel(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
            setHiddenAnswers([]);
          }
        }, 2000);
      } else {
        // Wrong answer - show explanation
        setTimeout(() => {
          setShowExplanation(true);
        }, 1500);
      }
    }, 1500);
  };

  const handleContinueAfterWrong = () => {
    const newLives = lives - 1;
    setLives(newLives);

    if (newLives <= 0) {
      setGameState('ended');
    } else {
      // Continue playing with fewer lives
      setCurrentLevel(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setHiddenAnswers([]);
      setShowExplanation(false);
    }
  };

  const useLifeline = (type) => {
    if (usedLifelines.includes(type)) return;

    setUsedLifelines(prev => [...prev, type]);

    if (type === 'fifty') {
      // Remove 2 wrong answers
      const wrongIndices = shuffledAnswers
        .map((ans, i) => ans !== currentQuestion.correct_answer ? i : -1)
        .filter(i => i !== -1);
      const toHide = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
      setHiddenAnswers(toHide);
    } else if (type === 'audience') {
      // Simulate audience votes
      const correctIndex = shuffledAnswers.indexOf(currentQuestion.correct_answer);
      const votes = [10, 10, 10, 10];
      votes[correctIndex] = 40 + Math.floor(Math.random() * 30);
      const remaining = 100 - votes[correctIndex];
      const others = [0, 1, 2, 3].filter(i => i !== correctIndex);
      others.forEach((i, idx) => {
        votes[i] = idx < 2 ? Math.floor(remaining / 3) : remaining - Math.floor(remaining / 3) * 2;
      });
      setLifelineModal({ type: 'audience', data: { votes } });
    } else if (type === 'phone') {
      const confidence = 60 + Math.floor(Math.random() * 35);
      const advice = `אני חושב שהתשובה הנכונה היא "${currentQuestion.correct_answer}". אני ${confidence > 80 ? 'די בטוח' : 'לא לגמרי בטוח'} בזה.`;
      setLifelineModal({ type: 'phone', data: { advice, confidence } });
    }
  };

  const handleTakeMoney = () => {
    setIsWinner(true);
    setGameState('ended');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">טוען שאלות...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex items-center justify-center p-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <motion.div
            animate={{
              boxShadow: ['0 0 30px rgba(251, 191, 36, 0.3)', '0 0 60px rgba(251, 191, 36, 0.5)', '0 0 30px rgba(251, 191, 36, 0.3)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-48 h-48 rounded-full flex items-center justify-center mx-auto mb-8 overflow-hidden"
          >
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694c07c654bc1953e9b73b25/66b33eb68_image.png"
              alt="Chemistry Logo"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 mb-4">
            לעוף על המיליון
          </h1>
          <h2 className="text-xl text-violet-300 mb-2">מהדורת כימיה</h2>
          <p className="text-slate-400 mb-8">
            אנטרופיה • שיווי משקל • אנרגיה
          </p>

          <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">חוקי המשחק:</h3>
            <ul className="text-slate-300 text-right space-y-3 text-sm leading-relaxed">
              <li>• ענה נכון על 15 שאלות כדי לזכות במיליון ₪</li>
              <li>• <span className="text-red-400 font-semibold">3 חיים:</span> יש לך 3 לבבות. כל טעות מורידה לב אחד. המשחק נגמר כשנגמרים כל הלבבות</li>
              <li>• <span className="text-violet-300 font-semibold">3 עזרות:</span> 50:50 (מחיקת 2 תשובות), שאלת קהל, טלפון לחבר</li>
              <li>• <span className="text-amber-300 font-semibold">נקודות ביטחון:</span> הגעת לשאלה 5 (₪1,000) או 10 (₪32,000)? גם אם תטעה אחר כך, תקבל את סכום נקודת הביטחון האחרונה שעברת</li>
              <li>• תוכל לפרוש בכל שלב ולקחת את הכסף שצברת</li>
            </ul>
          </div>

          <Button
            onClick={startGame}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold text-xl px-12 py-6 rounded-xl shadow-lg shadow-amber-500/30"
          >
            <Play className="w-6 h-6 ml-2" />
            התחל לשחק
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
              לעוף על המיליון
            </h1>
            <span className="text-violet-400 text-sm">מהדורת כימיה</span>

            {/* Lives Display */}
            <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${i < lives
                      ? 'fill-red-500 text-red-500'
                      : 'fill-slate-700 text-slate-700'
                    }`}
                />
              ))}
            </div>
          </div>
          <Button
            onClick={handleTakeMoney}
            variant="outline"
            className="border-amber-400/50 text-amber-300 hover:bg-amber-400/10"
          >
            <DollarSign className="w-4 h-4 ml-2" />
            קח את הכסף: ₪{guaranteedPrize.toLocaleString()}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Prize Ladder - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <PrizeLadder currentLevel={currentLevel} />
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Lifelines */}
            <Lifelines
              usedLifelines={usedLifelines}
              onUseLifeline={useLifeline}
              disabled={showResult}
            />

            {/* Question */}
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                currentLevel={currentLevel}
              />
            )}

            {/* Answers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shuffledAnswers.map((answer, index) => (
                <AnswerButton
                  key={index}
                  answer={answer}
                  index={index}
                  onClick={() => handleAnswerSelect(answer, index)}
                  disabled={showResult}
                  isSelected={selectedAnswer === index}
                  isCorrect={answer === currentQuestion?.correct_answer}
                  showResult={showResult}
                  isHidden={hiddenAnswers.includes(index)}
                />
              ))}
            </div>

            {/* Explanation when wrong answer */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-red-900/50 to-rose-900/50 rounded-2xl p-6 border-2 border-red-500/50"
                  dir="rtl"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">❌</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-red-300 mb-2">תשובה שגויה</h3>
                      <p className="text-white text-lg">
                        התשובה הנכונה היא: <span className="text-emerald-400 font-bold">{currentQuestion?.correct_answer}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                    <h4 className="text-violet-300 font-bold mb-2">הסבר:</h4>
                    <p className="text-slate-200 leading-relaxed text-right">
                      {currentQuestion?.explanation || 'אין הסבר זמין'}
                    </p>
                  </div>

                  <Button
                    onClick={handleContinueAfterWrong}
                    size="lg"
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-lg py-6"
                  >
                    המשך
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Prize Display */}
            <div className="lg:hidden bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">שאלה {currentLevel}</span>
                <span className="text-xl font-bold text-amber-400">₪{currentPrize.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lifeline Modal */}
      <LifelineModal
        type={lifelineModal.type}
        data={lifelineModal.data}
        onClose={() => setLifelineModal({ type: null, data: null })}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameState === 'ended'}
        isWinner={isWinner}
        prize={isWinner ? currentPrize : guaranteedPrize}
        onRestart={startGame}
      />
    </div>
  );
}