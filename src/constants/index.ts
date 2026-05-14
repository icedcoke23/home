import type { AppSettings, QuickLink } from '../types';

export const APP_NAME = 'Home';
export const APP_VERSION = '1.1';
export const APP_DESCRIPTION = 'AI 智能导航主页';

export const DEFAULT_SETTINGS: AppSettings = {
  aiModel: 'deepseek-chat',
  aiApiKey: '',
  aiBaseUrl: '/api',
  defaultSearchEngine: 'google',
  theme: 'dark',
  language: 'zh',
};

export const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { id: '1', title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { id: '2', title: 'DeepSeek', url: 'https://chat.deepseek.com', icon: '🤖' },
  { id: '3', title: '掘金', url: 'https://juejin.cn', icon: '📰' },
  { id: '4', title: 'B站', url: 'https://bilibili.com', icon: '📺' },
  { id: '5', title: '知乎', url: 'https://zhihu.com', icon: '💡' },
  { id: '6', title: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
  { id: '7', title: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
  { id: '8', title: 'Reddit', url: 'https://reddit.com', icon: '🔖' },
];

export const AI_MODELS = [
  { id: 'deepseek-chat', name: 'DeepSeek Chat' },
  { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' },
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus' },
] as const;

export const STORAGE_PREFIX = 'home';

export const MAX_MESSAGE_LENGTH = 8000;
export const AI_TIMEOUT_MS = 60000;
export const AI_MAX_RETRIES = 2;
export const DEBOUNCE_MS = 200;
