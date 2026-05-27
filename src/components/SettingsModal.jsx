import { useState } from 'react';
import { getGeminiKey, saveGeminiKey } from '../utils/gemini';

export default function SettingsModal({ onClose }) {
  const [key, setKey] = useState(getGeminiKey());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveGeminiKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">⚙️ Ayarlar</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Gemini API Key
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Yerel kelime bankası bittiğinde Gemini AI yeni IELTS kelimeleri üretir.
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-1"
            >
              Ücretsiz key al →
            </a>
          </p>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="AIza..."
            className="w-full border-2 border-slate-200 focus:border-blue-400 rounded-xl px-3 py-2 text-sm outline-none font-mono"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className={`flex-1 font-semibold rounded-xl py-2.5 text-sm transition-colors ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saved ? '✓ Kaydedildi!' : 'Kaydet'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl py-2.5 text-sm transition-colors"
          >
            Kapat
          </button>
        </div>

        {key && (
          <p className="text-xs text-green-600 mt-3 text-center">
            ✓ API key girilmiş — Gemini AI aktif
          </p>
        )}
        {!key && (
          <p className="text-xs text-amber-500 mt-3 text-center">
            API key girilmemiş — sadece yerel kelime bankası kullanılır
          </p>
        )}
      </div>
    </div>
  );
}
