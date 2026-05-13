import { create } from 'zustand';
import type { Message, Conversation, QuickLink, AppSettings, PageView } from '../types';

interface AppState {
  // 当前页面
  currentView: PageView;
  setView: (view: PageView) => void;

  // 搜索
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedEngine: string;
  setSelectedEngine: (id: string) => void;

  // AI 对话
  conversations: Conversation[];
  activeConversationId: string | null;
  addMessage: (convId: string, msg: Message) => void;
  updateMessage: (convId: string, msgId: string, content: string) => void;
  createConversation: () => string;
  setActiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;

  // 快捷链接
  quickLinks: QuickLink[];
  addQuickLink: (link: QuickLink) => void;
  removeQuickLink: (id: string) => void;
  reorderQuickLinks: (links: QuickLink[]) => void;

  // 设置
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isStreaming: boolean;
  setIsStreaming: (v: boolean) => void;
}

const defaultSettings: AppSettings = {
  aiModel: 'deepseek-chat',
  aiApiKey: '',
  aiBaseUrl: '/api',
  defaultSearchEngine: 'google',
  theme: 'dark',
  language: 'zh',
};

const defaultQuickLinks: QuickLink[] = [
  { id: '1', title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { id: '2', title: 'DeepSeek', url: 'https://chat.deepseek.com', icon: '🤖' },
  { id: '3', title: '掘金', url: 'https://juejin.cn', icon: '📰' },
  { id: '4', title: 'B站', url: 'https://bilibili.com', icon: '📺' },
  { id: '5', title: '知乎', url: 'https://zhihu.com', icon: '💡' },
  { id: '6', title: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
  { id: '7', title: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
  { id: '8', title: 'Reddit', url: 'https://reddit.com', icon: '🔖' },
];

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`home_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  setView: (view) => set({ currentView: view }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  selectedEngine: loadFromStorage<string>('selectedEngine', 'google'),
  setSelectedEngine: (id) => {
    localStorage.setItem('home_selectedEngine', JSON.stringify(id));
    set({ selectedEngine: id });
  },

  conversations: loadFromStorage<Conversation[]>('conversations', []),
  activeConversationId: loadFromStorage<string | null>('activeConversationId', null),

  addMessage: (convId, msg) => set((s) => {
    const convs = s.conversations.map((c) =>
      c.id === convId
        ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() }
        : c
    );
    localStorage.setItem('home_conversations', JSON.stringify(convs));
    return { conversations: convs };
  }),

  updateMessage: (convId, msgId, content) => set((s) => {
    const convs = s.conversations.map((c) =>
      c.id === convId
        ? {
            ...c,
            messages: c.messages.map((m) =>
              m.id === msgId ? { ...m, content, streaming: false } : m
            ),
            updatedAt: Date.now(),
          }
        : c
    );
    localStorage.setItem('home_conversations', JSON.stringify(convs));
    return { conversations: convs, isStreaming: false };
  }),

  createConversation: () => {
    const id = generateId();
    const conv: Conversation = {
      id,
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((s) => {
      const convs = [conv, ...s.conversations];
      localStorage.setItem('home_conversations', JSON.stringify(convs));
      localStorage.setItem('home_activeConversationId', JSON.stringify(id));
      return { conversations: convs, activeConversationId: id };
    });
    return id;
  },

  setActiveConversation: (id) => {
    localStorage.setItem('home_activeConversationId', JSON.stringify(id));
    set({ activeConversationId: id });
  },

  deleteConversation: (id) => set((s) => {
    const convs = s.conversations.filter((c) => c.id !== id);
    const nextActive = s.activeConversationId === id ? (convs[0]?.id ?? null) : s.activeConversationId;
    localStorage.setItem('home_conversations', JSON.stringify(convs));
    localStorage.setItem('home_activeConversationId', JSON.stringify(nextActive));
    return { conversations: convs, activeConversationId: nextActive };
  }),

  quickLinks: loadFromStorage<QuickLink[]>('quickLinks', defaultQuickLinks),
  addQuickLink: (link) => set((s) => {
    const links = [...s.quickLinks, link];
    localStorage.setItem('home_quickLinks', JSON.stringify(links));
    return { quickLinks: links };
  }),
  removeQuickLink: (id) => set((s) => {
    const links = s.quickLinks.filter((l) => l.id !== id);
    localStorage.setItem('home_quickLinks', JSON.stringify(links));
    return { quickLinks: links };
  }),
  reorderQuickLinks: (links) => {
    localStorage.setItem('home_quickLinks', JSON.stringify(links));
    set({ quickLinks: links });
  },

  settings: loadFromStorage<AppSettings>('settings', defaultSettings),
  updateSettings: (partial) => set((s) => {
    const merged = { ...s.settings, ...partial };
    localStorage.setItem('home_settings', JSON.stringify(merged));
    return { settings: merged };
  }),

  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  isStreaming: false,
  setIsStreaming: (v) => set({ isStreaming: v }),
}));
