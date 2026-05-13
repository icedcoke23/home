import { useAppStore } from '../store/appStore';

export default function Sidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    conversations,
    activeConversationId,
    setActiveConversation,
    deleteConversation,
    createConversation,
    setView,
  } = useAppStore();

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-[var(--ds-bg-secondary)] z-50 animate-slide-in shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--ds-border)]">
          <h2 className="text-sm font-semibold text-[var(--ds-text-primary)]">对话历史</h2>
          <button
            onClick={toggleSidebar}
            className="text-[var(--ds-text-muted)] hover:text-[var(--ds-text-primary)] transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat */}
        <button
          onClick={() => {
            createConversation();
            setView('chat');
            toggleSidebar();
          }}
          className="mx-3 mt-3 py-2.5 rounded-xl border border-dashed border-[var(--ds-border)] text-sm text-[var(--ds-accent)] hover:bg-[var(--ds-bg-card)] transition-all active:scale-95"
        >
          + 新对话
        </button>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {conversations.length === 0 ? (
            <p className="text-xs text-[var(--ds-text-muted)] text-center py-8">暂无对话记录</p>
          ) : (
            <div className="flex flex-col gap-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all ${
                    activeConversationId === conv.id
                      ? 'bg-[var(--ds-bg-card)] text-[var(--ds-text-primary)]'
                      : 'text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-input)] hover:text-[var(--ds-text-primary)]'
                  }`}
                  onClick={() => {
                    setActiveConversation(conv.id);
                    setView('chat');
                    toggleSidebar();
                  }}
                >
                  <span className="shrink-0 text-xs">💬</span>
                  <span className="flex-1 truncate text-xs">
                    {conv.messages[0]?.content.slice(0, 30) || conv.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[var(--ds-text-muted)] hover:text-[var(--ds-accent-warm)] p-0.5 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="px-4 py-3 border-t border-[var(--ds-border)]">
          <button
            onClick={() => {
              setView('settings');
              toggleSidebar();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-[var(--ds-text-muted)] hover:bg-[var(--ds-bg-input)] hover:text-[var(--ds-text-primary)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            设置
          </button>
        </div>
      </div>
    </>
  );
}
