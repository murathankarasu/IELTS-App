import { CATEGORIES } from '../data/questions';
import { getWeakCategories, getCategoryStats, getTotalStats, clearProgress } from '../utils/storage';

const COLOR_BAR = {
  blue: 'bg-blue-500', purple: 'bg-purple-500', orange: 'bg-orange-500',
  green: 'bg-green-500', red: 'bg-red-500', indigo: 'bg-indigo-500',
  teal: 'bg-teal-500', pink: 'bg-pink-500',
};

export default function WeaknessesPage({ onNavigate, onHome }) {
  const weak = getWeakCategories();
  const stats = getCategoryStats();
  const { totalAttempts, totalCorrect } = getTotalStats();

  const handleClear = () => {
    if (window.confirm('Clear all progress data? This cannot be undone.')) {
      clearProgress();
      window.location.reload();
    }
  };

  if (weak.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No data yet</h2>
        <p className="text-slate-500 mb-6">Complete some practice questions to see your weak areas.</p>
        <button onClick={onHome} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-3 transition-colors">
          Start Practising
        </button>
      </div>
    );
  }

  const weakest = weak.filter(w => w.accuracy !== null && w.accuracy < 70);
  const top2 = weak.slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onHome} className="text-slate-400 hover:text-slate-600 transition-colors text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-slate-800">My Weaknesses</h1>
      </div>

      {/* Summary card */}
      <div className="bg-blue-600 text-white rounded-2xl p-5 mb-6 flex gap-6 justify-around">
        <div className="text-center">
          <p className="text-3xl font-bold">{totalAttempts}</p>
          <p className="text-blue-200 text-sm">Questions Done</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">
            {totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0}%
          </p>
          <p className="text-blue-200 text-sm">Overall Accuracy</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{weakest.length}</p>
          <p className="text-blue-200 text-sm">Weak Areas</p>
        </div>
      </div>

      {/* Today's recommendation */}
      {top2.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Today's Focus</p>
          <p className="text-slate-700 text-sm mb-3">
            Your weakest areas are{' '}
            {top2.map((w, i) => {
              const cat = CATEGORIES.find(c => c.id === w.category);
              return (
                <span key={w.category} className="font-semibold text-amber-700">
                  {cat?.label}{i < top2.length - 1 ? ' and ' : ''}
                </span>
              );
            })}
            . Practise these today!
          </p>
          <div className="flex gap-2 flex-wrap">
            {top2.map(w => {
              const cat = CATEGORIES.find(c => c.id === w.category);
              return (
                <button
                  key={w.category}
                  onClick={() => onNavigate('practice', { category: w.category })}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  {cat?.icon} Practice {cat?.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category breakdown */}
      <h2 className="text-lg font-semibold text-slate-700 mb-3">Accuracy by Category</h2>
      <div className="flex flex-col gap-3">
        {CATEGORIES.map(cat => {
          const s = stats[cat.id];
          const acc = s?.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : null;
          const barColor = COLOR_BAR[cat.color] || 'bg-blue-500';

          return (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => onNavigate('practice', { category: cat.id })}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium text-slate-700">{cat.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  {acc !== null ? (
                    <span className={`text-xl font-bold ${acc >= 70 ? 'text-green-600' : acc >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                      {acc}%
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm">Not started</span>
                  )}
                </div>
              </div>
              {acc !== null && (
                <>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${acc}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{s.attempts} attempts · {s.correct} correct</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button onClick={handleClear} className="text-red-400 hover:text-red-600 text-sm transition-colors">
          Reset all progress data
        </button>
      </div>
    </div>
  );
}
