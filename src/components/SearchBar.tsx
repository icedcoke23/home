import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';
import { useAppStore } from '../store/appStore';
import { SEARCH_ENGINES, search, getSuggestions } from '../services/search';
import type { SearchEngineKey } from '../services/search';
import { DEBOUNCE_MS } from '../constants';

interface Props {
  inputRef?: RefObject<HTMLInputElement | null>;
}

export default function SearchBar({ inputRef: externalRef }: Props) {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const selectedEngine = useAppStore((s) => s.selectedEngine);
  const setSelectedEngine = useAppStore((s) => s.setSelectedEngine);
  const setView = useAppStore((s) => s.setView);

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showEngines, setShowEngines] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = externalRef || internalRef;
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  const handleSearch = useCallback((q?: string) => {
    const query = (q || localQuery).trim();
    if (!query) return;
    setShowSuggestions(false);
    setSearchQuery(query);

    if (/^(https?:\/\/|www\.)[^\s]+/.test(query)) {
      const url = query.startsWith('http') ? query : `https://${query}`;
      window.open(url, '_blank');
      return;
    }

    search(query, selectedEngine as SearchEngineKey);
  }, [localQuery, selectedEngine, setSearchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="relative">
        <div className="flex items-center bg-[var(--ds-bg-input)] rounded-full border border-[var(--ds-border)] focus-within:border-[var(--ds-accent)] focus-within:shadow-[0_0_0_3px_rgba(74,158,255,0.15)] transition-all">
          <button
            onClick={() => setShowEngines(!showEngines)}
            className="pl-4 pr-1 py-3 flex items-center gap-1 text-sm text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] transition-colors shrink-0"
            aria-label="切换搜索引擎"
          >
            <span>{engine.icon}</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => localQuery && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={`${engine.name} 搜索...`}
            className="flex-1 bg-transparent text-[var(--ds-text-primary)] placeholder-[var(--ds-text-muted)] text-sm py-3 px-2 outline-none"
            aria-label="搜索输入"
          />

          <button
            onClick={() => {
              if (localQuery.trim()) setSearchQuery(localQuery.trim());
              setView('chat');
            }}
            className="pr-2 py-3 text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)] text-sm font-medium shrink-0 transition-colors"
          >
            AI
          </button>

          <button
            onClick={() => handleSearch()}
            className="pr-4 pl-1 py-3 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] transition-colors shrink-0"
            aria-label="搜索"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {showEngines && (
          <div className="absolute top-full left-0 mt-1.5 w-48 bg-[var(--ds-bg-input)] border border-[var(--ds-border)] rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in" role="listbox">
            {Object.entries(SEARCH_ENGINES).map(([key, eng]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedEngine(key);
                  setShowEngines(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--ds-bg-card)] transition-colors ${
                  selectedEngine === key ? 'text-[var(--ds-accent)]' : 'text-[var(--ds-text-secondary)]'
                }`}
                role="option"
                aria-selected={selectedEngine === key}
              >
                <span>{eng.icon}</span>
                <span>{eng.name}</span>
                {selectedEngine === key && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--ds-bg-input)] border border-[var(--ds-border)] rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setLocalQuery(s);
                  handleSearch(s);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-card)] hover:text-[var(--ds-text-primary)] transition-colors text-left"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="truncate">{s}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
