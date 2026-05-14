import { useRef, useCallback } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export default function ChatInput({ value, onChange, onSend, onStop, isStreaming, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && value.trim()) onSend();
    }
  }, [isStreaming, value, onSend]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 128) + 'px';
  }, [onChange]);

  return (
    <div className="px-3 pb-3" style={{ paddingBottom: `calc(12px + var(--safe-bottom))` }}>
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-[var(--ds-bg-input)] rounded-2xl border border-[var(--ds-border)]
                        shadow-lg focus-within:border-[var(--ds-accent)]
                        focus-within:shadow-[0_0_0_3px_rgba(74,158,255,0.15)] transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="输入消息，Enter 发送，Shift+Enter 换行"
            rows={1}
            disabled={disabled}
            className="w-full bg-transparent text-[var(--ds-text-primary)] placeholder-[var(--ds-text-muted)]
                       text-sm py-3.5 pl-4 pr-12 resize-none max-h-32 outline-none
                       disabled:opacity-40"
            style={{ minHeight: '48px' }}
            aria-label="输入消息"
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {isStreaming ? (
              <button onClick={onStop}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--ds-accent-warm)]
                           text-white text-xs hover:bg-red-500 active:scale-90 transition-all duration-150"
                aria-label="停止生成">
                ⏹
              </button>
            ) : (
              <button onClick={onSend}
                disabled={!value.trim() || disabled}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--ds-accent)]
                           text-white disabled:opacity-30 disabled:cursor-not-allowed
                           hover:bg-[var(--ds-accent-hover)] active:scale-90 transition-all duration-150"
                aria-label="发送消息">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <p className="text-[10px] text-[var(--ds-text-muted)] text-center mt-2">
          AI 回答仅供参考，请核实重要信息
        </p>
      </div>
    </div>
  );
}
