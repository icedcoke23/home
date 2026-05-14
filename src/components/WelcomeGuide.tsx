import { useAppStore } from '../store/appStore';
import { memo } from 'react';

function WelcomeGuideComponent() {
  const setView = useAppStore((s) => s.setView);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  const prompts = [
    { icon: '💻', text: '帮我写一段 React 组件的代码' },
    { icon: '📝', text: '分析这篇长文章的核心要点' },
    { icon: '🌐', text: '搜索今天的科技新闻' },
    { icon: '🎨', text: '推荐几个配色方案' },
    { icon: '📊', text: '解释一下什么是量子计算' },
    { icon: '🔧', text: '帮我调试这段 JavaScript 代码' },
  ];

  const handleClick = (text: string) => {
    setSearchQuery(text);
    setView('chat');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 animate-fade-in">
      <div className="text-5xl mb-2">🧠</div>
      <h2 className="text-lg font-medium text-[var(--ds-text-primary)]">
        有什么可以帮助你的？
      </h2>
      <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleClick(p.text)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--ds-bg-input)] hover:bg-[var(--ds-bg-card)] text-xs text-[var(--ds-text-secondary)] text-left transition-all active:scale-95 border border-transparent hover:border-[var(--ds-border)]"
          >
            <span>{p.icon}</span>
            <span className="line-clamp-1">{p.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export const WelcomeGuide = memo(WelcomeGuideComponent);
