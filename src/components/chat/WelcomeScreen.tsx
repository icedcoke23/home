import { useStore } from '../../store/appStore';
import { memo } from 'react';
import { CHAT_PROMPTS } from '../../constants';

function WelcomeScreenComponent() {
  const setPage = useStore((s) => s.setPage);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 animate-fade-in">
      <span className="text-5xl">🧠</span>
      <h2 className="text-lg font-medium text-[var(--ds-text-primary)]">有什么可以帮助你的？</h2>
      <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm stagger">
        {CHAT_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => { setSearchQuery(p.text); setPage('chat'); }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--ds-bg-input)]
                       hover:bg-[var(--ds-bg-card)] text-xs text-[var(--ds-text-secondary)] text-left
                       transition-all duration-150 active:scale-95
                       border border-transparent hover:border-[var(--ds-border)]"
          >
            <span>{p.icon}</span>
            <span className="line-clamp-1">{p.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export const WelcomeScreen = memo(WelcomeScreenComponent);
