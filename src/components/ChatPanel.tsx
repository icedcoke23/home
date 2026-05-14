import { useState, useRef, useEffect } from 'react';

const MOCK: Record<string, string> = {
  'react': 'React 是一个由 Meta 维护的 JavaScript 库，用于构建用户界面。\n\n核心理念：\n• 组件化 — UI 拆分为独立、可复用的组件\n• 声明式 — 描述 UI 应该是什么样子，React 负责更新 DOM\n• 单向数据流 — 数据从父组件流向子组件\n\nReact 19 新增了 Server Components、Actions、use() hook 等特性。',
  'tailwind': 'Tailwind CSS 是一个实用优先的 CSS 框架。\n\n与传统的语义化 CSS 不同，Tailwind 通过组合原子类来构建界面：\n\n<div class="px-4 py-2 bg-blue-500 text-white rounded-lg">\n  按钮\n</div>\n\nv4.0 使用 CSS 原生 @import 和 @theme，不再需要 tailwind.config.js。',
  'ai': 'AI 正在深刻改变软件开发：\n\n🤖 代码生成 — GitHub Copilot, Cursor, Claude\n🔍 代码审查 — AI 辅助发现 bug 和优化建议\n📝 文档生成 — 自动生成 API 文档和注释\n🧪 测试生成 — 根据代码自动生成单元测试\n\n关键是要学会"与 AI 协作"，而不是被替代。',
  'typescript': 'TypeScript 是 JavaScript 的超集，添加了静态类型系统。\n\n优势：\n• 编译时错误检查 — 在运行前发现问题\n• 更好的 IDE 支持 — 自动补全、重构、跳转\n• 自文档化 — 类型即文档\n• 大型项目必备 — 提升代码可维护性',
};

function reply(q: string): string {
  const k = Object.keys(MOCK).find((k) => q.toLowerCase().includes(k));
  if (k) return MOCK[k];
  return `关于「${q}」这个问题，我还在学习中。\n\n目前我比较熟悉的领域：\n• React 前端开发\n• Tailwind CSS 样式\n• TypeScript 类型系统\n• AI 编程工具\n\n你可以试试问我这些话题 👆`;
}

interface Props { query: string; onClose: () => void; }

interface Msg { role: 'user' | 'ai'; text: string; }

export default function ChatPanel({ query, onClose }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [inp, setInp] = useState('');
  const [typing, setTyping] = useState(false);
  const [dy, setDy] = useState(0);
  const startY = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (query) send(query); }, []); // eslint-disable-line
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((p) => [...p, { role: 'user', text: t }]);
    setInp('');
    setTyping(true);
    setTimeout(() => {
      setMsgs((p) => [...p, { role: 'ai', text: reply(t) }]);
      setTyping(false);
    }, 600 + Math.random() * 900);
  };

  const touchStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; };
  const touchMove = (e: React.TouchEvent) => {
    const d = e.touches[0].clientY - startY.current;
    if (d > 0) setDy(d);
  };
  const touchEnd = () => {
    if (dy > 100) onClose();
    setDy(0);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 anim-enter-fade" onClick={onClose} />

      <div
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-[20px] glass
                   flex flex-col anim-enter-up"
        style={{ maxHeight: '75vh', transform: dy ? `translateY(${dy}px)` : undefined }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab touch-none"
             onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd}>
          <div className="w-10 h-1 rounded-full bg-[var(--border-subtle)]" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">AI 助手</h2>
          <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-overlay)] px-2.5 py-1 rounded-full">演示</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 pb-3 space-y-4">
          {msgs.length === 0 && (
            <p className="text-sm text-[var(--text-tertiary)] text-center py-10">有什么想问的？随便聊聊</p>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2.5 anim-enter-up ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[15px] shrink-0 mt-0.5">🤖</div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[16px] leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[var(--brand)] text-white rounded-br-md'
                  : 'bg-[var(--bg-overlay)] text-[var(--text-primary)] rounded-bl-md'
              }`}>
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[var(--bg-overlay)] flex items-center justify-center text-[15px] shrink-0 mt-0.5">👤</div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[15px] shrink-0 mt-0.5">🤖</div>
              <div className="px-5 py-4 rounded-2xl rounded-bl-md bg-[var(--bg-overlay)]">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 bg-[var(--bg-overlay)] rounded-2xl px-4 py-2.5
                          border border-[var(--border-subtle)] focus-within:border-[var(--brand)]/30 transition-all">
            <input
              value={inp}
              onChange={(e) => setInp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(inp)}
              placeholder="输入消息..."
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
                         text-[16px] py-1 outline-none"
            />
            <button
              onClick={() => send(inp)}
              disabled={!inp.trim() || typing}
              className="text-[15px] font-semibold text-[var(--brand)] disabled:opacity-30 shrink-0
                         hover:opacity-80 transition-opacity px-1"
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
