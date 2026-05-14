import { useState } from 'react';
import { SEARCH_ENGINES } from '../data';

type Mode = 'web' | 'ai';

interface Props {
  onSearch: (q: string, mode: Mode) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<Mode>('web');
  const [engineIdx, setEngineIdx] = useState(0);
  const engines = Object.entries(SEARCH_ENGINES);
  const [, eVal] = engines[engineIdx % engines.length];

  const go = () => {
    const t = q.trim();
    if (!t) return;
    onSearch(t, mode);
  };

  const cycleEngine = () => setEngineIdx((i) => (i + 1) % engines.length);
  const toggleMode = () => setMode((m) => (m === 'web' ? 'ai' : 'web'));

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-5">
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl glass
                      focus-within:border-[var(--accent)]/30 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]
                      transition-all duration-200">
        {/* 搜索引擎切换 */}
        <button onClick={cycleEngine}
          className="text-sm text-[var(--text2)] hover:text-[var(--text)] transition-colors shrink-0"
          aria-label="切换搜索引擎">
          {eVal.icon}
        </button>

        {/* 输入框 */}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          placeholder={mode === 'ai' ? 'AI 智能问答...' : `${eVal.name} 搜索...`}
          className="flex-1 bg-transparent text-[var(--text)] placeholder-[var(--text3)] text-[15px] py-0.5 min-w-0 outline-none"
          autoFocus
        />

        {/* 清除 */}
        {q && (
          <button onClick={() => setQ('')}
            className="text-xs text-[var(--text3)] hover:text-[var(--text2)] shrink-0 transition-colors">✕</button>
        )}

        {/* 模式切换 */}
        <button
          onClick={toggleMode}
          className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-300
            ${mode === 'ai'
              ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
              : 'bg-[var(--border)] text-[var(--text2)]'}`}
        >
          {mode === 'ai' ? 'AI' : 'Web'}
        </button>

        {/* 搜索按钮 */}
        <button onClick={go}
          className="text-[var(--text2)] hover:text-[var(--text)] shrink-0 transition-colors"
          aria-label="搜索">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
