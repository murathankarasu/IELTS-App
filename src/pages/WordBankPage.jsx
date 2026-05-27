import { useState, useMemo } from 'react';
import { WORD_BANK, WORD_CATEGORIES } from '../data/wordbank';
import { getStoredGeminiWords } from '../utils/gemini';
import { toggleSavedWord, isWordSaved, saveWordQuizAnswer } from '../utils/storage';

// ── Essay sentences modal ─────────────────────────────────────────────────────
function EssayModal({ word, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">
            ✍️ <span className="text-blue-600 italic">"{word.collocation}"</span> — Deneme Cümleleri
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        <p className="text-xs text-slate-500 mb-4">Bu collocation'ı farklı IELTS essay bağlamlarında nasıl kullanabileceğinizi görün:</p>
        <div className="flex flex-col gap-3">
          {word.essaySentences.map((s, i) => (
            <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 mr-2">Örnek {i + 1}</span>
              <span className="text-slate-700 text-sm italic">"{s}"</span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}

// ── Mini quiz for a word ───────────────────────────────────────────────────────
function MiniQuiz({ word }) {
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

  if (!word.quiz) return null;

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">Mini Quiz</p>
      <p className="text-sm text-slate-700 mb-2 font-medium">{word.quiz.question}</p>
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
    </div>
  );
}

// ── Single word card ───────────────────────────────────────────────────────────
function WordCard({ word }) {
  const [expanded, setExpanded] = useState(false);
  const [essayOpen, setEssayOpen] = useState(false);
  const [saved, setSaved] = useState(() => isWordSaved(word.id));

  const handleSave = (e) => {
    e.stopPropagation();
    const newSaved = toggleSavedWord(word.id);
    setSaved(newSaved.includes(word.id));
  };

  return (
    <>
      {essayOpen && <EssayModal word={word} onClose={() => setEssayOpen(false)} />}
      <div className={`bg-white border-2 rounded-2xl transition-all ${expanded ? 'border-blue-300 shadow-md' : 'border-slate-200 hover:border-blue-200'}`}>
        {/* Header — always visible */}
        <div
          className="flex items-start justify-between p-4 cursor-pointer"
          onClick={() => setExpanded(e => !e)}
        >
          <div className="flex-1 min-w-0 pr-3">
            <p className="font-bold text-slate-800 text-base italic">"{word.collocation}"</p>
            <p className="text-blue-600 text-sm font-medium mt-0.5">{word.turkish}</p>
            <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{word.meaningTR}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleSave}
              className={`text-lg transition-transform hover:scale-110 ${saved ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'}`}
            >
              ★
            </button>
            <span className="text-slate-400 text-xs">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="px-4 pb-4 border-t border-slate-100 pt-3">
            {/* English meaning */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">İngilizce Anlam</p>
              <p className="text-slate-700 text-sm">{word.meaning}</p>
            </div>

            {/* IELTS example */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">IELTS Örnek Cümle</p>
              <p className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-blue-800 text-sm italic">
                "{word.example}"
              </p>
            </div>

            {/* Wrong vs Correct */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-red-500 mb-0.5">❌ Yanlış</p>
                <p className="text-red-700 text-sm italic">{word.wrong}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-green-600 mb-0.5">✅ Doğru</p>
                <p className="text-green-800 text-sm font-medium italic">{word.correct}</p>
              </div>
            </div>

            {/* Wrong explanation in Turkish */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Neden Yanlış? (Türkçe Açıklama)</p>
              <p className="text-slate-700 text-xs leading-relaxed">{word.wrongExplanationTR}</p>
            </div>

            {/* Use in essay button */}
            <button
              onClick={() => setEssayOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-2 text-sm transition-colors mb-2"
            >
              ✍️ Denemelerde Kullan — 3 Örnek Göster
            </button>

            {/* Mini quiz */}
            <MiniQuiz word={word} />
          </div>
        )}
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function WordBankPage({ onHome }) {
  const geminiWords = getStoredGeminiWords();
  const allWords = [...WORD_BANK, ...geminiWords];

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let words = activeCategory === 'all' ? allWords : allWords.filter(w => w.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      words = words.filter(w =>
        w.collocation.toLowerCase().includes(q) ||
        w.turkish.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
      );
    }
    return words;
  }, [activeCategory, search, allWords.length]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onHome} className="text-slate-400 hover:text-slate-600 transition-colors text-sm">
          ← Geri
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">📚 Band 7 Kelime & Collocation Bankası</h1>
          <p className="text-xs text-slate-500">{allWords.length} collocation · Türkçe açıklamalar · Quiz · Essay örnekleri</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Kelime veya Türkçe çeviri ara..."
          className="w-full border-2 border-slate-200 focus:border-blue-400 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {WORD_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Word count */}
      <p className="text-xs text-slate-400 mb-3">{filtered.length} kelime gösteriliyor</p>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-4xl mb-2">🔍</p>
            <p>Arama sonucu bulunamadı.</p>
          </div>
        ) : (
          filtered.map(word => <WordCard key={word.id} word={word} />)
        )}
      </div>
    </div>
  );
}
