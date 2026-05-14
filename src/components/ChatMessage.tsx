import { memo } from 'react';
import type { Message } from '../types';

function ChatMessageComponent({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--ds-accent)] flex items-center justify-center text-sm shrink-0 mt-0.5" aria-hidden>
          🤖
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
          isUser
            ? 'bg-[var(--ds-accent)] text-white rounded-br-md'
            : 'bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] rounded-bl-md'
        }`}
      >
        {msg.content || (msg.streaming && (
          <span className="flex gap-1.5 items-center h-5" aria-label="正在生成回复">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)] animate-pulse-dot" style={{ animationDelay: '0s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)] animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)] animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
          </span>
        ))}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--ds-accent-warm)] flex items-center justify-center text-sm shrink-0 mt-0.5" aria-hidden>
          👤
        </div>
      )}
    </div>
  );
}

export const ChatMessage = memo(ChatMessageComponent, (prev, next) =>
  prev.msg.id === next.msg.id &&
  prev.msg.content === next.msg.content &&
  prev.msg.streaming === next.msg.streaming
);
