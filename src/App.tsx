import { useState, useCallback, useEffect } from 'react';
import TopBar from './components/TopBar';
import SearchBar from './components/SearchBar';
import HotTags from './components/HotTags';
import NavGrid from './components/NavGrid';
import ChatPanel from './components/ChatPanel';
import Toast from './components/Toast';

export default function App() {
  const [chatQuery, setChatQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [toast, setToast] = useState('');

  // Ctrl/Cmd + K → focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input')?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = useCallback((q: string, mode: 'web' | 'ai') => {
    if (mode === 'web') {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank');
    } else {
      setChatQuery(q);
      setShowChat(true);
    }
  }, []);

  const handleTag = useCallback((text: string) => {
    setChatQuery(text);
    setShowChat(true);
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      {/* Atmospheric background */}
      <div className="aura">
        <div className="aura-blob aura-blob-1" />
        <div className="aura-blob aura-blob-2" />
        <div className="aura-blob aura-blob-3" />
      </div>

      {/* Top bar with greeting + time + theme */}
      <TopBar />

      {/* Main content — vertically centered */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 px-4"
            style={{ paddingBottom: 'max(24px, var(--safe-bottom))' }}>
        
        {/* Search — primary action */}
        <div className="anim-enter-up w-full" style={{ animationDelay: '0.1s' }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Hot tags */}
        <div className="anim-enter-up w-full" style={{ animationDelay: '0.2s' }}>
          <HotTags onTagClick={handleTag} />
        </div>

        {/* Navigation grid */}
        <div className="anim-enter-up w-full mt-2" style={{ animationDelay: '0.3s' }}>
          <NavGrid onToast={setToast} />
        </div>
      </main>

      {/* AI chat panel */}
      {showChat && (
        <ChatPanel
          query={chatQuery}
          onClose={() => { setShowChat(false); setChatQuery(''); }}
        />
      )}

      {/* Toast notifications */}
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
    </div>
  );
}