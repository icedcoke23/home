/* 类型定义 */

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  streaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface SearchEngine {
  id: string;
  name: string;
  icon: string;
  url: string;
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface AppSettings {
  aiModel: string;
  aiApiKey: string;
  aiBaseUrl: string;
  defaultSearchEngine: string;
  theme: 'dark' | 'light';
  language: 'zh' | 'en';
}

export type PageView = 'home' | 'chat' | 'settings';
