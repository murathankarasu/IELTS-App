import { useState } from 'react';
import SettingsModal from './SettingsModal';

const TOP_LINKS = [
  { id: 'home',       label: 'Ana Sayfa',   icon: '🏠' },
  { id: 'daily',      label: 'Gramer',      icon: '📅' },
  { id: 'weaknesses', label: 'Zayıflıklar', icon: '🎯' },
];

const WORD_LINKS = [
  { id: 'wordbank',    label: 'Kelime Bankası', icon: '📚' },
  { id: 'dailywords',  label: 'Günlük Kelimeler', icon: '🌟' },
  { id: 'mywords',     label: 'Kelimelerim',  icon: '⭐' },
];

export default function Navbar({ currentPage, onNavigate }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const allLinks = [...TOP_LINKS, ...WORD_LINKS];

  return (
    <>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-3 h-14 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="font-bold text-blue-600 text-base whitespace-nowrap"
          >
            IELTS Trainer
          </button>

          {/* Nav links — icons only on small, icon+label on larger */}
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {allLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                title={link.label}
                className={`flex-shrink-0 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === link.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="md:hidden text-base">{link.icon}</span>
                <span className="hidden md:inline text-sm">{link.icon} {link.label}</span>
              </button>
            ))}

            <button
              onClick={() => setSettingsOpen(true)}
              title="Ayarlar (Gemini API Key)"
              className="flex-shrink-0 ml-1 px-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-base"
            >
              ⚙️
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
