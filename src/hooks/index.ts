import { useEffect, useRef, useCallback } from 'react';

/** 滚动到容器底部 */
export function useScrollToBottom(deps: unknown[]) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: 'smooth' }); }, deps);
  return ref;
}

/** 键盘快捷键注册 */
interface Shortcut {
  key: string;
  ctrl?: boolean;
  handler: () => void;
}

export function useKeyboardShortcut(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (const s of shortcuts) {
        if (e.key.toLowerCase() === s.key.toLowerCase()) {
          if (s.ctrl && !(e.ctrlKey || e.metaKey)) continue;
          e.preventDefault();
          s.handler();
          return;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}

/** 当前时间 (每秒更新) */
export function useClock() {
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const dateRef = useRef<HTMLSpanElement | null>(null);

  const update = useCallback(() => {
    const now = new Date();
    if (timeRef.current) {
      timeRef.current.textContent = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    if (dateRef.current) {
      dateRef.current.textContent = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });
    }
  }, []);

  useEffect(() => {
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [update]);

  return { timeRef, dateRef };
}

/** 简化 Markdown 渲染 (粗体/代码/链接) */
export function renderSimpleMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-[var(--ds-bg-card)] px-1.5 py-0.5 rounded text-[var(--ds-accent)] text-xs">$1</code>')
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, _lang, code) =>
      `<pre class="bg-[var(--ds-bg-card)] rounded-xl p-3 my-2 overflow-x-auto text-xs"><code>${code.trim()}</code></pre>`
    )
    .replace(/\n/g, '<br/>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-[var(--ds-accent)] underline">$1</a>');
}
