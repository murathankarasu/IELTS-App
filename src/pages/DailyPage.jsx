import { useState, useMemo } from 'react';
import { QUESTIONS } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { saveAnswer, getWeakCategories } from '../utils/storage';

function buildDailySet() {
  const grammar = QUESTIONS.filter(q => q.category === 'grammar').sort(() => Math.random() - 0.5).slice(0, 10);
  const coll = QUESTIONS.filter(q => q.category === 'collocations').sort(() => Math.random() - 0.5).slice(0, 10);
  const rewrite = QUESTIONS.filter(q => q.type === 'rewrite').sort(() => Math.random() - 0.5).slice(0, 5);
  return [...grammar, ...coll, ...rewrite].sort(() => Math.random() - 0.5);
}

function DailyResult({ score, total, results, onHome }) {
  const pct = Math.round((score / total) * 100);
  const catBreakdown = {};
  results.forEach(({ category, correct }) => {
    if (!catBreakdown[category]) catBreakdown[category] = { correct: 0, total: 0 };
    catBreakdown[category].total += 1;
    if (correct) catBreakdown[category].correct += 1;
  });

  const worstCat = Object.entries(catBreakdown)
    .map(([cat, { correct, total }]) => ({ cat, acc: Math.round((correct / total) * 100) }))
    .sort((a, b) => a.acc - b.acc)[0];

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold text-slate-800">Daily Practice Complete!</h2>
        <p className="text-slate-500 mt-1">Great work on completing today's session.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 text-center shadow-sm">
        <p className="text-5xl font-bold text-blue-600 mb-1">{score}/{total}</p>
        <p className="text-slate-500 mb-3">Questions Correct</p>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-blue-600 font-semibold mt-2">{pct}% accuracy today</p>
      </div>

      {/* Category breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm">
        <p className="font-semibold text-slate-700 mb-3">Today's Breakdown</p>
        {Object.entries(catBreakdown).map(([cat, { correct, total: t }]) => {
          const a = Math.round((correct / t) * 100);
          return (
            <div key={cat} className="flex items-center gap-3 mb-2">
              <span className="text-slate-600 text-sm w-28 capitalize">{cat.replace('_', ' ')}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${a >= 70 ? 'bg-green-500' : a >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                  style={{ width: `${a}%` }}
                />
              </div>
              <span className={`text-sm font-semibold w-10 text-right ${a >= 70 ? 'text-green-600' : a >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                {a}%
              </span>
            </div>
          );
        })}
      </div>

      {worstCat && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Recommendation</p>
          <p className="text-slate-700 text-sm">
            Your weakest area today was <span className="font-semibold text-amber-700">{worstCat.cat.replace('_', ' ')}</span> ({worstCat.acc}%).
            Consider doing extra practice in this category tomorrow.
          </p>
        </div>
      )}

      <button
        onClick={onHome}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default function DailyPage({ onHome }) {
  const questions = useMemo(() => buildDailySet(), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const [key, setKey] = useState(0);

  const handleAnswer = (questionId, category, isCorrect) => {
    saveAnswer(questionId, category, isCorrect);
    if (isCorrect) setScore(s => s + 1);
    setResults(r => [...r, { category, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  if (finished) {
    return <DailyResult score={score} total={questions.length} results={results} onHome={onHome} />;
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onHome} className="text-slate-400 hover:text-slate-600 transition-colors text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-slate-800">📅 Daily Practice</h1>
      </div>
      <p className="text-slate-500 text-sm mb-4">
        {questions.length} questions · Grammar · Collocations · Rewrite
      </p>

      <ProgressBar current={currentIndex + 1} total={questions.length} className="mb-5" />

      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
        <span>Score: <span className="text-blue-600 font-semibold">{score}</span></span>
        <span>{questions.length - currentIndex - 1} questions remaining</span>
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
