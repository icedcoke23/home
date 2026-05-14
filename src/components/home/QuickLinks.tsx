import { useState, memo, useCallback } from 'react';
import { useStore } from '../../store/appStore';
import type { QuickLink } from '../../types';

/* ---- Individual nav card ---- */
const NavCard = memo(function NavCard({
  link, editing, onRemove,
}: { link: QuickLink; editing: boolean; onRemove: (id: string) => void }) {
  return (
    <div className="relative group">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl
                    bg-[var(--ds-bg-input)] hover:bg-[var(--ds-bg-card)]
                    border border-transparent hover:border-[var(--ds-border)]
                    transition-all duration-150 active:scale-95
                    ${editing ? 'pointer-events-none' : ''}`}
        onClick={(e) => editing && e.preventDefault()}
        aria-label={`打开 ${link.title}`}
      >
        <span className="text-2xl">{link.icon || '🔗'}</span>
        <span className="text-[11px] text-[var(--ds-text-secondary)] truncate w-full text-center leading-tight">
          {link.title}
        </span>
      </a>
      {editing && (
        <button
          onClick={() => onRemove(link.id)}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--ds-accent-warm)]
                     text-white text-[10px] flex items-center justify-center shadow-md animate-scale-in"
          aria-label={`删除 ${link.title}`}
        >
          ✕
        </button>
      )}
    </div>
  );
});

/* ---- Add dialog ---- */
function AddDialog({ onClose }: { onClose: () => void }) {
  const addLink = useStore((s) => s.addLink);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');

  const handleAdd = useCallback(() => {
    if (!title.trim() || !url.trim()) return;
    addLink({
      id: `link_${Date.now()}`,
      title: title.trim(),
      url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
      icon: icon.trim() || '🔗',
    });
    onClose();
  }, [title, url, icon, addLink, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in"
         onClick={onClose}>
      <div className="bg-[var(--ds-bg-secondary)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-5 animate-fade-in-up"
           onClick={(e) => e.stopPropagation()} role="dialog" aria-label="添加快捷方式">
        <h3 className="text-base font-medium text-[var(--ds-text-primary)] mb-4">添加快捷方式</h3>
        <div className="flex flex-col gap-3">
          <Field label="图标 (emoji)" value={icon} onChange={setIcon} placeholder="🔗" />
          <Field label="名称" value={title} onChange={setTitle} placeholder="网站名称" />
          <Field label="链接" value={url} onChange={setUrl} placeholder="https://example.com" />
          <div className="flex gap-2 mt-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[var(--ds-bg-input)] text-sm text-[var(--ds-text-secondary)]
                         hover:text-[var(--ds-text-primary)] transition-colors duration-150">
              取消
            </button>
            <button onClick={handleAdd}
              className="flex-1 py-2.5 rounded-xl bg-[var(--ds-accent)] text-sm text-white font-medium
                         hover:bg-[var(--ds-accent-hover)] active:scale-95 transition-all duration-150">
              添加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="text-xs text-[var(--ds-text-muted)] mb-1 block">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] text-sm px-3 py-2.5
                   rounded-xl border border-[var(--ds-border)] focus:border-[var(--ds-accent)] outline-none
                   transition-colors duration-150" />
    </div>
  );
}

/* ---- Main component ---- */
export default function QuickLinks() {
  const quickLinks = useStore((s) => s.quickLinks);
  const removeLink = useStore((s) => s.removeLink);
  const [editing, setEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const handleRemove = useCallback((id: string) => removeLink(id), [removeLink]);

  return (
    <div className="w-full max-w-lg mx-auto px-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-[var(--ds-text-muted)] uppercase tracking-wider">快捷导航</h3>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(true)}
            className="text-xs text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)] transition-colors duration-150">
            + 添加
          </button>
          <button onClick={() => setEditing(!editing)}
            className={`text-xs transition-colors duration-150 ${editing ? 'text-[var(--ds-accent-warm)]' : 'text-[var(--ds-text-muted)] hover:text-[var(--ds-text-secondary)]'}`}>
            {editing ? '完成' : '编辑'}
          </button>
        </div>
      </div>

      {quickLinks.length === 0 ? (
        <p className="text-xs text-[var(--ds-text-muted)] text-center py-8">暂无快捷链接，点击"+ 添加"开始</p>
      ) : (
        <div className="grid grid-cols-4 gap-3 stagger">
          {quickLinks.map((link) => (
            <NavCard key={link.id} link={link} editing={editing} onRemove={handleRemove} />
          ))}
        </div>
      )}

      {showAdd && <AddDialog onClose={() => setShowAdd(false)} />}
    </div>
  );
}
