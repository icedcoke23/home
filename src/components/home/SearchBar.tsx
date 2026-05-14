import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';
import { useStore } from '../../store/appStore';
import { SEARCH_ENGINES, search, getSuggestions, getSearchHistory, addSearchHistory, clearSearchHistory } from '../../services/search';
import type { SearchEngineKey } from '../../services/search';
import { DEBOUNCE_MS } from '../../constants';

interface Props {
  inputRef?: RefObject<HTMLInputElement | null>;
}

export default function SearchBar({ inputRef: externalRef }: Props) {
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const selectedEngine = useStore((s) => s.selectedEngine);
  const setSelectedEngine = useStore((s) => s.setSelectedEngine);
  const setPage = useStore((s) => s.setPage);

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<'engines' | 'suggestions' | 'history' | null>(null);
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = externalRef || internalRef;
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const engine = SEARCH_ENGINES[selectedEngine as SearchEngineKey] || SEARCH_ENGINES.google;

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    const results = await getSuggestions(q);
    setSuggestions(results);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(localQuery), DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [localQuery, fetchSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback((q?: string) => {
    const query = (q || localQuery).trim();
    if (!query) return;
    setShowDropdown(null);
    setSearchQuery(query);
    addSearchHistory(query);

    if (/^(https?:\/\/|www\.)[^\s]+/.test(query)) {
      const url = query.startsWith('http') ? query : `https://${query}`;
      window.open(url, '_blank');
      return;
    }
    search(query, selectedEngine as SearchEngineKey);
  }, [localQuery, selectedEngine, setSearchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setShowDropdown(null);
  };

  const handleFocus = () => {
    if (localQuery.trim()) {
      setShowDropdown('suggestions');
    } else {
      setShowDropdown('history');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4" ref={containerRef}>
      <div className="relative">
        {/* Main search pill */}
        <div className="flex items-center bg-[var(--ds-bg-input)] rounded-full border border-[var(--ds-border)]
                        focus-within:border-[var(--ds-accent)] focus-within:shadow-[0_0_0_3px_rgba(74,158,255,0.15)]
                        transition-all duration-200">
          {/* Engine selector */}
          <button
            onClick={() => setShowDropdown(showDropdown === 'engines' ? null : 'engines')}
            className="pl-4 pr-1 py-3 flex items-center gap-1 text-sm text-[var(--ds-text-secondary)]
                       hover:text-[var(--ds-text-primary)] transition-colors duration-150 shrink-0"
            aria-label="切换搜索引擎"
          >
            <span>{engine.icon}</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              setShowDropdown(e.target.value.trim() ? 'suggestions' : 'history');
            }}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={`${engine.name} 搜索...`}
            className="flex-1 bg-transparent text-[var(--ds-text-primary)] placeholder-[var(--ds-text-muted)]
                       text-sm py-3 px-2 outline-none min-w-0"
            aria-label="搜索输入"
          />

          {/* AI button */}
          <button
            onClick={() => {
              if (localQuery.trim()) setSearchQuery(localQuery.trim());
              setPage('chat');
            }}
            className="pr-2 py-3 text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)]
                       text-sm font-medium shrink-0 transition-colors duration-150"
            aria-label="AI 对话"
          >
            AI
          </button>

          {/* Search button */}
          <button
            onClick={() => handleSearch()}
            className="pr-4 pl-1 py-3 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]
                       transition-colors duration-150 shrink-0"
            aria-label="搜索"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Engine dropdown */}
        {showDropdown === 'engines' && (
          <div className="absolute top-full left-0 mt-1.5 w-48 bg-[var(--ds-bg-input)] border border-[var(--ds-border)]
                          rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in"
               role="listbox">
            {Object.entries(SEARCH_ENGINES).map(([key, eng]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedEngine(key);
                  setShowDropdown(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--ds-bg-card)]
                            transition-colors duration-150 ${
                  selectedEngine === key
                    ? 'text-[var(--ds-accent)] bg-[var(--ds-bg-card)]/50'
                    : 'text-[var(--ds-text-secondary)]'
                }`}
                role="option"
                aria-selected={selectedEngine === key}
              >
                <span>{eng.icon}</span>
                <span>{eng.name}</span>
                {selectedEngine === key && (
                  <svg className="w-4 h-4 ml-auto text-[var(--ds-accent)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Suggestions dropdown */}
        {showDropdown === 'suggestions' && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--ds-bg-input)] border border-[var(--ds-border)]
                          rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setLocalQuery(s);
                  handleSearch(s);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ds-text-secondary)]
                           hover:bg-[var(--ds-bg-card)] hover:text-[var(--ds-text-primary)]
                           transition-colors duration-150 text-left"
                aria-label={`搜索建议: ${s}`}
              >
                <svg className="w-4 h-4 shrink-0 text-[var(--ds-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="truncate">{s}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search history */}
        {showDropdown === 'history' && !localQuery.trim() && (
          <SearchHistoryDropdown
            onSelect={(q) => {
              setLocalQuery(q);
              handleSearch(q);
            }}
            onClear={clearSearchHistory}
          />
        )}
      </div>
    </div>
  );
}

/* ---- Search history sub-component ---- */
function SearchHistoryDropdown({
  onSelect,
  onClear,
}: {
  onSelect: (q: string) => void;
  onClear: () => void;
}) {
  const history = getSearchHistory();
  if (history.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--ds-bg-input)] border border-[var(--ds-border)]
                    rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--ds-border)]">
        <span className="text-xs text-[var(--ds-text-muted)]">最近搜索</span>
        <button
          onClick={onClear}
          className="text-xs text-[var(--ds-text-muted)] hover:text-[var(--ds-accent-warm)]
                     transition-colors duration-150"
          aria-label="清除搜索历史"
        >
          清除
        </button>
      </div>
      {history.map((h, i) => (
        <button
          key={i}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(h);
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ds-text-secondary)]
                     hover:bg-[var(--ds-bg-card)] hover:text-[var(--ds-text-primary)]
                     transition-colors duration-150 text-left"
          aria-label={`历史搜索: ${h}`}
        >
          <svg className="w-4 h-4 shrink-0 text-[var(--ds-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate">{h}</span>
        </button>
      ))}
    </div>
  );
}
