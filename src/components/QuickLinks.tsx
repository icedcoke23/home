import { useState } from 'react';
import { useStore } from '../store';
import type { QuickLink } from '../types';

export default function QuickLinks() {
  const links = useStore((s) => s.quickLinks);
  const add = useStore((s) => s.addLink);
  const remove = useStore((s) => s.removeLink);
  const [edit, setEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-medium text-[var(--text3)] uppercase tracking-wider">快捷导航</span>
        <div className="flex gap-3">
          <button onClick={() => setShowAdd(true)}
            className="text-[11px] text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">添加</button>
          <button onClick={() => setEdit(!edit)}
            className={`text-[11px] transition-colors ${edit ? 'text-[var(--warm)]' : 'text-[var(--text3)] hover:text-[var(--text2)]'}`}>
            {edit ? '完成' : '编辑'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 stagger">
        {links.map((l) => (
          <div key={l.id} className="relative group">
            <a href={l.url} target="_blank" rel="noopener noreferrer"
              onClick={(e) => edit && e.preventDefault()}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl
                          bg-[var(--surface)] hover:bg-[var(--surface-hover)]
                          border border-transparent hover:border-[var(--border)]
                          transition-all duration-150 active:scale-95 block
                          ${edit ? 'pointer-events-none' : ''}`}>
              <span className="text-2xl">{l.icon}</span>
              <span className="text-[10px] text-[var(--text2)] truncate w-full text-center leading-tight">{l.title}</span>
            </a>
            {edit && (
              <button onClick={() => remove(l.id)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--warm)]
                           text-white text-[8px] flex items-center justify-center anim-fade-in">
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={(l) => { add(l); setShowAdd(false); }} />}
    </div>
  );
}

function AddModal({ onClose, onAdd }: { onClose: () => void; onAdd: (l: QuickLink) => void }) {
  const [t, setT] = useState('');
  const [u, setU] = useState('');
  const [i, setI] = useState('🔗');
  const ok = t.trim() && u.trim();
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center anim-fade-in" onClick={onClose}>
      <div className="bg-[#141428] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xs p-5 anim-fade-up" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-medium text-[var(--text)] mb-4">添加快捷方式</h3>
        <div className="flex flex-col gap-3">
          <input value={i} onChange={(e) => setI(e.target.value)} placeholder="🔗 emoji"
            className="bg-[var(--input)] text-[var(--text)] text-sm px-3 py-2.5 rounded-xl border border-[var(--border)] focus:border-[var(--accent)]/30 outline-none transition-colors" />
          <input value={t} onChange={(e) => setT(e.target.value)} placeholder="名称"
            className="bg-[var(--input)] text-[var(--text)] text-sm px-3 py-2.5 rounded-xl border border-[var(--border)] focus:border-[var(--accent)]/30 outline-none transition-colors" />
          <input value={u} onChange={(e) => setU(e.target.value)} placeholder="https://..."
            className="bg-[var(--input)] text-[var(--text)] text-sm px-3 py-2.5 rounded-xl border border-[var(--border)] focus:border-[var(--accent)]/30 outline-none transition-colors" />
          <div className="flex gap-2 mt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[var(--surface)] text-sm text-[var(--text2)] hover:text-[var(--text)] transition-colors">取消</button>
            <button onClick={() => ok && onAdd({ id: `l_${Date.now()}`, title: t.trim(), url: u.startsWith('http') ? u.trim() : `https://${u.trim()}`, icon: i.trim() || '🔗' })}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${ok ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface)] text-[var(--text3)]'}`}>添加</button>
          </div>
        </div>
      </div>
    </div>
  );
}
