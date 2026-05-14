import { useStore } from '../store';

export default function Sidebar() {
  const open = useStore((s) => s.sidebarOpen);
  const toggle = useStore((s) => s.toggleSidebar);
  const convs = useStore((s) => s.conversations);
  const cid = useStore((s) => s.activeConvId);
  const setCid = useStore((s) => s.setActiveConv);
  const del = useStore((s) => s.deleteConversation);
  const mk = useStore((s) => s.newConversation);
  const setV = useStore((s) => s.setView);

  if (!open) return null;

  const go = (id: string) => { setCid(id); setV('chat'); toggle(); };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 anim-fade-in" onClick={toggle} />
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#111128] z-50 anim-slide-in flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-medium text-[var(--text)]">对话历史</h2>
          <button onClick={toggle} className="text-[var(--text3)] hover:text-[var(--text)] p-1 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <button onClick={() => { mk(); setV('chat'); toggle(); }}
          className="mx-3 mt-3 py-2 rounded-xl border border-dashed border-[var(--border)]
                     text-xs text-[var(--accent)] hover:bg-[var(--surface)] transition-all active:scale-95">
          + 新对话
        </button>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {convs.length === 0 ? (
            <p className="text-xs text-[var(--text3)] text-center py-8">暂无对话</p>
          ) : (
            convs.map((c) => (
              <div key={c.id}
                onClick={() => go(c.id)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all mb-0.5 ${
                  c.id === cid ? 'bg-[var(--surface)] text-[var(--text)]' : 'text-[var(--text2)] hover:bg-[var(--surface)]'}`}>
                <span className="shrink-0">💬</span>
                <span className="flex-1 truncate">{c.messages[0]?.content?.slice(0, 25) || c.title}</span>
                <button onClick={(e) => { e.stopPropagation(); del(c.id); }}
                  className="opacity-0 group-hover:opacity-100 text-[var(--text3)] hover:text-[var(--warm)] transition-all">✕</button>
              </div>
            ))
          )}
        </div>

        <div className="px-3 py-3 border-t border-[var(--border)]">
          <button onClick={() => { setV('settings'); toggle(); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--text3)]
                       hover:bg-[var(--surface)] hover:text-[var(--text)] transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            设置
          </button>
        </div>
      </aside>
    </>
  );
}
