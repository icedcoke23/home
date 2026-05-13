import { useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function Settings() {
  const { settings, updateSettings, setView } = useAppStore();
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const models = [
    { id: 'deepseek-chat', name: 'DeepSeek Chat' },
    { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' },
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
    { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--ds-border)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('home')}
            className="text-[var(--ds-text-muted)] hover:text-[var(--ds-text-primary)] transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-sm font-semibold text-[var(--ds-text-primary)]">设置</h2>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
            saved
              ? 'bg-green-500/20 text-green-400'
              : 'bg-[var(--ds-accent)] text-white'
          }`}
        >
          {saved ? '✓ 已保存' : '保存'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
        {/* AI API 配置 */}
        <section>
          <h3 className="text-xs font-medium text-[var(--ds-text-muted)] uppercase tracking-wider mb-3">
            AI 接口配置
          </h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-[var(--ds-text-muted)] mb-1.5 block">模型</label>
              <select
                value={localSettings.aiModel}
                onChange={(e) => setLocalSettings({ ...localSettings, aiModel: e.target.value })}
                className="w-full bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] text-sm px-3 py-2.5 rounded-xl border border-[var(--ds-border)] focus:border-[var(--ds-accent)] outline-none appearance-none"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--ds-text-muted)] mb-1.5 block">API Key</label>
              <input
                type="password"
                value={localSettings.aiApiKey}
                onChange={(e) => setLocalSettings({ ...localSettings, aiApiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] text-sm px-3 py-2.5 rounded-xl border border-[var(--ds-border)] focus:border-[var(--ds-accent)] outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--ds-text-muted)] mb-1.5 block">API 地址</label>
              <input
                type="text"
                value={localSettings.aiBaseUrl}
                onChange={(e) => setLocalSettings({ ...localSettings, aiBaseUrl: e.target.value })}
                placeholder="https://api.deepseek.com"
                className="w-full bg-[var(--ds-bg-input)] text-[var(--ds-text-primary)] text-sm px-3 py-2.5 rounded-xl border border-[var(--ds-border)] focus:border-[var(--ds-accent)] outline-none"
              />
            </div>
          </div>
        </section>

        {/* 搜索引擎 */}
        <section>
          <h3 className="text-xs font-medium text-[var(--ds-text-muted)] uppercase tracking-wider mb-3">
            默认搜索引擎
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'google', name: 'Google', icon: '🔍' },
              { id: 'bing', name: 'Bing', icon: '🔎' },
              { id: 'baidu', name: '百度', icon: '🅱️' },
              { id: 'duckduckgo', name: 'DuckDuckGo', icon: '🦆' },
            ].map((e) => (
              <button
                key={e.id}
                onClick={() => setLocalSettings({ ...localSettings, defaultSearchEngine: e.id })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  localSettings.defaultSearchEngine === e.id
                    ? 'bg-[var(--ds-accent)]/20 text-[var(--ds-accent)] border border-[var(--ds-accent)]/30'
                    : 'bg-[var(--ds-bg-input)] text-[var(--ds-text-secondary)] border border-transparent'
                }`}
              >
                <span>{e.icon}</span>
                <span>{e.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 主题 */}
        <section>
          <h3 className="text-xs font-medium text-[var(--ds-text-muted)] uppercase tracking-wider mb-3">
            主题
          </h3>
          <div className="flex gap-2">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setLocalSettings({ ...localSettings, theme: t })}
                className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${
                  localSettings.theme === t
                    ? 'bg-[var(--ds-accent)]/20 text-[var(--ds-accent)] border border-[var(--ds-accent)]/30'
                    : 'bg-[var(--ds-bg-input)] text-[var(--ds-text-secondary)] border border-transparent'
                }`}
              >
                {t === 'dark' ? '🌙 深色' : '☀️ 浅色'}
              </button>
            ))}
          </div>
        </section>

        {/* 关于 */}
        <section className="mt-auto">
          <div className="text-center pt-4 pb-2 border-t border-[var(--ds-border)]">
            <p className="text-[10px] text-[var(--ds-text-muted)]">
              Home v1.0 · DeepSeek Style Navigation
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
