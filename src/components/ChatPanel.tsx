import { useState, useRef, useEffect } from 'react';

const MOCK: Record<string, string> = {
  'react': 'React 是由 Meta 维护的前端库，用于构建用户界面。\n\n核心概念：\n• 组件化 — 可复用的 UI 单元\n• 声明式 — 描述 UI 状态，React 处理更新\n• 虚拟 DOM — 高效的 UI 渲染\n\nReact 19 新特性：Server Components、Actions、use() hook',
  'tailwind': 'Tailwind CSS 是实用优先的 CSS 框架。\n\n特点：\n• 原子类 — 组合而非抽象\n• 无需写 CSS 文件\n• 响应式设计开箱即用\n• v4 使用原生 CSS @import 和 @theme',
  'ai': 'AI 编程正在改变开发方式：\n\n• 代码生成 — Copilot、Cursor、Claude\n• 代码审查 — AI 发现潜在问题\n• 文档生成 — 自动化文档编写\n• 测试生成 — 智能生成测试用例\n\n关键是要学会与 AI 协作，而非被替代。',
  'typescript': 'TypeScript 是 JavaScript 的超集，添加静态类型。\n\n优势：\n• 编译时类型检查\n• 更好的 IDE 支持\n• 自文档化代码\n• 大型项目必备',
  'vite': 'Vite 是下一代前端构建工具。\n\n特点：\n• 极速冷启动 (ESM)\n• 即时热更新\n• 按需编译\n• 优化的生产构建',
};

function getReply(q: string): string {
  const key = Object.keys(MOCK).find((k) => q.toLowerCase().includes(k));
  if (key) return MOCK[key];
  return `关于「${q}」的问题，我还在学习中。\n\n试试问我：\n• React 前端开发\n• Tailwind CSS 样式\n• TypeScript 类型系统\n• AI 编程工具`;
}

interface Props { query: string; onClose: () => void; }

interface Msg { id: number; role: 'user' | 'ai'; text: string; }

export default function ChatPanel({ query, onClose }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [inp, setInp] = useState('');
  const [typing, setTyping] = useState(false);
  const [dy, setDy] = useState(0);
  const startY = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => { if (query) send(query); }, []); // eslint-disable-line
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    idRef.current += 1;
    const uid = idRef.current;
    setMsgs((p) => [...p, { id: uid, role: 'user', text: t }]);
    setInp('');
    setTyping(true);
    setTimeout(() => {
      setMsgs((p) => [...p, { id: uid + 1, role: 'ai', text: getReply(t) }]);
      setTyping(false);
    }, 500 + Math.random() * 800);
  };

  const ts = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; };
  const tm = (e: React.TouchEvent) => {
    const d = e.touches[0].clientY - startY.current;
    if (d > 0) setDy(d);
  };
  const te = () => { if (dy > 80) onClose(); setDy(0); };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 anim-enter-fade" onClick={onClose} />
      
      <div
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl glass
                   flex flex-col anim-enter-up overflow-hidden"
        style={{
          maxHeight: '78vh',
          transform: dy ? `translateY(${dy}px)` : undefined,
          transition: dy ? 'none' : undefined,
        }}
      >
        {/* Handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab touch-none"
          onTouchStart={ts} onTouchMove={tm} onTouchEnd={te}
        >
          <div className="w-10 h-1.5 rounded-full bg-[var(--text-muted)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">AI 助手</h2>
              <p className="text-[11px] text-[var(--text-tertiary)]">演示模式</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-tertiary)]
                       hover:bg-[var(--bg-overlay)] hover:text-[var(--text-secondary)] active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 pb-3 space-y-4">
          {msgs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="text-4xl">💬</span>
              <p className="text-[15px] text-[var(--text-tertiary)]">有什么想问的？</p>
            </div>
          )}

          {msgs.map((m) => (
            <div key={m.id} className={`flex gap-2.5 anim-enter-up ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center text-base shrink-0 mt-0.5">
                  🤖
                </div>
              )}
              <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-[16px] leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[var(--brand)] text-white rounded-br-md'
                  : 'bg-[var(--bg-overlay)] text-[var(--text-primary)] rounded-bl-md'
              }`}>
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[var(--bg-overlay)] flex items-center justify-center text-base shrink-0 mt-0.5">
                  👤
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex gap-2.5 anim-enter-up">
              <div className="w-8 h-8 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center text-base shrink-0 mt-0.5">
                🤖
              </div>
              <div className="px-5 py-4 rounded-2xl rounded-bl-md bg-[var(--bg-overlay)]">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-2.5 bg-[var(--bg-overlay)] rounded-2xl px-4 py-3
                          border border-[var(--border-default)] focus-within:border-[var(--border-focus)]
                          transition-all duration-200">
            <input
              value={inp}
              onChange={(e) => setInp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(inp)}
              placeholder="输入消息..."
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
                         text-[16px] leading-6 outline-none"
            />
            <button
              onClick={() => send(inp)}
              disabled={!inp.trim() || typing}
              className="h-9 px-4 rounded-xl bg-[var(--brand)] text-white text-[14px] font-semibold
                         shadow-md hover:brightness-110 active:scale-95 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
            >
              发送
            </button>
          </div>
        </div>

        <div style={{ height: 'var(--safe-bottom)' }} />
      </div>
    </>
  );
}