import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { streamChat } from '../services/ai';
import type { Message } from '../types';

function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--ds-accent)] flex items-center justify-center text-sm shrink-0 mt-0.5">
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
          <span className="flex gap-1.5 items-center h-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_0.2s_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_0.4s_infinite]" />
          </span>
        ))}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--ds-accent-warm)] flex items-center justify-center text-sm shrink-0 mt-0.5">
          👤
        </div>
      )}
    </div>
  );
}

function WelcomeGuide() {
  const { setSearchQuery, setView } = useAppStore();
  const prompts = [
    { icon: '💻', text: '帮我写一段 React 组件的代码' },
    { icon: '📝', text: '分析这篇长文章的核心要点' },
    { icon: '🌐', text: '搜索今天的科技新闻' },
    { icon: '🎨', text: '推荐几个配色方案' },
    { icon: '📊', text: '解释一下什么是量子计算' },
    { icon: '🔧', text: '帮我调试这段 JavaScript 代码' },
  ];

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
            onClick={() => {
              setSearchQuery(p.text);
              setView('chat');
            }}
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

export default function AIChat() {
  const {
    conversations,
    activeConversationId,
    addMessage,
    updateMessage,
    createConversation,
    searchQuery,
    setSearchQuery,
    settings,
    isStreaming,
    setIsStreaming,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  useEffect(() => {
    // 如果有活跃对话且有消息，隐藏欢迎页
    if (activeConv && activeConv.messages.length > 0) {
      setShowWelcome(false);
    } else if (!activeConv || activeConv.messages.length === 0) {
      setShowWelcome(true);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  // 如果从搜索栏进入且有搜索内容，自动发送
  useEffect(() => {
    if (searchQuery && !isStreaming) {
      const q = searchQuery;
      setSearchQuery('');
      handleSend(q);
    }
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const content = (text || input.trim());
    if (!content || isStreaming) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation();
    }

    setInput('');
    setShowWelcome(false);

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

    const messages = [
      ...(activeConv?.messages || []),
      userMsg,
    ].map((m) => ({ role: m.role, content: m.content }));

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
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      updateMessage(convId!, assistantMsg.id, `❌ 请求失败: ${err.message}`);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, activeConversationId, settings, activeConv]);

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

      {/* 输入区域 — DeepSeek 风格 */}
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
                >
                  ⏹
                </button>
              ) : (
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--ds-accent)] text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all"
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
