import { useState } from 'react';
import { useStore } from '../store';

export default function SettingsPage() {
  const cfg = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);
  const [l, setL] = useState({ ...cfg });
  const [ok, setOk] = useState(false);

  const save = () => { update(l); setOk(true); setTimeout(() => setOk(false), 1500); };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <button onClick={() => useStore.getState().setView('home')}
          className="text-[var(--text3)] hover:text-[var(--text)] transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h2 className="text-sm font-medium text-[var(--text)]">设置</h2>
        <button onClick={save}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all active:scale-95
            ${ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--accent)] text-white'}`}>
          {ok ? '✓ 已保存' : '保存'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        <section>
          <h3 className="text-[11px] font-medium text-[var(--text3)] uppercase tracking-wider mb-3">AI 接口</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--text3)] mb-1 block">模型</label>
              <select value={l.aiModel} onChange={(e) => setL({ ...l, aiModel: e.target.value })}
                className="w-full bg-[var(--input)] text-[var(--text)] text-sm px-3 py-2.5 rounded-xl border border-[var(--border)] focus:border-[var(--accent)]/30 outline-none">
                {['deepseek-chat','deepseek-reasoner','gpt-4o','gpt-4o-mini','claude-3.5-sonnet'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--text3)] mb-1 block">API Key</label>
              <input type="password" value={l.aiApiKey} onChange={(e) => setL({ ...l, aiApiKey: e.target.value })} placeholder="sk-..."
                className="w-full bg-[var(--input)] text-[var(--text)] text-sm px-3 py-2.5 rounded-xl border border-[var(--border)] focus:border-[var(--accent)]/30 outline-none" />
            </div>
            <div>
              <label className="text-xs text-[var(--text3)] mb-1 block">API 地址</label>
              <input value={l.aiBaseUrl} onChange={(e) => setL({ ...l, aiBaseUrl: e.target.value })} placeholder="/api"
                className="w-full bg-[var(--input)] text-[var(--text)] text-sm px-3 py-2.5 rounded-xl border border-[var(--border)] focus:border-[var(--accent)]/30 outline-none" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-medium text-[var(--text3)] uppercase tracking-wider mb-3">外观</h3>
          <button onClick={() => setL({ ...l, showClock: !l.showClock })}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[var(--surface)] transition-colors">
            <span className="text-sm text-[var(--text2)]">显示时钟</span>
            <span className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${l.showClock ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}>
              <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${l.showClock ? 'translate-x-4' : ''}`} />
            </span>
          </button>
        </section>

        <section className="pt-4 border-t border-[var(--border)]">
          <p className="text-[10px] text-[var(--text3)] text-center">Home v2.0 · DeepSeek Style</p>
        </section>
      </div>
    </div>
  );
}
