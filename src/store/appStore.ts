import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type { Message, Conversation, QuickLink, AppSettings, PageView } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_QUICK_LINKS, STORAGE_PREFIX } from '../constants';

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

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        currentView: 'home',
        setView: (view) => set({ currentView: view }),

        searchQuery: '',
        setSearchQuery: (q) => set({ searchQuery: q }),
        selectedEngine: DEFAULT_SETTINGS.defaultSearchEngine,
        setSelectedEngine: (id) => set({ selectedEngine: id }),

        conversations: [],
        activeConversationId: null,

        addMessage: (convId, msg) =>
          set((s) => ({
            conversations: s.conversations.map((c) =>
              c.id === convId
                ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() }
                : c
            ),
          })),

        updateMessage: (convId, msgId, content) =>
          set((s) => ({
            conversations: s.conversations.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === msgId ? { ...m, content, streaming: false } : m
                    ),
                    updatedAt: Date.now(),
                  }
                : c
            ),
            isStreaming: false,
          })),

        createConversation: () => {
          const id = generateId();
          const conv: Conversation = {
            id,
            title: '新对话',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          set((s) => ({
            conversations: [conv, ...s.conversations],
            activeConversationId: id,
          }));
          return id;
        },

        setActiveConversation: (id) => set({ activeConversationId: id }),

        deleteConversation: (id) =>
          set((s) => {
            const convs = s.conversations.filter((c) => c.id !== id);
            const nextActive =
              s.activeConversationId === id ? (convs[0]?.id ?? null) : s.activeConversationId;
            return { conversations: convs, activeConversationId: nextActive };
          }),

        quickLinks: DEFAULT_QUICK_LINKS,
        addQuickLink: (link) =>
          set((s) => ({ quickLinks: [...s.quickLinks, link] })),
        removeQuickLink: (id) =>
          set((s) => ({ quickLinks: s.quickLinks.filter((l) => l.id !== id) })),
        reorderQuickLinks: (links) => set({ quickLinks: links }),

        settings: DEFAULT_SETTINGS,
        updateSettings: (partial) =>
          set((s) => ({ settings: { ...s.settings, ...partial } })),

        sidebarOpen: false,
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
        isStreaming: false,
        setIsStreaming: (v) => set({ isStreaming: v }),
      }),
      {
        name: STORAGE_PREFIX,
        partialize: (state) => ({
          conversations: state.conversations,
          activeConversationId: state.activeConversationId,
          quickLinks: state.quickLinks,
          selectedEngine: state.selectedEngine,
          settings: state.settings,
        }),
      }
    )
  )
);
