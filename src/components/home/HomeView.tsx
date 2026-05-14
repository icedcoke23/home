import { useEffect, useState } from 'react';
import { useStore } from '../../store/appStore';
import { useKeyboardShortcut } from '../../hooks';
import { fetchWeather } from '../../services/weather';
import ClockWidget from './ClockWidget';
import SearchBar from './SearchBar';
import QuickLinks from './QuickLinks';
import type { WeatherData } from '../../types';

export default function HomeView({ searchInputRef }: { searchInputRef: React.RefObject<HTMLInputElement | null> }) {
  const setPage = useStore((s) => s.setPage);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useKeyboardShortcut([
    { key: 'k', ctrl: true, handler: () => searchInputRef.current?.focus() },
    { key: 'Escape', handler: () => setPage('home') },
  ]);

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 shrink-0">
        <button
          onClick={() => useStore.getState().toggleSidebar()}
          className="text-[var(--ds-text-muted)] hover:text-[var(--ds-text-primary)] p-1 transition-colors duration-150"
          aria-label="打开菜单"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage('chat')}
            className="text-xs text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)] px-3 py-1.5
                       rounded-lg bg-[var(--ds-bg-input)] transition-colors duration-150"
          >
            AI 对话
          </button>
          <button
            onClick={() => setPage('settings')}
            className="text-xs text-[var(--ds-text-muted)] hover:text-[var(--ds-text-secondary)] p-1.5 transition-colors duration-150"
            aria-label="设置"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="flex flex-col gap-4 pt-4 animate-fade-in">
          {/* Clock */}
          <div className="px-4">
            <ClockWidget weather={weather ? { icon: weather.icon, temp: weather.temp } : null} />
          </div>

          {/* Search */}
          <div className="mt-2">
            <SearchBar inputRef={searchInputRef} />
          </div>

          {/* Quick links */}
          <QuickLinks />
        </div>
      </div>
    </div>
  );
}
