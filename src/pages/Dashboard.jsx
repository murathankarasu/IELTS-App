import { CATEGORIES } from '../data/questions';
import { WORD_BANK } from '../data/wordbank';
import { getCategoryStats, getTotalStats, getSavedWords } from '../utils/storage';
import { getStoredGeminiWords } from '../utils/gemini';

const COLOR_BG = {
  blue: 'bg-blue-50 border-blue-200 hover:border-blue-400',
  purple: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  orange: 'bg-orange-50 border-orange-200 hover:border-orange-400',
  green: 'bg-green-50 border-green-200 hover:border-green-400',
  red: 'bg-red-50 border-red-200 hover:border-red-400',
  indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
  teal: 'bg-teal-50 border-teal-200 hover:border-teal-400',
  pink: 'bg-pink-50 border-pink-200 hover:border-pink-400',
};

const COLOR_TEXT = {
  blue: 'text-blue-700', purple: 'text-purple-700', orange: 'text-orange-700',
  green: 'text-green-700', red: 'text-red-700', indigo: 'text-indigo-700',
  teal: 'text-teal-700', pink: 'text-pink-700',
};

export default function Dashboard({ onNavigate }) {
  const stats = getCategoryStats();
  const { totalAttempts, totalCorrect, totalQuestions } = getTotalStats();
  const overallAcc = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null;
  const totalWords = WORD_BANK.length + getStoredGeminiWords().length;
  const savedCount = getSavedWords().length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Grammar & Collocation Trainer</h1>
        <p className="text-slate-500">IELTS Writing Practice — identify and fix real mistakes</p>
      </div>

      {/* Overall stats */}
      {totalAttempts > 0 && (
        <div className="bg-blue-600 text-white rounded-2xl p-5 mb-6 flex gap-6 justify-around">
          <div className="text-center">
            <p className="text-3xl font-bold">{totalAttempts}</p>
            <p className="text-blue-200 text-sm">Questions Attempted</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{overallAcc}%</p>
            <p className="text-blue-200 text-sm">Overall Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{totalQuestions}</p>
            <p className="text-blue-200 text-sm">Unique Questions</p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => onNavigate('daily')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 text-left transition-colors shadow-sm"
        >
          <span className="text-2xl mb-2 block">📅</span>
          <p className="font-semibold text-lg">Daily Practice</p>
          <p className="text-blue-200 text-sm">25 mixed questions</p>
        </button>
        <button
          onClick={() => onNavigate('weaknesses')}
          className="bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300 text-slate-800 rounded-2xl p-5 text-left transition-colors shadow-sm"
        >
          <span className="text-2xl mb-2 block">🎯</span>
          <p className="font-semibold text-lg">My Weaknesses</p>
          <p className="text-slate-500 text-sm">Focus on weak areas</p>
        </button>
      </div>

      {/* Band 7 Word Bank section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">📚 Band 7 Kelime Bankası</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('wordbank')}
            className="bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 hover:border-indigo-400 rounded-2xl p-4 text-left transition-all shadow-sm"
          >
            <span className="text-2xl mb-1 block">📚</span>
            <p className="font-semibold text-indigo-700 text-sm">Kelime Bankası</p>
            <p className="text-indigo-400 text-xs">{totalWords} collocation</p>
          </button>
          <button
            onClick={() => onNavigate('dailywords')}
            className="bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 hover:border-amber-400 rounded-2xl p-4 text-left transition-all shadow-sm"
          >
            <span className="text-2xl mb-1 block">🌟</span>
            <p className="font-semibold text-amber-700 text-sm">Günlük Kelimeler</p>
            <p className="text-amber-400 text-xs">10 kelime/gün</p>
          </button>
          <button
            onClick={() => onNavigate('mywords')}
            className="bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 hover:border-yellow-400 rounded-2xl p-4 text-left transition-all shadow-sm"
          >
            <span className="text-2xl mb-1 block">⭐</span>
            <p className="font-semibold text-yellow-700 text-sm">Kelimelerim</p>
            <p className="text-yellow-500 text-xs">{savedCount} kaydedilmiş</p>
          </button>
        </div>
      </div>

      {/* Category list */}
      <h2 className="text-lg font-semibold text-slate-700 mb-3">Practice by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map(cat => {
          const s = stats[cat.id];
          const acc = s?.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : null;
          return (
            <button
              key={cat.id}
              onClick={() => onNavigate('practice', { category: cat.id })}
              className={`border-2 rounded-2xl p-4 text-left transition-all shadow-sm ${COLOR_BG[cat.color]}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xl">{cat.icon}</span>
                  <p className={`font-semibold mt-1 ${COLOR_TEXT[cat.color]}`}>{cat.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {s?.attempts ? `${s.attempts} attempts · ${acc}% accuracy` : 'Not started yet'}
                  </p>
                </div>
                {acc !== null && (
                  <div className={`text-2xl font-bold ${acc >= 70 ? 'text-green-600' : acc >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                    {acc}%
                  </div>
                )}
              </div>
              {s?.attempts > 0 && (
                <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${acc >= 70 ? 'bg-green-500' : acc >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${acc}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
