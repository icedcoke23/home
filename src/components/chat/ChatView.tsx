import { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../store/appStore';
import { streamChat } from '../../services/ai';
import { useScrollToBottom } from '../../hooks';
import { MessageBubble } from './MessageBubble';
import { WelcomeScreen } from './WelcomeScreen';
import ChatInput from './ChatInput';
import type { Message } from '../../types';

export default function ChatView() {
  const conversations = useStore((s) => s.conversations);
  const activeConvId = useStore((s) => s.activeConvId);
  const addMessage = useStore((s) => s.addMessage);
  const updateMessage = useStore((s) => s.updateMessage);
  const createConversation = useStore((s) => s.createConversation);
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const settings = useStore((s) => s.settings);
  const isStreaming = useStore((s) => s.isStreaming);
  const setIsStreaming = useStore((s) => s.setIsStreaming);
  const setPage = useStore((s) => s.setPage);
  const toggleSidebar = useStore((s) => s.toggleSidebar);

  const [input, setInput] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const hasAutoSent = useRef(false);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const showWelcome = !activeConv || activeConv.messages.length === 0;
  const messagesEndRef = useScrollToBottom([activeConv?.messages]);

  // Auto-send from search
  useEffect(() => {
    if (searchQuery && !isStreaming && !hasAutoSent.current) {
      hasAutoSent.current = true;
      const q = searchQuery;
      setSearchQuery('');
      sendMessage(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text || input.trim());
    if (!content || isStreaming) return;

    let convId = activeConvId;
    if (!convId) convId = createConversation();
    setInput('');

    const userMsg: Message = { id: `msg_${Date.now()}`, role: 'user', content, timestamp: Date.now() };
    addMessage(convId, userMsg);

    const aiMsg: Message = { id: `msg_${Date.now() + 1}`, role: 'assistant', content: '', timestamp: Date.now(), streaming: true };
    addMessage(convId, aiMsg);

    setIsStreaming(true);
    abortRef.current = new AbortController();

    const currentMessages = conversations.find((c) => c.id === convId)?.messages || [];
    const history = [...currentMessages, userMsg]
      .filter((m) => !m.streaming)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      await streamChat(
        history,
        settings.aiApiKey || 'sk-placeholder',
        settings.aiBaseUrl,
        settings.aiModel,
        (full) => updateMessage(convId!, aiMsg.id, full),
        abortRef.current.signal,
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : '请求失败';
      updateMessage(convId!, aiMsg.id, `❌ ${msg}`);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, activeConvId, settings, conversations, addMessage, updateMessage, createConversation, setIsStreaming]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, [setIsStreaming]);

  return (
    <div className="flex flex-col h-full bg-[var(--ds-bg-primary)]">
      {/* Header */}
      <header className="flex items-center gap-2 px-4 py-3 border-b border-[var(--ds-border)] shrink-0">
        <button onClick={toggleSidebar}
          className="text-[var(--ds-text-muted)] hover:text-[var(--ds-text-primary)] p-1 transition-colors duration-150"
          aria-label="打开菜单">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button onClick={() => setPage('home')}
          className="flex-1 text-left text-sm font-medium text-[var(--ds-text-primary)] truncate">
          AI 助手
        </button>
        <button onClick={() => {
          const id = createConversation();
          useStore.setState({ activeConvId: id });
        }}
          className="text-xs text-[var(--ds-text-muted)] hover:text-[var(--ds-text-secondary)] transition-colors duration-150 p-1"
          aria-label="新建对话">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {showWelcome ? (
          <WelcomeScreen />
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-4">
            {activeConv?.messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => sendMessage()}
        onStop={handleStop}
        isStreaming={isStreaming}
      />
    </div>
  );
}
