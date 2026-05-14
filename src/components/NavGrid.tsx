import { useRef, useCallback } from 'react';

const LINKS = [
  { id: 'github', title: 'GitHub', url: 'https://github.com', icon: '🐙', desc: '代码托管' },
  { id: 'deepseek', title: 'DeepSeek', url: 'https://chat.deepseek.com', icon: '🤖', desc: 'AI 对话' },
  { id: 'juejin', title: '掘金', url: 'https://juejin.cn', icon: '📰', desc: '技术社区' },
  { id: 'bilibili', title: 'B站', url: 'https://bilibili.com', icon: '📺', desc: '视频平台' },
  { id: 'zhihu', title: '知乎', url: 'https://zhihu.com', icon: '💭', desc: '问答社区' },
  { id: 'gmail', title: 'Gmail', url: 'https://mail.google.com', icon: '✉️', desc: '邮箱' },
  { id: 'youtube', title: 'YouTube', url: 'https://youtube.com', icon: '▶️', desc: '视频平台' },
  { id: 'notion', title: 'Notion', url: 'https://notion.so', icon: '📝', desc: '笔记工具' },
];

interface Props { onToast: (msg: string) => void; }

export default function NavGrid({ onToast }: Props) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const start = useCallback((link: typeof LINKS[0]) => () => {
    timer.current = setTimeout(() => {
      onToast(`${link.title} · ${link.url}`);
      navigator.vibrate?.(10);
    }, 600);
  }, [onToast]);

  const end = useCallback(() => { clearTimeout(timer.current); }, []);

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-5">
      {/* Label */}
      <p className="text-[11px] font-semibold text-[var(--text-muted)] mb-2 tracking-widest uppercase">
        快捷访问
      </p>

      <div className="grid grid-cols-4 gap-3 stagger">
        {LINKS.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onTouchStart={start(link)}
            onTouchEnd={end}
            onTouchMove={end}
            className="group flex flex-col items-center gap-2 p-3.5 rounded-2xl
                       bg-[var(--bg-elevated)] border border-[var(--border-default)]
                       hover:bg-[var(--bg-overlay)] hover:border-[var(--border-focus)]
                       hover:shadow-[var(--shadow-md)]
                       active:scale-[0.97] active:bg-[var(--bg-glass)]
                       transition-all duration-200 no-underline pressable focus-ring"
            aria-label={link.title}
          >
            <span className="text-[26px] leading-none group-hover:scale-110 transition-transform duration-200">
              {link.icon}
            </span>
            <span className="text-[13px] font-medium text-[var(--text-secondary)] truncate w-full text-center leading-tight
                            group-hover:text-[var(--text-primary)] transition-colors">
              {link.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}