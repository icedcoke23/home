import { useState, useEffect } from 'react';

export default function TopBar() {
  const [time, setTime] = useState(new Date());
  const [isLight, setIsLight] = useState(() => localStorage.getItem('home_theme') === 'light');

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight);
    localStorage.setItem('home_theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  return (
    <header className="relative z-10 flex items-center justify-between px-5 py-4" style={{ paddingTop: 'calc(16px + var(--safe-top))' }}>
      {/* 天气 */}
      <div className="flex items-center gap-2 opacity-80">
        <span className="text-xl">🌤️</span>
        <span className="text-sm text-[var(--text-secondary)]">22°</span>
      </div>

      {/* 时间 */}
      <time className="text-[15px] font-medium text-[var(--text-secondary)] tabular-nums tracking-tight">
        {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
      </time>

      {/* 主题 */}
      <button
        onClick={() => setIsLight(!isLight)}
        className="w-9 h-9 rounded-full flex items-center justify-center text-lg
                   hover:bg-[var(--bg-overlay)] active:scale-95 transition-all duration-200"
        aria-label={isLight ? '深色模式' : '浅色模式'}
      >
        {isLight ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
