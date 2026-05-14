import { create } from 'zustand';
import type { Message, Conversation, QuickLink, AppSettings, PageView } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_QUICK_LINKS } from '../constants';

interface AppState {
  currentView: PageView;
  setView: (view: PageView) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedEngine: string;
  setSelectedEngine: (id: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  addMessage: (convId: string, msg: Message) => void;
  updateMessage: (convId: string, msgId: string, content: string) => void;
  createConversation: () => string;
  setActiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  quickLinks: QuickLink[];
  addQuickLink: (link: QuickLink) => void;
  removeQuickLink: (id: string) => void;
  reorderQuickLinks: (links: QuickLink[]) => void;
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isStreaming: boolean;
  setIsStreaming: (v: boolean) => void;
}

const STORAGE_KEY = 'home';

function load<T>(keySuffix: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${keySuffix}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(keySuffix: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${keySuffix}`, JSON.stringify(value));
  } catch { /* quota exceeded, ignore */ }
}

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  setView: (view) => set({ currentView: view }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  selectedEngine: load<string>('selectedEngine', DEFAULT_SETTINGS.defaultSearchEngine),
  setSelectedEngine: (id) => {
    save('selectedEngine', id);
    set({ selectedEngine: id });
  },

  conversations: load<Conversation[]>('conversations', []),
  activeConversationId: load<string | null>('activeConversationId', null),

  addMessage: (convId, msg) =>
    set((s) => {
      const convs = s.conversations.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() }
          : c
      );
      save('conversations', convs);
      return { conversations: convs };
    }),

  updateMessage: (convId, msgId, content) =>
    set((s) => {
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
      save('conversations', convs);
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
      save('conversations', convs);
      save('activeConversationId', id);
      return { conversations: convs, activeConversationId: id };
    });
    return id;
  },

  setActiveConversation: (id) => {
    save('activeConversationId', id);
    set({ activeConversationId: id });
  },

  deleteConversation: (id) =>
    set((s) => {
      const convs = s.conversations.filter((c) => c.id !== id);
      const nextActive = s.activeConversationId === id ? (convs[0]?.id ?? null) : s.activeConversationId;
      save('conversations', convs);
      save('activeConversationId', nextActive);
      return { conversations: convs, activeConversationId: nextActive };
    }),

  quickLinks: load<QuickLink[]>('quickLinks', DEFAULT_QUICK_LINKS),
  addQuickLink: (link) =>
    set((s) => {
      const links = [...s.quickLinks, link];
      save('quickLinks', links);
      return { quickLinks: links };
    }),
  removeQuickLink: (id) =>
    set((s) => {
      const links = s.quickLinks.filter((l) => l.id !== id);
      save('quickLinks', links);
      return { quickLinks: links };
    }),
  reorderQuickLinks: (links) => {
    save('quickLinks', links);
    set({ quickLinks: links });
  },

  settings: load<AppSettings>('settings', DEFAULT_SETTINGS),
  updateSettings: (partial) =>
    set((s) => {
      const merged = { ...s.settings, ...partial };
      save('settings', merged);
      return { settings: merged };
    }),

  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  isStreaming: false,
  setIsStreaming: (v) => set({ isStreaming: v }),
}));
