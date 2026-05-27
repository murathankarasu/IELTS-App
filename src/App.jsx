import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PracticePage from './pages/PracticePage';
import DailyPage from './pages/DailyPage';
import WeaknessesPage from './pages/WeaknessesPage';
import WordBankPage from './pages/WordBankPage';
import DailyWordsPage from './pages/DailyWordsPage';
import MyWordsPage from './pages/MyWordsPage';
import './index.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [pageProps, setPageProps] = useState({});

  const navigate = (target, props = {}) => {
    setPage(target);
    setPageProps(props);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar currentPage={page} onNavigate={navigate} />
      <main className="pb-16">
        {page === 'home'       && <Dashboard onNavigate={navigate} />}
        {page === 'daily'      && <DailyPage onHome={() => navigate('home')} />}
        {page === 'weaknesses' && <WeaknessesPage onNavigate={navigate} onHome={() => navigate('home')} />}
        {page === 'practice'   && <PracticePage category={pageProps.category} onHome={() => navigate('home')} />}
        {page === 'wordbank'   && <WordBankPage onHome={() => navigate('home')} />}
        {page === 'dailywords' && <DailyWordsPage onHome={() => navigate('home')} />}
        {page === 'mywords'    && <MyWordsPage onHome={() => navigate('home')} onGoToWordBank={() => navigate('wordbank')} />}
      </main>
    </div>
  );
}
