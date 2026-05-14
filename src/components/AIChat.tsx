import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { streamChat } from '../services/ai';
import { ChatMessage } from './ChatMessage';
import { WelcomeGuide } from './WelcomeGuide';
import { useScrollToBottom } from '../hooks/useScrollToBottom';
import type { Message } from '../types';

export default function AIChat() {
  const conversations = useAppStore((s) => s.conversations);
  const activeConversationId = useAppStore((s) => s.activeConversationId);
  const addMessage = useAppStore((s) => s.addMessage);
  const updateMessage = useAppStore((s) => s.updateMessage);
  const createConversation = useAppStore((s) => s.createConversation);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const settings = useAppStore((s) => s.settings);
  const isStreaming = useAppStore((s) => s.isStreaming);
  const setIsStreaming = useAppStore((s) => s.setIsStreaming);

  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hasAutoSent = useRef(false);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const showWelcome = !activeConv || activeConv.messages.length === 0;
  const messagesEndRef = useScrollToBottom([activeConv?.messages]);

  // 从搜索栏跳转进来时自动发送
  useEffect(() => {
    if (searchQuery && !isStreaming && !hasAutoSent.current) {
      hasAutoSent.current = true;
      const q = searchQuery;
      setSearchQuery('');
      handleSend(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = useCallback(async (text?: string) => {
    const content = (text || input.trim());
    if (!content || isStreaming) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation();
    }

    setInput('');

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    addMessage(convId, userMsg);

    const assistantMsg: Message = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    };
    addMessage(convId, assistantMsg);

    setIsStreaming(true);
    abortRef.current = new AbortController();

    const currentMessages = conversations.find((c) => c.id === convId)?.messages || [];
    const messages = [...currentMessages, userMsg]
      .filter((m) => !m.streaming)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      await streamChat(
        messages,
        settings.aiApiKey || 'sk-placeholder',
        settings.aiBaseUrl,
        settings.aiModel,
        (full) => {
          updateMessage(convId!, assistantMsg.id, full);
        },
        abortRef.current.signal,
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : '未知错误';
      updateMessage(convId!, assistantMsg.id, `❌ 请求失败: ${msg}`);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, activeConversationId, settings, conversations, addMessage, updateMessage, createConversation, setIsStreaming]);

  const handleStop = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--ds-bg-primary)]">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {showWelcome ? (
          <WelcomeGuide />
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-4">
            {activeConv?.messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="px-3 pb-3" style={{ paddingBottom: `calc(12px + var(--safe-bottom))` }}>
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-[var(--ds-bg-input)] rounded-2xl border border-[var(--ds-border)] shadow-lg focus-within:border-[var(--ds-accent)] focus-within:shadow-[0_0_0_3px_rgba(74,158,255,0.15)] transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息，Enter 发送，Shift+Enter 换行"
              rows={1}
              className="w-full bg-transparent text-[var(--ds-text-primary)] placeholder-[var(--ds-text-muted)] text-sm py-3.5 pl-4 pr-12 resize-none max-h-32"
              style={{ minHeight: '48px' }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {isStreaming ? (
                <button
                  onClick={handleStop}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--ds-accent-warm)] text-white text-xs active:scale-90 transition-transform"
                  aria-label="停止生成"
                >
                  ⏹
                </button>
              ) : (
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--ds-accent)] text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all"
                  aria-label="发送消息"
                >
                  ↑
                </button>
              )}
            </div>
          </div>
          <p className="text-[10px] text-[var(--ds-text-muted)] text-center mt-2">
            AI 回答仅供参考，请核实重要信息
          </p>
        </div>
      </div>
    </div>
  );
}
