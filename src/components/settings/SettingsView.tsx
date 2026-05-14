import { useState, useCallback } from 'react';
import { useStore } from '../../store/appStore';
import { AI_MODELS, APP } from '../../constants';

export default function SettingsView() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const setPage = useStore((s) => s.setPage);
  const [local, setLocal] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [local, updateSettings]);

  const update = useCallback((k: string, v: unknown) =>
    setLocal((p) => ({ ...p, [k]: v })), []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--ds-border)]">
        <div className="flex items-center gap-2">
          <button onClick={() => setPage('home')}
            className="text-[var(--ds-text-muted)] hover:text-[var(--ds-text-primary)] transition-colors duration-150 p-1"
            aria-label="返回主页">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-sm font-semibold text-[var(--ds-text-primary)]">设置</h2>
        </div>
        <button onClick={handleSave}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 ${
            saved ? 'bg-[var(--ds-accent-green)]/20 text-[var(--ds-accent-green)]' : 'bg-[var(--ds-accent)] text-white hover:bg-[var(--ds-accent-hover)]'
          }`}>
          {saved ? '✓ 已保存' : '保存'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
        {/* AI */}
        <section>
          <h3 className="text-xs font-medium text-[var(--ds-text-muted)] uppercase tracking-wider mb-3">AI 接口配置</h3>
          <div className="flex flex-col gap-3">
            <SelectField label="模型" value={local.aiModel}
              onChange={(v) => update('aiModel', v)}
              options={AI_MODELS.map((m) => ({ value: m.id, label: m.name }))} />
            <InputField label="API Key" type="password" value={local.aiApiKey}
              onChange={(v) => update('aiApiKey', v)} placeholder="sk-..." />
            <InputField label="API 地址" value={local.aiBaseUrl}
              onChange={(v) => update('aiBaseUrl', v)} placeholder="https://api.deepseek.com" />
          </div>
        </section>

        {/* Search engine */}
        <section>
          <h3 className="text-xs font-medium text-[var(--ds-text-muted)] uppercase tracking-wider mb-3">默认搜索引擎</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'google', name: 'Google', icon: '🔍' },
              { id: 'bing', name: 'Bing', icon: '🔎' },
              { id: 'baidu', name: '百度', icon: '🅱️' },
              { id: 'duckduckgo', name: 'DuckDuckGo', icon: '🦆' },
            ].map((e) => (
              <button key={e.id} onClick={() => update('defaultSearchEngine', e.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  local.defaultSearchEngine === e.id
                    ? 'bg-[var(--ds-accent)]/15 text-[var(--ds-accent)] border border-[var(--ds-accent)]/30'
                    : 'bg-[var(--ds-bg-input)] text-[var(--ds-text-secondary)] border border-transparent hover:bg-[var(--ds-bg-card)]'
                }`}>
                <span>{e.icon}</span> <span>{e.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h3 className="text-xs font-medium text-[var(--ds-text-muted)] uppercase tracking-wider mb-3">外观</h3>
          <div className="flex gap-2 mb-2">
            {(['dark', 'auto'] as const).map((t) => (
              <button key={t} onClick={() => update('theme', t)}
                className={`flex-1 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  local.theme === t
                    ? 'bg-[var(--ds-accent)]/15 text-[var(--ds-accent)] border border-[var(--ds-accent)]/30'
                    : 'bg-[var(--ds-bg-input)] text-[var(--ds-text-secondary)] border border-transparent hover:bg-[var(--ds-bg-card)]'
                }`}>
                {t === 'dark' ? '🌙 深色' : '🔄 自动'}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Toggle label="显示时钟" checked={local.showClock} onChange={(v) => update('showClock', v)} />
            <Toggle label="显示天气" checked={local.showWeather} onChange={(v) => update('showWeather', v)} />
          </div>
        </section>

        {/* About */}
        <section className="mt-auto">
          <div className="text-center pt-4 pb-2 border-t border-[var(--ds-border)]">
            <p className="text-[10px] text-[var(--ds-text-muted)]">
              {APP.name} v{APP.version} · {APP.tagline}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---- Reusable fields ---- */
function InputField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-[var(--ds-text-muted)] mb-1.5 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] text-sm px-3 py-2.5 rounded-xl
                   border border-[var(--ds-border)] focus:border-[var(--ds-accent)] outline-none
                   transition-colors duration-150" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-xs text-[var(--ds-text-muted)] mb-1.5 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] text-sm px-3 py-2.5 rounded-xl
                   border border-[var(--ds-border)] focus:border-[var(--ds-accent)] outline-none appearance-none
                   transition-colors duration-150">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button onClick={() => onChange(!checked)}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[var(--ds-bg-input)]
                 border border-transparent hover:bg-[var(--ds-bg-card)] transition-colors duration-150 w-full text-left">
      <span className="text-sm text-[var(--ds-text-secondary)]">{label}</span>
      <span className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
        checked ? 'bg-[var(--ds-accent)]' : 'bg-[var(--ds-border)]'
      }`}>
        <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </span>
    </button>
  );
}
