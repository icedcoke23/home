/* ===== 类型 ===== */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
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
export interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
}
export interface Settings {
  aiModel: string;
  aiApiKey: string;
  aiBaseUrl: string;
  searchEngine: string;
  showClock: boolean;
}
