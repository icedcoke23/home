import { memo, useCallback } from 'react';
import type { Message } from '../../types';
import { renderSimpleMarkdown } from '../../hooks';

function MessageBubbleComponent({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(msg.content).catch(() => {});
  }, [msg.content]);

  return (
    <div className={`flex gap-3 animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* AI avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--ds-accent)]/20 flex items-center justify-center text-sm shrink-0 mt-0.5">
          🤖
        </div>
      )}

      {/* Bubble */}
      <div className={`relative group max-w-[85%] ${isUser ? '' : 'min-w-0'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
          isUser
            ? 'bg-[var(--ds-accent)] text-white rounded-br-md'
            : 'bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] rounded-bl-md'
        }`}>
          {msg.streaming && !msg.content ? (
            <span className="flex gap-1.5 items-center h-5" aria-label="正在生成">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_infinite]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_0.2s_infinite]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_0.4s_infinite]" />
            </span>
          ) : (
            <span
              className={isUser ? '' : 'prose-sm prose-invert'}
              dangerouslySetInnerHTML={isUser ? undefined : { __html: renderSimpleMarkdown(msg.content) }}
            >
              {isUser ? msg.content : undefined}
            </span>
          )}
        </div>

        {/* Copy button (AI messages only) */}
        {!isUser && msg.content && !msg.streaming && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150
                       p-1 rounded bg-[var(--ds-bg-card)] text-[var(--ds-text-muted)] hover:text-[var(--ds-text-primary)]"
            aria-label="复制回复"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--ds-accent-warm)]/20 flex items-center justify-center text-sm shrink-0 mt-0.5">
          👤
        </div>
      )}
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleComponent, (prev, next) =>
  prev.msg.id === next.msg.id &&
  prev.msg.content === next.msg.content &&
  prev.msg.streaming === next.msg.streaming
);
