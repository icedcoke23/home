import type { Message } from '../types';
import { AI_TIMEOUT_MS, AI_MAX_RETRIES } from '../constants';

interface ChatChunk {
  choices: { delta: { content?: string }; index: number }[];
}

class AIError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AIError';
    this.status = status;
  }
}

async function fetchWithRetry(url: string, init: RequestInit, retries = AI_MAX_RETRIES): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, init);
      if (res.ok) return res;
      if (res.status >= 400 && res.status < 500) {
        const text = await res.text().catch(() => '请求失败');
        throw new AIError(`API 错误 ${res.status}: ${text}`, res.status);
      }
      if (i === retries) throw new AIError(`服务暂时不可用 (${res.status})`, res.status);
    } catch (err) {
      if (err instanceof AIError) throw err;
      if (i === retries) throw new AIError(`网络连接失败: ${(err as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
  }
  throw new AIError('超过最大重试次数');
}

function combineSignals(...signals: AbortSignal[]): AbortSignal {
  const ctrl = new AbortController();
  for (const sig of signals) {
    if (sig.aborted) { ctrl.abort(sig.reason); return ctrl.signal; }
    sig.addEventListener('abort', () => ctrl.abort(sig.reason), { once: true });
  }
  return ctrl.signal;
}

/** 流式 AI 对话 */
export async function streamChat(
  messages: Pick<Message, 'role' | 'content'>[],
  apiKey: string,
  baseUrl: string,
  model: string,
  onChunk: (fullText: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const url = `${baseUrl}/chat/completions`;
  const internalCtrl = new AbortController();
  const combined = signal ? combineSignals(signal, internalCtrl.signal) : internalCtrl.signal;

  const timeout = setTimeout(() => internalCtrl.abort(new Error('请求超时')), AI_TIMEOUT_MS);

  try {
    const res = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, stream: true, temperature: 0.7, max_tokens: 4096 }),
      signal: combined,
    });

    const reader = res.body?.getReader();
    if (!reader) throw new AIError('无法读取响应');

    const decoder = new TextDecoder();
    let full = '', buf = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';

      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith('data: ')) continue;
        const data = t.slice(6);
        if (data === '[DONE]') continue;
        try {
          const c: ChatChunk = JSON.parse(data);
          const content = c.choices?.[0]?.delta?.content;
          if (content) { full += content; onChunk(full); }
        } catch { /* skip parse errors */ }
      }
    }
    return full;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw err instanceof AIError ? err : new AIError(`请求失败: ${(err as Error).message}`);
  } finally {
    clearTimeout(timeout);
  }
}

/** 非流式 AI 请求 */
export async function chatCompletion(
  messages: Pick<Message, 'role' | 'content'>[],
  apiKey: string,
  baseUrl: string,
  model: string,
): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, stream: false, max_tokens: 100 }),
  });
  if (!res.ok) throw new AIError(`API 错误 ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
