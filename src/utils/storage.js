const PROGRESS_KEY = 'ielts_progress';
const ANSWERS_KEY = 'ielts_answers';

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveAnswer(questionId, category, isCorrect) {
  const progress = getProgress();
  if (!progress[questionId]) {
    progress[questionId] = { attempts: 0, correct: 0, category };
  }
  progress[questionId].attempts += 1;
  if (isCorrect) progress[questionId].correct += 1;
  progress[questionId].lastAttempt = Date.now();
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getCategoryStats() {
  const progress = getProgress();
  const stats = {};
  Object.values(progress).forEach(({ category, attempts, correct }) => {
    if (!stats[category]) stats[category] = { attempts: 0, correct: 0 };
    stats[category].attempts += attempts;
    stats[category].correct += correct;
  });
  return stats;
}

export function getWeakCategories() {
  const stats = getCategoryStats();
  return Object.entries(stats)
    .map(([cat, { attempts, correct }]) => ({
      category: cat,
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : null,
      attempts,
    }))
    .filter(x => x.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function getTotalStats() {
  const progress = getProgress();
  const entries = Object.values(progress);
  const totalAttempts = entries.reduce((s, e) => s + e.attempts, 0);
  const totalCorrect = entries.reduce((s, e) => s + e.correct, 0);
  return { totalAttempts, totalCorrect, totalQuestions: entries.length };
}

export function clearProgress() {
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(ANSWERS_KEY);
}

// ─── SAVED WORDS ──────────────────────────────────────────────────────────────

const SAVED_WORDS_KEY = 'ielts_saved_words';

export function getSavedWords() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_WORDS_KEY)) || [];
  } catch {
    return [];
  }
}

export function toggleSavedWord(wordId) {
  const saved = getSavedWords();
  const idx = saved.indexOf(wordId);
  if (idx === -1) {
    saved.push(wordId);
  } else {
    saved.splice(idx, 1);
  }
  localStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(saved));
  return saved;
}

export function isWordSaved(wordId) {
  return getSavedWords().includes(wordId);
}

// ─── DAILY WORDS TRACKING ─────────────────────────────────────────────────────

const DAILY_WORDS_KEY = 'ielts_daily_words';

export function getDailyWordsState() {
  try {
    return JSON.parse(localStorage.getItem(DAILY_WORDS_KEY)) || { dayIndex: 0, lastDate: null };
  } catch {
    return { dayIndex: 0, lastDate: null };
  }
}

export function advanceDailyWordsDay() {
  const state = getDailyWordsState();
  const today = new Date().toDateString();
  state.dayIndex = (state.dayIndex || 0) + 1;
  state.lastDate = today;
  localStorage.setItem(DAILY_WORDS_KEY, JSON.stringify(state));
  return state;
}

export function saveDailyWordsState(state) {
  localStorage.setItem(DAILY_WORDS_KEY, JSON.stringify(state));
}

// ─── WORD QUIZ PROGRESS ───────────────────────────────────────────────────────

const WORD_QUIZ_KEY = 'ielts_word_quiz';

export function getWordQuizProgress() {
  try {
    return JSON.parse(localStorage.getItem(WORD_QUIZ_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveWordQuizAnswer(wordId, isCorrect) {
  const prog = getWordQuizProgress();
  if (!prog[wordId]) prog[wordId] = { attempts: 0, correct: 0 };
  prog[wordId].attempts += 1;
  if (isCorrect) prog[wordId].correct += 1;
  localStorage.setItem(WORD_QUIZ_KEY, JSON.stringify(prog));
}
