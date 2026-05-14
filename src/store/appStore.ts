import { create } from 'zustand';
import type { Message, Conversation, QuickLink, AppSettings, PageView } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_LINKS, STORAGE_KEY } from '../constants';

/* ---- localStorage helpers ---- */
function load<T>(suffix: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${suffix}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function save<T>(suffix: string, value: T) {
  try { localStorage.setItem(`${STORAGE_KEY}_${suffix}`, JSON.stringify(value)); } catch { /* quota */ }
}
const genId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

/* ---- Store ---- */
interface AppState {
  page: PageView;
  setPage: (v: PageView) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedEngine: string;
  setSelectedEngine: (id: string) => void;

  conversations: Conversation[];
  activeConvId: string | null;
  addMessage: (cid: string, m: Message) => void;
  updateMessage: (cid: string, mid: string, content: string) => void;
  createConversation: () => string;
  setActiveConv: (id: string) => void;
  deleteConversation: (id: string) => void;

  quickLinks: QuickLink[];
  addLink: (l: QuickLink) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: QuickLink[]) => void;

  settings: AppSettings;
  updateSettings: (p: Partial<AppSettings>) => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isStreaming: boolean;
  setIsStreaming: (v: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  page: 'home',
  setPage: (page) => set({ page }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  selectedEngine: load('selectedEngine', DEFAULT_SETTINGS.defaultSearchEngine),
  setSelectedEngine: (id) => { save('selectedEngine', id); set({ selectedEngine: id }); },

  conversations: load('conversations', []),
  activeConvId: load('activeConvId', null),

  addMessage: (cid, msg) => set((s) => {
    const conversations = s.conversations.map((c) =>
      c.id === cid ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() } : c
    );
    save('conversations', conversations);
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
    save('conversations', conversations);
    return { conversations, isStreaming: false };
  }),
  createConversation: () => {
    const id = genId();
    const conv: Conversation = { id, title: '新对话', messages: [], createdAt: Date.now(), updatedAt: Date.now() };
    set((s) => {
      const conversations = [conv, ...s.conversations];
      save('conversations', conversations);
      save('activeConvId', id);
      return { conversations, activeConvId: id };
    });
    return id;
  },
  setActiveConv: (id) => { save('activeConvId', id); set({ activeConvId: id }); },
  deleteConversation: (id) => set((s) => {
    const conversations = s.conversations.filter((c) => c.id !== id);
    const activeConvId = s.activeConvId === id ? (conversations[0]?.id ?? null) : s.activeConvId;
    save('conversations', conversations);
    save('activeConvId', activeConvId);
    return { conversations, activeConvId };
  }),

  quickLinks: load('quickLinks', DEFAULT_LINKS),
  addLink: (link) => set((s) => {
    const quickLinks = [...s.quickLinks, link];
    save('quickLinks', quickLinks);
    return { quickLinks };
  }),
  removeLink: (id) => set((s) => {
    const quickLinks = s.quickLinks.filter((l) => l.id !== id);
    save('quickLinks', quickLinks);
    return { quickLinks };
  }),
  reorderLinks: (quickLinks) => { save('quickLinks', quickLinks); set({ quickLinks }); },

  settings: load('settings', DEFAULT_SETTINGS),
  updateSettings: (partial) => set((s) => {
    const settings = { ...s.settings, ...partial };
    save('settings', settings);
    return { settings };
  }),

  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  isStreaming: false,
  setIsStreaming: (isStreaming) => set({ isStreaming }),
}));
