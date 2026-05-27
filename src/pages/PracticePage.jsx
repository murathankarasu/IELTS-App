import { useState, useMemo } from 'react';
import { QUESTIONS, CATEGORIES } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { saveAnswer } from '../utils/storage';

function ResultScreen({ score, total, category, onRetry, onHome }) {
  const pct = Math.round((score / total) * 100);
  const msg = pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort — keep practising!' : 'Keep going — every mistake is a learning opportunity!';
  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{msg}</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 my-6">
        <p className="text-5xl font-bold text-blue-600 mb-1">{score}/{total}</p>
        <p className="text-slate-500">Questions Correct</p>
        <div className="mt-4 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-blue-600 font-semibold mt-2">{pct}% accuracy</p>
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 transition-colors">
          Practice Again
        </button>
        <button onClick={onHome} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl py-3 transition-colors">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function PracticePage({ category, onHome }) {
  const questions = useMemo(() => {
    const pool = category ? QUESTIONS.filter(q => q.category === category) : QUESTIONS;
    return [...pool].sort(() => Math.random() - 0.5);
  }, [category]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [key, setKey] = useState(0);

  const catInfo = CATEGORIES.find(c => c.id === category);

  const handleAnswer = (questionId, cat, isCorrect) => {
    saveAnswer(questionId, cat, isCorrect);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setKey(k => k + 1);
  };

  if (finished) {
    return (
      <ResultScreen
        score={score}
        total={questions.length}
        category={category}
        onRetry={handleRetry}
        onHome={onHome}
      />
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back button + title */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onHome} className="text-slate-400 hover:text-slate-600 transition-colors">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          {catInfo ? `${catInfo.icon} ${catInfo.label}` : 'All Categories'}
        </h1>
      </div>

      <ProgressBar current={currentIndex + 1} total={questions.length} className="mb-5" />

      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
        <span>Score: <span className="text-blue-600 font-semibold">{score}</span></span>
        <span>Remaining: {questions.length - currentIndex}</span>
      </div>

      <QuestionCard
        key={`${key}-${currentIndex}`}
        question={current}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        onNext={handleNext}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
