import { useState, useRef, useEffect } from 'react';
import { getMockReply } from '../data';

interface Props {
  query: string;
  onClose: () => void;
}

interface Msg { role: 'user' | 'ai'; text: string; }

export default function ChatPanel({ query, onClose }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [inp, setInp] = useState('');
  const [typing, setTyping] = useState(false);
  const [startY, setStartY] = useState(0);
  const [offset, setOffset] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // 初始查询
  useEffect(() => {
    if (query) send(query);
  }, []); // eslint-disable-line

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((p) => [...p, { role: 'user', text: t }]);
    setInp('');
    setTyping(true);

    // 模拟延迟
    setTimeout(() => {
      setMsgs((p) => [...p, { role: 'ai', text: getMockReply(t) }]);
      setTyping(false);
    }, 800 + Math.random() * 1200);
  };

  // 下拉关闭
  const onTouchStart = (e: React.TouchEvent) => setStartY(e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - startY;
    if (dy > 0) setOffset(dy);
  };
  const onTouchEnd = () => {
    if (offset > 80) onClose();
    setOffset(0);
  };

  return (
    <>
      {/* 遮罩 */}
      <div className="fixed inset-0 bg-black/30 z-40 anim-fade-in" onClick={onClose} />

      {/* 面板 */}
      <div
        ref={panelRef}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl glass anim-slide-up
                   flex flex-col max-h-[70vh]"
        style={{ transform: offset ? `translateY(${offset}px)` : undefined }}
      >
        {/* 拖动条 */}
        <div
          className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
        </div>

        {/* 标题 */}
        <div className="flex items-center justify-between px-5 pb-3">
          <h3 className="text-sm font-medium text-[var(--text)]">AI 助手</h3>
          <span className="text-[10px] text-[var(--text3)]">演示模式</span>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
          {msgs.length === 0 && (
            <p className="text-xs text-[var(--text3)] text-center py-6">有什么想了解的？直接问我</p>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2 anim-fade-up ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'ai' && (
                <span className="w-7 h-7 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-xs shrink-0 mt-0.5">🤖</span>
              )}
              <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[var(--accent)] text-white rounded-br-sm'
                  : 'bg-[var(--surface)] text-[var(--text)] rounded-bl-sm'
              }`}>
                {m.text}
              </div>
              {m.role === 'user' && (
                <span className="w-7 h-7 rounded-full bg-[var(--accent2)]/20 flex items-center justify-center text-xs shrink-0 mt-0.5">👤</span>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex gap-2 anim-fade-up">
              <span className="w-7 h-7 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-xs shrink-0 mt-0.5">🤖</span>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--surface)]">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text3)] animate-typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text3)] animate-typing-dot" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text3)] animate-typing-dot" style={{ animationDelay: '0.3s' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* 输入 */}
        <div className="px-4 py-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 bg-[var(--input)] rounded-xl px-3 py-2
                          border border-[var(--border)] focus-within:border-[var(--accent)]/30 transition-all">
            <input
              value={inp}
              onChange={(e) => setInp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(inp)}
              placeholder="输入消息..."
              className="flex-1 bg-transparent text-[var(--text)] placeholder-[var(--text3)] text-sm py-1 outline-none"
            />
            <button onClick={() => send(inp)}
              disabled={!inp.trim() || typing}
              className="text-sm text-[var(--accent)] disabled:opacity-30 font-medium shrink-0 transition-opacity">
              发送
            </button>
          </div>
        </div>

        {/* 安全区 */}
        <div style={{ height: 'var(--safe-b)' }} />
      </div>
    </>
  );
}
