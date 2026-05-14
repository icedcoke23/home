import { lazy, Suspense, useEffect, useCallback } from 'react';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import ChatPage from './components/ChatPage';
const SettingsPage = lazy(() => import('./components/SettingsPage'));

function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <span className="w-5 h-5 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const toggle = useStore((s) => s.toggleSidebar);

  const onKey = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault(); setView('home');
      setTimeout(() => document.querySelector<HTMLInputElement>('input')?.focus(), 100);
    }
    if (e.key === 'Escape') setView('home');
  }, [setView]);

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <Sidebar />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
        <button onClick={toggle}
          className="text-[var(--text3)] hover:text-[var(--text)] p-1 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('chat')}
            className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] px-2.5 py-1 rounded-lg bg-[var(--surface)] transition-colors">AI</button>
          <button onClick={() => setView('settings')}
            className="text-[var(--text3)] hover:text-[var(--text)] p-1 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'settings' ? (
        <Suspense fallback={<Loading />}><SettingsPage /></Suspense>
      ) : view === 'chat' ? (
        <ChatPage />
      ) : (
        <HomePage />
      )}
    </div>
  );
}
