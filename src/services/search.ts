export const ENGINES = {
  google:  { id: 'google',  name: 'Google',     icon: '🔍', url: (q: string) => `https://google.com/search?q=${encodeURIComponent(q)}` },
  bing:    { id: 'bing',    name: 'Bing',       icon: '🔎', url: (q: string) => `https://bing.com/search?q=${encodeURIComponent(q)}` },
  baidu:   { id: 'baidu',   name: '百度',        icon: '🅱️', url: (q: string) => `https://baidu.com/s?wd=${encodeURIComponent(q)}` },
  duck:    { id: 'duck',    name: 'DuckDuckGo', icon: '🦆', url: (q: string) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}` },
};
export type EngineKey = keyof typeof ENGINES;

export function search(q: string, engine: EngineKey = 'google') {
  if (!q.trim()) return;
  if (/^(https?:\/\/|www\.)/.test(q)) {
    window.open(q.startsWith('http') ? q : `https://${q}`, '_blank');
    return;
  }
  window.open(ENGINES[engine].url(q), '_blank');
}

export async function getSuggestions(q: string): Promise<string[]> {
  if (!q.trim()) return [];
  try {
    const r = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q)}`);
    const d = await r.json();
    return (d[1] || []).slice(0, 5);
  } catch { return []; }
}
