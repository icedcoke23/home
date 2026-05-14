import { useState } from 'react';
import { useStore } from '../store';
import { ENGINES, search, type EngineKey } from '../services/search';

export default function SearchBar() {
  const q = useStore((s) => s.searchQuery);
  const setQ = useStore((s) => s.setSearchQuery);
  const engine = useStore((s) => s.searchEngine);
  const setEngine = useStore((s) => s.setSearchEngine);
  const [open, setOpen] = useState(false);
  const e = ENGINES[engine as EngineKey] || ENGINES.google;

  const go = () => {
    if (!q.trim()) return;
    search(q, engine as EngineKey);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl
                      bg-[var(--input)] backdrop-blur-xl
                      border border-[var(--border)]
                      focus-within:border-[var(--accent)]/40
                      focus-within:shadow-[0_0_0_3px_rgba(91,156,245,0.1)]
                      transition-all duration-200">
        <button onClick={() => setOpen(!open)}
          className="text-sm text-[var(--text2)] hover:text-[var(--text)] transition-colors shrink-0">
          {e.icon}
        </button>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          placeholder={`${e.name} 搜索...`}
          className="flex-1 bg-transparent text-[var(--text)] placeholder-[var(--text3)] text-[15px] py-0.5 outline-none"
          autoFocus
        />
        {q && (
          <button onClick={() => setQ('')}
            className="text-xs text-[var(--text3)] hover:text-[var(--text2)] shrink-0">✕</button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl
                        bg-[var(--surface)] backdrop-blur-xl border border-[var(--border)]
                        overflow-hidden z-50 anim-fade-in">
          {Object.entries(ENGINES).map(([k, v]) => (
            <button key={k} onClick={() => { setEngine(k); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                ${k === engine ? 'text-[var(--accent)]' : 'text-[var(--text2)] hover:bg-[var(--surface-hover)]'}`}>
              <span>{v.icon}</span> <span>{v.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
