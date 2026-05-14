import { useState, useCallback } from 'react';
import TopBar from './components/TopBar';
import SearchBar from './components/SearchBar';
import HotTags from './components/HotTags';
import NavGrid from './components/NavGrid';
import ChatPanel from './components/ChatPanel';
import Toast from './components/Toast';

export default function App() {
  const [chatQuery, setChatQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleSearch = useCallback((q: string, mode: 'web' | 'ai') => {
    if (mode === 'web') {
      window.open(`https://google.com/search?q=${encodeURIComponent(q)}`, '_blank');
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
      {/* 动态光斑背景 */}
      <div className="spots">
        <div className="spot spot-1" />
        <div className="spot spot-2" />
        <div className="spot spot-3" />
      </div>

      {/* 顶部栏 */}
      <TopBar />

      {/* 主内容 */}
      <div className="relative z-10 flex-1 flex flex-col items-center gap-5 pt-6">
        {/* 搜索框 */}
        <div className="anim-fade-up w-full flex justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* 快捷标签 */}
        <div className="anim-fade-up w-full" style={{ animationDelay: '0.1s' }}>
          <HotTags onTagClick={handleTag} />
        </div>

        {/* 导航网格 */}
        <div className="anim-fade-up w-full" style={{ animationDelay: '0.2s' }}>
          <NavGrid onToast={setToastMsg} />
        </div>
      </div>

      {/* AI 对话面板 */}
      {showChat && (
        <ChatPanel
          query={chatQuery}
          onClose={() => { setShowChat(false); setChatQuery(''); }}
        />
      )}

      {/* Toast */}
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg('')} />}
    </div>
  );
}
