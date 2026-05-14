import { useRef, useCallback } from 'react';

const LINKS = [
  { id: '1', title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { id: '2', title: 'DeepSeek', url: 'https://chat.deepseek.com', icon: '🤖' },
  { id: '3', title: '掘金', url: 'https://juejin.cn', icon: '📰' },
  { id: '4', title: 'B站', url: 'https://bilibili.com', icon: '📺' },
  { id: '5', title: '知乎', url: 'https://zhihu.com', icon: '💡' },
  { id: '6', title: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
  { id: '7', title: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
  { id: '8', title: 'Reddit', url: 'https://reddit.com', icon: '🔖' },
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
            className="flex flex-col items-center gap-2 p-3.5 rounded-2xl
                       bg-[var(--bg-elevated)] hover:bg-[var(--bg-overlay)]
                       border border-transparent hover:border-[var(--border-subtle)]
                       active:scale-95 transition-all duration-200
                       no-underline"
            aria-label={link.title}
          >
            <span className="text-[28px] leading-none">{link.icon}</span>
            <span className="text-[13px] text-[var(--text-secondary)] truncate w-full text-center leading-tight">
              {link.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
