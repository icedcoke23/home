import { useState } from 'react';

type Mode = 'web' | 'ai';

const ENGINES = [
  { id: 'google', icon: 'G', name: 'Google' },
  { id: 'bing', icon: 'B', name: 'Bing' },
  { id: 'baidu', icon: '百', name: '百度' },
  { id: 'duck', icon: 'D', name: 'DuckDuckGo' },
];

interface Props { onSearch: (q: string, mode: Mode) => void; }

export default function SearchBar({ onSearch }: Props) {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<Mode>('web');
  const [ei, setEi] = useState(0);
  const [focused, setFocused] = useState(false);
  const engine = ENGINES[ei % ENGINES.length];

  const go = () => {
    const t = q.trim();
    if (!t) return;
    onSearch(t, mode);
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-5">
      {/* Label */}
      <p className="text-[13px] font-medium text-[var(--text-tertiary)] mb-2.5 tracking-wide uppercase">
        {mode === 'ai' ? 'AI 对话' : '网页搜索'}
      </p>

      {/* Search container */}
      <div
        className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl glass pressable
                    transition-all duration-300 ${focused ? 'shadow-[var(--shadow-glow)] border-[var(--border-focus)]' : ''}`}
      >
        {/* Engine button */}
        <button
          onClick={() => setEi(ei + 1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center
                     bg-[var(--brand-soft)] text-[var(--brand)] font-bold text-[15px]
                     hover:bg-[var(--brand-muted)] active:scale-95 transition-all shrink-0"
          aria-label={`搜索引擎: ${engine.name}，点击切换`}
        >
          {engine.icon}
        </button>

        {/* Input */}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          placeholder={mode === 'ai' ? '问我任何问题...' : `在 ${engine.name} 搜索...`}
          className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
                     text-[17px] leading-6 py-0.5 min-w-0 outline-none"
        />

        {/* Clear */}
        {q && (
          <button
            onClick={() => setQ('')}
            className="w-7 h-7 rounded-full flex items-center justify-center
                       text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]
                       hover:bg-[var(--bg-overlay)] active:scale-90 transition-all shrink-0"
          >
            ✕
          </button>
        )}

        {/* Mode toggle */}
        <button
          onClick={() => setMode(mode === 'web' ? 'ai' : 'web')}
          className={`shrink-0 h-8 px-3.5 rounded-xl text-[13px] font-semibold
                     transition-all duration-300 ${
            mode === 'ai'
              ? 'bg-[var(--brand)] text-white shadow-[var(--shadow-glow)]'
              : 'bg-[var(--bg-overlay)] text-[var(--text-secondary)] border border-[var(--border-default)]'
          }`}
        >
          {mode === 'ai' ? 'AI' : 'Web'}
        </button>

        {/* Search button */}
        {mode === 'web' && (
          <button
            onClick={go}
            disabled={!q.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center
                       bg-[var(--brand)] text-white shadow-md
                       hover:brightness-110 active:scale-95 transition-all shrink-0
                       disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="搜索"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}