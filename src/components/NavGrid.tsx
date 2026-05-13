import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import type { QuickLink } from '../types';

export default function NavGrid() {
  const { quickLinks, addQuickLink, removeQuickLink } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const link: QuickLink = {
      id: `link_${Date.now()}`,
      title: newTitle.trim(),
      url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`,
      icon: newIcon.trim() || '🔗',
    };
    addQuickLink(link);
    setNewTitle('');
    setNewUrl('');
    setNewIcon('');
    setShowAdd(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 mt-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-[var(--ds-text-muted)] uppercase tracking-wider">
          快捷导航
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="text-xs text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)] transition-colors"
          >
            + 添加
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className={`text-xs transition-colors ${editing ? 'text-[var(--ds-accent-warm)]' : 'text-[var(--ds-text-muted)] hover:text-[var(--ds-text-secondary)]'}`}
          >
            {editing ? '完成' : '编辑'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {quickLinks.map((link) => (
          <div key={link.id} className="relative group">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[var(--ds-bg-input)] hover:bg-[var(--ds-bg-card)] border border-transparent hover:border-[var(--ds-border)] transition-all active:scale-95 block ${editing ? 'pointer-events-none' : ''}`}
              onClick={(e) => editing && e.preventDefault()}
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-[11px] text-[var(--ds-text-secondary)] truncate w-full text-center">
                {link.title}
              </span>
            </a>
            {editing && (
              <button
                onClick={() => removeQuickLink(link.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--ds-accent-warm)] text-white text-[10px] flex items-center justify-center animate-fade-in shadow-md"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 添加弹窗 */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowAdd(false)}>
          <div
            className="bg-[var(--ds-bg-secondary)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-5 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-medium text-[var(--ds-text-primary)] mb-4">添加快捷方式</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-[var(--ds-text-muted)] mb-1 block">图标 (emoji)</label>
                <input
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  placeholder="🔗"
                  className="w-full bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] text-sm px-3 py-2.5 rounded-xl border border-[var(--ds-border)] focus:border-[var(--ds-accent)] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--ds-text-muted)] mb-1 block">名称</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="网站名称"
                  className="w-full bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] text-sm px-3 py-2.5 rounded-xl border border-[var(--ds-border)] focus:border-[var(--ds-accent)] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--ds-text-muted)] mb-1 block">链接</label>
                <input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] text-sm px-3 py-2.5 rounded-xl border border-[var(--ds-border)] focus:border-[var(--ds-accent)] outline-none"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--ds-bg-input)] text-sm text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--ds-accent)] text-sm text-white font-medium active:scale-95 transition-transform"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
