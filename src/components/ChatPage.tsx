import { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store';
import { streamChat } from '../services/ai';
import type { Message } from '../types';

function Bubble({ m }: { m: Message }) {
  const isU = m.role === 'user';
  return (
    <div className={`flex gap-2.5 anim-fade-up ${isU ? 'justify-end' : 'justify-start'}`}>
      {!isU && <span className="w-7 h-7 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-xs shrink-0 mt-0.5">🤖</span>}
      <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
        isU ? 'bg-[var(--accent)] text-white rounded-br-sm' : 'bg-[var(--surface)] backdrop-blur text-[var(--text)] rounded-bl-sm'}`}>
        {m.streaming && !m.content ? (
          <span className="flex gap-1 items-center h-4">
            <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDelay: '0.15s' }} />
            <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDelay: '0.3s' }} />
          </span>
        ) : m.content}
      </div>
      {isU && <span className="w-7 h-7 rounded-full bg-[var(--warm)]/20 flex items-center justify-center text-xs shrink-0 mt-0.5">👤</span>}
    </div>
  );
}

const WELCOME = [
  ['💻', '帮我写一段 React 代码'],
  ['📝', '分析这篇文章的核心要点'],
  ['🌐', '搜索最新的科技新闻'],
  ['🎨', '推荐好看的配色方案'],
  ['📊', '解释一下什么是量子计算'],
  ['🔧', '帮我调试这段代码'],
];

export default function ChatPage() {
  const convs = useStore((s) => s.conversations);
  const cid = useStore((s) => s.activeConvId);
  const add = useStore((s) => s.addMessage);
  const upd = useStore((s) => s.updateMessage);
  const mkConv = useStore((s) => s.newConversation);
  const sq = useStore((s) => s.searchQuery);
  const setSQ = useStore((s) => s.setSearchQuery);
  const cfg = useStore((s) => s.settings);
  const streaming = useStore((s) => s.isStreaming);
  const setStreaming = useStore((s) => s.setIsStreaming);

  const [inp, setInp] = useState('');
  const abort = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const sent = useRef(false);

  const conv = convs.find((c) => c.id === cid);
  const msgs = conv?.messages || [];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  useEffect(() => {
    if (sq && !streaming && !sent.current) {
      sent.current = true;
      const q = sq; setSQ('');
      send(q);
    }
  }, []); // eslint-disable-line

  const send = useCallback(async (text?: string) => {
    const c = (text || inp.trim());
    if (!c || streaming) return;
    let id = cid;
    if (!id) id = mkConv();
    setInp('');

    const um: Message = { id: `u_${Date.now()}`, role: 'user', content: c, timestamp: Date.now() };
    add(id, um);
    const am: Message = { id: `a_${Date.now()}`, role: 'assistant', content: '', timestamp: Date.now(), streaming: true };
    add(id, am);

    setStreaming(true);
    abort.current = new AbortController();

    const h = [...(convs.find((x) => x.id === id)?.messages || []), um]
      .filter((x) => !x.streaming)
      .map((x) => ({ role: x.role, content: x.content }));

    try {
      await streamChat(h, cfg.aiApiKey || 'sk-', cfg.aiBaseUrl, cfg.aiModel, (f) => upd(id!, am.id, f), abort.current.signal);
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      upd(id!, am.id, `❌ ${e?.message || '请求失败'}`);
    } finally {
      setStreaming(false);
    }
  }, [inp, streaming, cid, cfg, convs, add, upd, mkConv, setStreaming]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {msgs.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-10 anim-fade-in">
            <span className="text-4xl">🧠</span>
            <p className="text-sm text-[var(--text2)]">有什么可以帮助你的？</p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs stagger">
              {WELCOME.map(([ico, txt], i) => (
                <button key={i} onClick={() => send(txt)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--surface)]
                             hover:bg-[var(--surface-hover)] text-xs text-[var(--text2)] text-left
                             transition-all active:scale-95 border border-transparent hover:border-[var(--border)]">
                  <span>{ico}</span><span className="line-clamp-1">{txt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-lg mx-auto pb-4">
            {msgs.map((m) => <Bubble key={m.id} m={m} />)}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="p-3" style={{ paddingBottom: `calc(12px + var(--safe-b))` }}>
        <div className="max-w-lg mx-auto flex items-end gap-2 bg-[var(--input)] backdrop-blur-xl
                        rounded-2xl border border-[var(--border)] px-3 py-2
                        focus-within:border-[var(--accent)]/30 transition-all">
          <textarea value={inp} onChange={(e) => setInp(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="输入消息..."
            rows={1}
            className="flex-1 bg-transparent text-[var(--text)] placeholder-[var(--text3)]
                       text-sm py-1.5 resize-none max-h-24 outline-none"
            style={{ minHeight: '24px' }} />
          {streaming ? (
            <button onClick={() => { abort.current?.abort(); setStreaming(false); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--warm)] text-white text-xs active:scale-90 transition-transform">⏹</button>
          ) : (
            <button onClick={() => send()}
              disabled={!inp.trim()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--accent)] text-white
                         disabled:opacity-30 active:scale-90 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
