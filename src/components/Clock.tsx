import { useState, useEffect } from 'react';
import { useStore } from '../store';

export default function Clock() {
  const show = useStore((s) => s.settings.showClock);
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  if (!show) return null;

  return (
    <div className="flex flex-col items-center gap-0.5 anim-fade-up">
      <time className="text-[44px] font-light tracking-tight text-[var(--text)] leading-none tabular-nums">
        {t.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
      </time>
      <span className="text-[13px] text-[var(--text3)]">
        {t.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
      </span>
    </div>
  );
}
