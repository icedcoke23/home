import { useState } from 'react';

type Mode = 'web' | 'ai';

const ENGINES = [
  { icon: '🔍', name: 'Google' },
  { icon: '🔎', name: 'Bing' },
  { icon: '🅱️', name: '百度' },
  { icon: '🦆', name: 'DuckDuckGo' },
];

interface Props {
  onSearch: (q: string, mode: Mode) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<Mode>('web');
  const [ei, setEi] = useState(0);
  const engine = ENGINES[ei % ENGINES.length];

  const go = () => {
    const t = q.trim();
    if (!t) return;
    onSearch(t, mode);
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-5">
      {/* 搜索框 */}
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl glass
                      transition-all duration-250
                      focus-within:border-[var(--brand)]/30
                      focus-within:shadow-[0_0_0_4px_var(--brand-glow)]">

        {/* 引擎切换 */}
        <button
          onClick={() => setEi(ei + 1)}
          className="text-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                     transition-colors shrink-0 p-0.5"
          aria-label={`当前引擎 ${engine.name}，点击切换`}
        >
          {engine.icon}
        </button>

        {/* 输入 */}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          placeholder={mode === 'ai' ? 'AI 问答...' : `${engine.name} 搜索...`}
          className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
                     text-[17px] leading-6 py-0 min-w-0"
          autoFocus
        />

        {/* 清除 */}
        {q && (
          <button
            onClick={() => setQ('')}
            className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]
                       shrink-0 transition-colors w-6 h-6 flex items-center justify-center"
          >
            ✕
          </button>
        )}

        {/* Web/AI 切换 */}
        <button
          onClick={() => setMode(mode === 'web' ? 'ai' : 'web')}
          className={`shrink-0 text-[13px] font-semibold px-3.5 py-1.5 rounded-full
                     transition-all duration-300 ${
            mode === 'ai'
              ? 'bg-[var(--brand)] text-white shadow-[0_0_16px_var(--brand-glow)]'
              : 'bg-[var(--bg-overlay)] text-[var(--text-secondary)]'
          }`}
        >
          {mode === 'ai' ? 'AI' : 'Web'}
        </button>
      </div>
    </div>
  );
}
