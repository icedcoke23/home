import { useState, useEffect } from 'react';

export default function TopBar() {
  const [now, setNow] = useState(new Date());
  const [isDark, setIsDark] = useState(() => localStorage.getItem('home_theme') !== 'light');

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
    localStorage.setItem('home_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const hour = now.getHours();
  const greet = hour < 6 ? '夜深了' : hour < 12 ? '早安' : hour < 18 ? '下午好' : '晚上好';

  return (
    <header className="relative z-10 w-full max-w-md mx-auto flex items-start justify-between px-5"
            style={{ paddingTop: 'calc(20px + var(--safe-top))' }}>
      {/* Left: Greeting + Date */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[15px] font-medium text-[var(--text-secondary)] tracking-tight">{greet}</p>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          {now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
        </p>
      </div>

      {/* Center: Large Time (visual anchor) */}
      <time className="absolute left-1/2 -translate-x-1/2 text-center">
        <span className="text-[42px] font-bold text-[var(--text-primary)] tracking-[-0.02em] tabular-nums leading-none">
          {now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </time>

      {/* Right: Weather + Theme */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span className="text-xl leading-none">☀️</span>
          <span className="text-[15px] font-medium">22°</span>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-10 h-10 rounded-xl flex items-center justify-center
                     bg-[var(--bg-elevated)] border border-[var(--border-default)]
                     hover:bg-[var(--bg-overlay)] hover:border-[var(--border-focus)]
                     active:scale-95 transition-all duration-200"
          aria-label={isDark ? '切换浅色模式' : '切换深色模式'}
        >
          <span className="text-[18px] leading-none">{isDark ? '🌙' : '☀️'}</span>
        </button>
      </div>
    </header>
  );
}