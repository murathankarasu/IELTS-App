import { useState } from 'react';
import { WORD_BANK } from '../data/wordbank';
import { getStoredGeminiWords } from '../utils/gemini';
import { getSavedWords, toggleSavedWord, saveWordQuizAnswer } from '../utils/storage';

function QuizCard({ word, onRemove }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (opt) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    saveWordQuizAnswer(word.id, opt === word.quiz.correct);
  };

  const optClass = (opt) => {
    const base = 'w-full text-left text-sm border-2 rounded-xl px-3 py-2 font-medium transition-all ';
    if (!revealed) return base + 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
    if (opt === word.quiz.correct) return base + 'border-green-500 bg-green-50 text-green-800';
    if (opt === selected) return base + 'border-red-400 bg-red-50 text-red-700';
    return base + 'border-slate-200 bg-white text-slate-400';
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-slate-800 italic">"{word.collocation}"</p>
          <p className="text-blue-600 text-sm">{word.turkish}</p>
        </div>
        <button
          onClick={() => onRemove(word.id)}
          className="text-slate-300 hover:text-red-400 text-lg transition-colors ml-2 flex-shrink-0"
          title="Kaydedilenlerden çıkar"
        >
          ★
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mb-3">
        <p className="text-xs text-blue-500 font-semibold mb-0.5">IELTS Örnek</p>
        <p className="text-blue-800 text-xs italic">"{word.example}"</p>
      </div>

      {word.quiz && (
        <>
          <p className="text-sm font-medium text-slate-700 mb-2">{word.quiz.question}</p>
          <div className="flex flex-col gap-1.5">
            {word.quiz.options.map(opt => (
              <button key={opt} className={optClass(opt[0])} onClick={() => handleSelect(opt[0])}>
                {opt}
              </button>
            ))}
          </div>
          {revealed && (
            <div className={`mt-2 rounded-xl px-3 py-2 text-xs ${selected === word.quiz.correct ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              <span className="font-bold">{selected === word.quiz.correct ? '✅ Doğru!' : '❌ Yanlış.'}</span>
              {' '}{word.quiz.explanationTR}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function MyWordsPage({ onHome, onGoToWordBank }) {
  const geminiWords = getStoredGeminiWords();
  const allWords = [...WORD_BANK, ...geminiWords];

  const [savedIds, setSavedIds] = useState(() => getSavedWords());

  const savedWords = allWords.filter(w => savedIds.includes(w.id));

  const handleRemove = (wordId) => {
    const updated = toggleSavedWord(wordId);
    setSavedIds(updated);
  };

  if (savedWords.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">⭐</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Kaydedilen Kelime Yok</h2>
        <p className="text-slate-500 mb-6 text-sm">
          Kelime Bankası'ndaki her kelimenin yanındaki ★ simgesine tıklayarak buraya ekleyebilirsiniz.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onGoToWordBank}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-3 transition-colors"
          >
            📚 Kelime Bankasına Git
          </button>
          <button onClick={onHome} className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
            ← Dashboard'a Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onHome} className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
          ← Geri
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">⭐ Kayıtlı Kelimelerim</h1>
          <p className="text-xs text-slate-500">{savedWords.length} kelime kaydedilmiş</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
        <p className="text-sm text-amber-800 font-medium">
          💡 Her kart için mini quiz çözün — bu kelimeler sınavda işinize yarayacak!
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {savedWords.map(word => (
          <QuizCard key={word.id} word={word} onRemove={handleRemove} />
        ))}
      </div>

      <div className="mt-6 text-center">
        <button onClick={onGoToWordBank} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          + Daha Fazla Kelime Ekle →
        </button>
      </div>
    </div>
  );
}
