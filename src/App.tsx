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

  // Ctrl+K → 聚焦搜索
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
    <div className="relative h-full w-full flex flex-col">
      {/* Atmospheric light spots */}
      <div className="aura">
        <div className="aura-blob aura-blob-1" />
        <div className="aura-blob aura-blob-2" />
        <div className="aura-blob aura-blob-3" />
      </div>

      {/* Top bar */}
      <TopBar />

      {/* Main content — vertically centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-4"
           style={{ paddingBottom: 'var(--safe-bottom)' }}>
        {/* Search */}
        <div className="anim-enter-up w-full max-w-md">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Tags */}
        <div className="anim-enter-up w-full" style={{ animationDelay: '0.08s' }}>
          <HotTags onTagClick={handleTag} />
        </div>

        {/* Nav grid */}
        <div className="anim-enter-up w-full mt-2" style={{ animationDelay: '0.16s' }}>
          <NavGrid onToast={setToast} />
        </div>
      </div>

      {/* Chat panel */}
      {showChat && (
        <ChatPanel
          query={chatQuery}
          onClose={() => { setShowChat(false); setChatQuery(''); }}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
    </div>
  );
}
