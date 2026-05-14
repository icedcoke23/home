export const SEARCH_ENGINES = {
  google: {
    id: 'google', name: 'Google', icon: '🔍',
    searchUrl: (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    suggestUrl: (q: string) => `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q)}`,
  },
  bing: {
    id: 'bing', name: 'Bing', icon: '🔎',
    searchUrl: (q: string) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
  },
  baidu: {
    id: 'baidu', name: '百度', icon: '🅱️',
    searchUrl: (q: string) => `https://www.baidu.com/s?wd=${encodeURIComponent(q)}`,
  },
  duckduckgo: {
    id: 'duckduckgo', name: 'DuckDuckGo', icon: '🦆',
    searchUrl: (q: string) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  },
  github: {
    id: 'github', name: 'GitHub', icon: '🐙',
    searchUrl: (q: string) => `https://github.com/search?q=${encodeURIComponent(q)}`,
  },
} as const;

export type SearchEngineKey = keyof typeof SEARCH_ENGINES;

/** 执行搜索 */
export function search(query: string, engine: SearchEngineKey = 'google') {
  const q = query.trim();
  if (!q) return;
  if (/^(https?:\/\/|www\.)[^\s]+/.test(q)) {
    window.open(q.startsWith('http') ? q : `https://${q}`, '_blank');
    return;
  }
  const url = SEARCH_ENGINES[engine]?.searchUrl(q) || SEARCH_ENGINES.google.searchUrl(q);
  window.open(url, '_blank');
}

/** 获取搜索建议 */
export async function getSuggestions(query: string): Promise<string[]> {
  if (!query.trim()) return [];
  try {
    const url = SEARCH_ENGINES.google.suggestUrl!(query);
    const res = await fetch(url);
    const data = await res.json();
    return (data[1] || []).slice(0, 5);
  } catch {
    return [];
  }
}

/** 本地搜索历史 (last 20) */
const HISTORY_KEY = 'home_search_history';

export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addSearchHistory(query: string): void {
  const q = query.trim();
  if (!q) return;
  const history = getSearchHistory().filter((h) => h !== q);
  history.unshift(q);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

export function clearSearchHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
