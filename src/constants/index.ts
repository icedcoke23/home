import type { AppSettings, QuickLink } from '../types';

export const APP = {
  name: 'Home',
  version: '2.0',
  tagline: '智能搜索 · AI 对话 · 快捷导航',
} as const;

export const STORAGE_KEY = 'home';

export const DEBOUNCE_MS = 200;
export const AI_TIMEOUT_MS = 60000;
export const AI_MAX_RETRIES = 2;

export const DEFAULT_SETTINGS: AppSettings = {
  aiModel: 'deepseek-chat',
  aiApiKey: '',
  aiBaseUrl: '/api',
  defaultSearchEngine: 'google',
  theme: 'dark',
  language: 'zh',
  background: 'default',
  showClock: true,
  showWeather: false,
};

export const AI_MODELS = [
  { id: 'deepseek-chat', name: 'DeepSeek Chat' },
  { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' },
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus' },
] as const;

export const DEFAULT_LINKS: QuickLink[] = [
  { id: '1', title: 'GitHub', url: 'https://github.com', icon: '🐙', group: 'dev' },
  { id: '2', title: 'DeepSeek', url: 'https://chat.deepseek.com', icon: '🤖', group: 'ai' },
  { id: '3', title: '掘金', url: 'https://juejin.cn', icon: '📰', group: 'dev' },
  { id: '4', title: 'B站', url: 'https://bilibili.com', icon: '📺', group: 'social' },
  { id: '5', title: '知乎', url: 'https://zhihu.com', icon: '💡', group: 'social' },
  { id: '6', title: 'Gmail', url: 'https://mail.google.com', icon: '📧', group: 'tools' },
  { id: '7', title: 'YouTube', url: 'https://youtube.com', icon: '▶️', group: 'social' },
  { id: '8', title: 'Reddit', url: 'https://reddit.com', icon: '🔖', group: 'social' },
];

export const CHAT_PROMPTS = [
  { icon: '💻', text: '帮我写 React 组件代码' },
  { icon: '📝', text: '总结这篇文章的核心要点' },
  { icon: '🌐', text: '搜索最新的科技新闻' },
  { icon: '🎨', text: '推荐一个配色方案' },
  { icon: '📊', text: '解释量子计算的基本原理' },
  { icon: '🔧', text: '调试这段 JavaScript 代码' },
];
