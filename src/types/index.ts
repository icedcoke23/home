/* ===== 类型定义 v2.0 ===== */

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
  group?: string;
  order?: number;
}

export interface QuickLinkGroup {
  id: string;
  name: string;
  links: QuickLink[];
}

export interface AppSettings {
  aiModel: string;
  aiApiKey: string;
  aiBaseUrl: string;
  defaultSearchEngine: string;
  theme: 'dark' | 'light' | 'auto';
  language: 'zh' | 'en';
  background: 'default' | 'gradient' | 'minimal';
  showClock: boolean;
  showWeather: boolean;
}

export interface WeatherData {
  temp: string;
  condition: string;
  icon: string;
  humidity: string;
  wind: string;
  location: string;
}

export type PageView = 'home' | 'chat' | 'settings';
