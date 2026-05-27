import { useState, useMemo, useEffect } from 'react';
import { WORD_BANK } from '../data/wordbank';
import {
  generateWordsFromGemini,
  getGeminiKey,
  getStoredGeminiWords,
  storeGeminiWords,
} from '../utils/gemini';
import {
  getDailyWordsState,
  advanceDailyWordsDay,
  toggleSavedWord,
  isWordSaved,
  saveWordQuizAnswer,
} from '../utils/storage';

const WORDS_PER_DAY = 10;

function getDayWords(dayIndex, allWords) {
  const start = (dayIndex * WORDS_PER_DAY) % allWords.length;
  const slice = [];
  for (let i = 0; i < WORDS_PER_DAY; i++) {
    slice.push(allWords[(start + i) % allWords.length]);
  }
  return slice;
}

// ── Single word study card ────────────────────────────────────────────────────
function StudyCard({ word, index, total, onNext, isLast }) {
  const [phase, setPhase] = useState('study'); // 'study' | 'quiz'
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [saved, setSaved] = useState(() => isWordSaved(word.id));
  const [essayOpen, setEssayOpen] = useState(false);

  const handleQuizSelect = (opt) => {
    if (quizRevealed) return;
    setQuizSelected(opt);
    setQuizRevealed(true);
    saveWordQuizAnswer(word.id, opt === word.quiz?.correct);
  };

  const handleSave = () => {
    const updated = toggleSavedWord(word.id);
    setSaved(updated.includes(word.id));
  };

  const optClass = (opt) => {
    const base = 'w-full text-left text-sm border-2 rounded-xl px-3 py-2.5 font-medium transition-all ';
    if (!quizRevealed) return base + 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
    if (opt === word.quiz?.correct) return base + 'border-green-500 bg-green-50 text-green-800';
    if (opt === quizSelected) return base + 'border-red-400 bg-red-50 text-red-700';
    return base + 'border-slate-200 bg-white text-slate-400';
  };

  return (
    <>
      {essayOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEssayOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm">✍️ Essay Örnekleri — <span className="text-blue-600 italic">{word.collocation}</span></h3>
              <button onClick={() => setEssayOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-3">
              {word.essaySentences?.map((s, i) => (
                <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-blue-400 mr-2">Örnek {i + 1}</span>
                  <span className="text-slate-700 text-sm italic">"{s}"</span>
                </div>
              ))}
            </div>
            <button onClick={() => setEssayOpen(false)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors">Kapat</button>
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
        {/* Progress */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span>Kelime {index + 1} / {total}</span>
          <button onClick={handleSave} className={`text-xl transition-transform hover:scale-110 ${saved ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'}`}>★</button>
        </div>

        {phase === 'study' ? (
          <>
            {/* Main collocation */}
            <div className="text-center mb-5">
              <p className="text-2xl font-bold text-slate-800 italic mb-1">"{word.collocation}"</p>
              <p className="text-blue-600 font-semibold">{word.turkish}</p>
              <p className="text-slate-500 text-sm mt-1">{word.meaningTR}</p>
            </div>

            {/* Example sentence */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3">
              <p className="text-xs font-semibold text-blue-500 uppercase mb-1">IELTS Örnek</p>
              <p className="text-blue-800 text-sm italic">"{word.example}"</p>
            </div>

            {/* Wrong / Correct */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-red-500 mb-0.5">❌ Yanlış</p>
                <p className="text-red-700 text-xs italic">{word.wrong}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-green-600 mb-0.5">✅ Doğru</p>
                <p className="text-green-800 text-xs font-medium">{word.correct}</p>
              </div>
            </div>

            {/* Turkish explanation */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4 text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-amber-600">Neden yanlış? </span>
              {word.wrongExplanationTR}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEssayOpen(true)}
                className="flex-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold rounded-xl py-2 text-sm transition-colors"
              >
                ✍️ Essay Örnekleri
              </button>
              <button
                onClick={() => setPhase('quiz')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2 text-sm transition-colors"
              >
                Quiz Yap →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 text-center">
              <p className="text-xs text-purple-500 font-semibold uppercase tracking-wide mb-2">Mini Quiz</p>
              <p className="text-sm font-medium text-slate-700">{word.quiz?.question}</p>
            </div>

            <div className="flex flex-col gap-2 mb-3">
              {word.quiz?.options.map(opt => (
                <button key={opt} className={optClass(opt[0])} onClick={() => handleQuizSelect(opt[0])}>
                  {opt}
                </button>
              ))}
            </div>

            {quizRevealed && (
              <>
                <div className={`rounded-xl px-3 py-2 text-xs mb-3 ${quizSelected === word.quiz?.correct ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                  <span className="font-bold">{quizSelected === word.quiz?.correct ? '✅ Harika!' : '❌ Yanlış.'}</span>
                  {' '}{word.quiz?.explanationTR}
                </div>
                <button
                  onClick={onNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
                >
                  {isLast ? 'Günü Tamamla 🎉' : 'Sonraki Kelime →'}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ── Results screen ────────────────────────────────────────────────────────────
function DayCompleteScreen({ words, onHome, onNextDay }) {
  return (
    <div className="max-w-md mx-auto px-4 py-10 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Günlük Antrenman Bitti!</h2>
      <p className="text-slate-500 mb-6 text-sm">Bugün {words.length} Band 7 collocation öğrendiniz!</p>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 text-left">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Bugün Öğrendikleriniz</p>
        {words.map(w => (
          <div key={w.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
            <span className="text-sm font-medium text-slate-700 italic">{w.collocation}</span>
            <span className="text-xs text-blue-600">{w.turkish}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={onNextDay} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 transition-colors">
          Yarınki 10 Kelimeye Geç →
        </button>
        <button onClick={onHome} className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl py-3 transition-colors">
          Dashboard'a Dön
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DailyWordsPage({ onHome }) {
  const geminiKey = getGeminiKey();
  const geminiWords = getStoredGeminiWords();
  const allWords = [...WORD_BANK, ...geminiWords];

  const { dayIndex } = getDailyWordsState();
  const [currentDayIndex, setCurrentDayIndex] = useState(dayIndex);
  const [cardIndex, setCardIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dayWords = useMemo(() => getDayWords(currentDayIndex, allWords), [currentDayIndex, allWords.length]);

  const handleNext = () => {
    if (cardIndex + 1 >= dayWords.length) {
      setDone(true);
    } else {
      setCardIndex(i => i + 1);
    }
  };

  const handleNextDay = async () => {
    const nextIndex = currentDayIndex + 1;
    // Check if we're about to cycle back and all local words are used
    const coveredWords = (nextIndex * WORDS_PER_DAY);
    if (coveredWords >= allWords.length && geminiKey) {
      setLoading(true);
      setError('');
      try {
        const newWords = await generateWordsFromGemini(geminiKey, 10);
        storeGeminiWords(newWords);
      } catch (e) {
        setError(`Gemini hatası: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }
    advanceDailyWordsDay();
    setCurrentDayIndex(nextIndex);
    setCardIndex(0);
    setDone(false);
  };

  // Progress bar
  const pct = Math.round(((cardIndex) / dayWords.length) * 100);

  if (done) {
    return <DayCompleteScreen words={dayWords} onHome={onHome} onNextDay={handleNextDay} />;
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4 animate-bounce">🤖</div>
        <p className="text-slate-700 font-semibold">Gemini AI yeni kelimeler üretiyor...</p>
        <p className="text-slate-400 text-sm mt-1">Bu birkaç saniye sürebilir</p>
      </div>
    );
  }

  const current = dayWords[cardIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onHome} className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
          ← Geri
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">🌟 Günlük Band 7 Kelimeleri</h1>
          <p className="text-xs text-slate-500">Gün {currentDayIndex + 1} · {dayWords.length} collocation</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="my-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>İlerleme</span>
          <span>{cardIndex} / {dayWords.length} tamamlandı</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Quick list of today's words */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4">
        {dayWords.map((w, i) => (
          <div
            key={w.id}
            className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
              i < cardIndex
                ? 'bg-green-100 text-green-700'
                : i === cardIndex
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {current && (
        <StudyCard
          word={current}
          index={cardIndex}
          total={dayWords.length}
          onNext={handleNext}
          isLast={cardIndex + 1 >= dayWords.length}
        />
      )}

      {!geminiKey && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
          💡 Sağ üstteki ⚙️ simgesinden Gemini API key eklerseniz kelimeler asla bitmez!
        </div>
      )}
    </div>
  );
}
