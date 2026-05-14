import { create } from 'zustand';
import type { Message, Conversation, QuickLink, Settings } from './types';

/* ---- helpers ---- */
const K = 'home_';
const load = <T,>(k: string, fb: T): T => {
  try { const r = localStorage.getItem(K + k); return r ? JSON.parse(r) : fb; }
  catch { return fb; }
};
const save = <T,>(k: string, v: T) => {
  try { localStorage.setItem(K + k, JSON.stringify(v)); } catch { /* quota */ }
};
const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/* ---- defaults ---- */
const DEFAULT_LINKS: QuickLink[] = [
  { id: '1', title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { id: '2', title: 'DeepSeek', url: 'https://chat.deepseek.com', icon: '🤖' },
  { id: '3', title: '掘金', url: 'https://juejin.cn', icon: '📰' },
  { id: '4', title: 'B站', url: 'https://bilibili.com', icon: '📺' },
  { id: '5', title: '知乎', url: 'https://zhihu.com', icon: '💡' },
  { id: '6', title: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
  { id: '7', title: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
  { id: '8', title: 'Reddit', url: 'https://reddit.com', icon: '🔖' },
];

const DEFAULT_SETTINGS: Settings = {
  aiModel: 'deepseek-chat',
  aiApiKey: '',
  aiBaseUrl: '/api',
  searchEngine: 'google',
  showClock: true,
};

/* ---- store ---- */
type View = 'home' | 'chat' | 'settings';

interface State {
  view: View;
  setView: (v: View) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchEngine: string;
  setSearchEngine: (id: string) => void;

  conversations: Conversation[];
  activeConvId: string | null;
  addMessage: (cid: string, m: Message) => void;
  updateMessage: (cid: string, mid: string, c: string) => void;
  newConversation: () => string;
  setActiveConv: (id: string) => void;
  deleteConversation: (id: string) => void;

  quickLinks: QuickLink[];
  addLink: (l: QuickLink) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: QuickLink[]) => void;

  settings: Settings;
  updateSettings: (p: Partial<Settings>) => void;

  isStreaming: boolean;
  setIsStreaming: (v: boolean) => void;
}

export const useStore = create<State>((set) => ({
  view: 'home',
  setView: (view) => set({ view }),
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  searchEngine: load('engine', 'google'),
  setSearchEngine: (id) => { save('engine', id); set({ searchEngine: id }); },

  conversations: load('convs', []),
  activeConvId: load('activeConv', null),

  addMessage: (cid, msg) => set((s) => {
    const conversations = s.conversations.map((c) =>
      c.id === cid ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() } : c
    );
    save('convs', conversations);
    return { conversations };
  }),
  updateMessage: (cid, mid, content) => set((s) => {
    const conversations = s.conversations.map((c) =>
      c.id === cid ? {
        ...c,
        messages: c.messages.map((m) => m.id === mid ? { ...m, content, streaming: false } : m),
        updatedAt: Date.now(),
      } : c
    );
    save('convs', conversations);
    return { conversations, isStreaming: false };
  }),
  newConversation: () => {
    const id = uid();
    const conv: Conversation = { id, title: '新对话', messages: [], createdAt: Date.now(), updatedAt: Date.now() };
    set((s) => {
      const conversations = [conv, ...s.conversations];
      save('convs', conversations);
      save('activeConv', id);
      return { conversations, activeConvId: id };
    });
    return id;
  },
  setActiveConv: (id) => { save('activeConv', id); set({ activeConvId: id }); },
  deleteConversation: (id) => set((s) => {
    const conversations = s.conversations.filter((c) => c.id !== id);
    const activeConvId = s.activeConvId === id ? (conversations[0]?.id ?? null) : s.activeConvId;
    save('convs', conversations);
    save('activeConv', activeConvId);
    return { conversations, activeConvId };
  }),

  quickLinks: load('links', DEFAULT_LINKS),
  addLink: (link) => set((s) => {
    const quickLinks = [...s.quickLinks, link];
    save('links', quickLinks);
    return { quickLinks };
  }),
  removeLink: (id) => set((s) => {
    const quickLinks = s.quickLinks.filter((l) => l.id !== id);
    save('links', quickLinks);
    return { quickLinks };
  }),
  reorderLinks: (quickLinks) => { save('links', quickLinks); set({ quickLinks }); },

  settings: load('settings', DEFAULT_SETTINGS),
  updateSettings: (partial) => set((s) => {
    const settings = { ...s.settings, ...partial };
    save('settings', settings);
    return { settings };
  }),

  isStreaming: false,
  setIsStreaming: (isStreaming) => set({ isStreaming }),
}));
