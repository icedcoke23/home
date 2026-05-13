/**
 * 搜索引擎 URL 构建
 */
export const SEARCH_ENGINES = {
  google: {
    name: 'Google',
    icon: '🔍',
    searchUrl: (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    suggestUrl: (q: string) => `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q)}`,
  },
  bing: {
    name: 'Bing',
    icon: '🔎',
    searchUrl: (q: string) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    suggestUrl: null,
  },
  baidu: {
    name: '百度',
    icon: '🅱️',
    searchUrl: (q: string) => `https://www.baidu.com/s?wd=${encodeURIComponent(q)}`,
    suggestUrl: null,
  },
  duckduckgo: {
    name: 'DuckDuckGo',
    icon: '🦆',
    searchUrl: (q: string) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
    suggestUrl: null,
  },
} as const;

export type SearchEngineKey = keyof typeof SEARCH_ENGINES;

export function search(query: string, engine: SearchEngineKey = 'google') {
  if (!query.trim()) return;
  const url = SEARCH_ENGINES[engine]?.searchUrl(query.trim()) || SEARCH_ENGINES.google.searchUrl(query.trim());
  window.open(url, '_blank');
}

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
