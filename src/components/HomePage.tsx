import { useAppStore } from '../store/appStore';
import SearchBar from './SearchBar';
import NavGrid from './NavGrid';
import AIChat from './AIChat';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useRef } from 'react';

export default function HomePage() {
  const currentView = useAppStore((s) => s.currentView);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const setView = useAppStore((s) => s.setView);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut([
    { key: 'k', ctrl: true, handler: () => searchInputRef.current?.focus() },
    { key: 'Escape', handler: () => setView('home') },
  ]);

  if (currentView === 'chat') {
    return (
      <div className="flex flex-col h-full">
        <header className="flex items-center gap-2 px-4 py-3 border-b border-[var(--ds-border)] shrink-0">
          <button
            onClick={toggleSidebar}
            className="text-[var(--ds-text-muted)] hover:text-[var(--ds-text-primary)] p-1 transition-colors"
            aria-label="打开侧边栏"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setView('home')}
            className="flex-1 text-left text-sm font-medium text-[var(--ds-text-primary)] truncate"
          >
            AI 助手
          </button>
        </header>
        <AIChat />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-4 py-3 shrink-0">
        <button
          onClick={toggleSidebar}
          className="text-[var(--ds-text-muted)] hover:text-[var(--ds-text-primary)] p-1 transition-colors"
          aria-label="打开侧边栏"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView('chat')}
            className="text-xs text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)] px-3 py-1.5 rounded-lg bg-[var(--ds-bg-input)] transition-colors"
          >
            AI 对话
          </button>
          <button
            onClick={() => setView('settings')}
            className="text-xs text-[var(--ds-text-muted)] hover:text-[var(--ds-text-secondary)] p-1.5 transition-colors"
            aria-label="设置"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="flex flex-col items-center pt-6 pb-2 animate-fade-in">
          <div className="text-5xl mb-3">🏠</div>
          <h1 className="text-xl font-semibold text-[var(--ds-text-primary)] tracking-tight">
            Home
          </h1>
          <p className="text-xs text-[var(--ds-text-muted)] mt-1">
            智能搜索 · AI 对话 · 快捷导航
          </p>
        </div>

        <div className="mt-4">
          <SearchBar inputRef={searchInputRef} />
        </div>

        <NavGrid />
      </div>
    </div>
  );
}
