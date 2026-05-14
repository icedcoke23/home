/* ===== 演示数据 ===== */
import type { QuickLink, HotTag } from './types';

export const NAV_LINKS: QuickLink[] = [
  { id: '1', title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { id: '2', title: 'DeepSeek', url: 'https://chat.deepseek.com', icon: '🤖' },
  { id: '3', title: '掘金', url: 'https://juejin.cn', icon: '📰' },
  { id: '4', title: 'B站', url: 'https://bilibili.com', icon: '📺' },
  { id: '5', title: '知乎', url: 'https://zhihu.com', icon: '💡' },
  { id: '6', title: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
  { id: '7', title: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
  { id: '8', title: 'Reddit', url: 'https://reddit.com', icon: '🔖' },
];

export const HOT_TAGS: HotTag[] = [
  { id: '1', text: 'React 19' },
  { id: '2', text: 'Tailwind CSS' },
  { id: '3', text: 'AI 编程' },
  { id: '4', text: 'TypeScript' },
  { id: '5', text: 'Vite 8' },
];

export const SEARCH_ENGINES = {
  google:   { name: 'Google', icon: '🔍' },
  bing:     { name: 'Bing', icon: '🔎' },
  baidu:    { name: '百度', icon: '🅱️' },
  duckduckgo: { name: 'DuckDuckGo', icon: '🦆' },
} as const;

/* ===== 模拟 AI 回复 ===== */
const AI_REPLIES: Record<string, string> = {
  '你好': '你好！我是 AI 助手，有什么可以帮助你的吗？',
  '天气': '今天天气晴朗，适合出门散步 🌤️',
  'react': 'React 是一个用于构建用户界面的 JavaScript 库。它采用组件化开发模式，通过虚拟 DOM 实现高效的页面更新。React 19 引入了 Server Components、Actions 等新特性。',
  'tailwind': 'Tailwind CSS 是一个实用优先的 CSS 框架，通过组合原子类来快速构建界面。v4 版本使用 CSS 原生 `@import` 和 `@theme` 语法，不再需要配置文件。',
  'ai': 'AI（人工智能）正在深刻改变软件开发方式。从代码生成到智能调试，AI 工具让开发者可以专注于更有创造性的工作。',
  'typescript': 'TypeScript 是 JavaScript 的超集，添加了静态类型系统。它能帮助你在编译时发现错误，提供更好的 IDE 支持和代码提示。',
};

export function getMockReply(query: string): string {
  const q = query.toLowerCase();
  for (const [key, reply] of Object.entries(AI_REPLIES)) {
    if (q.includes(key)) return reply;
  }
  const defaults = [
    `关于「${query}」这个问题，我还在学习中... 🤔\n\n你可以尝试问我：\n• React 相关的问题\n• Tailwind CSS 的使用\n• AI 编程技巧\n• TypeScript 类型系统`,
    `好问题！让我想想...\n\n「${query}」是一个有趣的话题。作为一个 AI 助手，我正在不断学习新知识来更好地回答各种问题。`,
    `我理解你想了解「${query}」。\n\n目前我可以帮你解答以下方面：\n• 前端开发（React、Vue、CSS）\n• 编程语言（TypeScript、Python）\n• AI 与机器学习\n• 工具与效率`,
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}
