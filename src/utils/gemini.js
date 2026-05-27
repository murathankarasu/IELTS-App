const GEMINI_KEY_STORAGE = 'ielts_gemini_key';
const GEMINI_WORDS_STORAGE = 'ielts_gemini_words';

export function getGeminiKey() {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
}

export function saveGeminiKey(key) {
  localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
}

export function getStoredGeminiWords() {
  try {
    return JSON.parse(localStorage.getItem(GEMINI_WORDS_STORAGE)) || [];
  } catch {
    return [];
  }
}

export function storeGeminiWords(words) {
  const existing = getStoredGeminiWords();
  const merged = [...existing, ...words];
  localStorage.setItem(GEMINI_WORDS_STORAGE, JSON.stringify(merged));
  return merged;
}

export async function generateWordsFromGemini(apiKey, count = 10) {
  const prompt = `Generate ${count} IELTS Band 7 writing collocations for Turkish university students.

Return a JSON array. Each item must have EXACTLY these fields:
{
  "id": "gemini_<random 6 char>",
  "category": one of: "feelings" | "growth" | "health" | "society" | "impact" | "verbs",
  "collocation": "the collocation or phrase",
  "meaning": "definition in simple English",
  "meaningTR": "Türkçe açıklama",
  "turkish": "Türkçe çeviri",
  "example": "one IELTS essay sentence using the collocation",
  "wrong": "common wrong usage",
  "correct": "correct usage",
  "wrongExplanationTR": "Neden yanlış olduğunun Türkçe açıklaması",
  "essaySentences": ["sentence 1", "sentence 2", "sentence 3"],
  "quiz": {
    "question": "fill-in-blank quiz question using the collocation",
    "options": ["A. word1", "B. word2", "C. word3", "D. word4"],
    "correct": "A" or "B" or "C" or "D",
    "explanationTR": "Türkçe quiz açıklaması"
  }
}

Focus on collocations for IELTS Task 2 topics: education, technology, environment, society, health, globalisation.
Make them useful, natural, and academically appropriate. Do NOT repeat collocations already commonly known.
Return ONLY the raw JSON array — no markdown, no code blocks, no extra text.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 4096 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Strip any markdown code fences if present
  const cleaned = text.replace(/```json|```/g, '').trim();
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Gemini yanıtı geçerli JSON içermiyor.');

  const words = JSON.parse(jsonMatch[0]);

  // Assign stable IDs
  return words.map((w, i) => ({
    ...w,
    id: `gemini_${Date.now()}_${i}`,
  }));
}
