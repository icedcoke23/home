import { useState, useEffect } from 'react';

export default function TopBar() {
  const [time, setTime] = useState(new Date());
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('home_theme') !== 'light';
  });

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('home_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-1">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌤️</span>
        <span className="text-sm text-[var(--text2)]">22°C 晴</span>
      </div>

      <time className="text-base font-medium text-[var(--text2)] tabular-nums">
        {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
      </time>

      <button
        onClick={() => setDark(!dark)}
        className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg
                   hover:scale-105 active:scale-95 transition-transform"
        aria-label={dark ? '切换浅色模式' : '切换深色模式'}
      >
        {dark ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
