import type { Message } from '../types';
import { AI_TIMEOUT_MS, AI_MAX_RETRIES } from '../constants';

interface ChatCompletionChunk {
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

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries: number = AI_MAX_RETRIES,
): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, init);
      if (res.ok) return res;

      // 4xx 错误不重试
      if (res.status >= 400 && res.status < 500) {
        const errText = await res.text().catch(() => 'Unknown error');
        throw new AIError(`API Error ${res.status}: ${errText}`, res.status);
      }

      // 5xx 或网络错误，重试
      if (i === retries) {
        const errText = await res.text().catch(() => 'Unknown error');
        throw new AIError(`API Error ${res.status}: ${errText}`, res.status);
      }

      // 指数退避: 1s, 2s, 4s
      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
    } catch (err) {
      if (err instanceof AIError) throw err;
      if (i === retries) throw new AIError(`网络请求失败: ${(err as Error).message}`);
      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
  throw new AIError('Max retries exceeded');
}

/**
 * 流式 AI 对话请求（带超时与重试）
 */
export async function streamChat(
  messages: Pick<Message, 'role' | 'content'>[],
  apiKey: string,
  baseUrl: string,
  model: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const url = `${baseUrl}/chat/completions`;

  // 超时控制
  const timeoutId = setTimeout(() => {
    if (signal && !signal.aborted) {
      // 超时通过 AbortController 中断
      const controller = new AbortController();
      controller.abort(new Error('请求超时'));
    }
  }, AI_TIMEOUT_MS);

  const internalController = new AbortController();
  const combinedSignal = signal
    ? combineSignals(signal, internalController.signal)
    : internalController.signal;

  try {
    const res = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      }),
      signal: combinedSignal,
    });

    const reader = res.body?.getReader();
    if (!reader) throw new AIError('No response body');

    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') continue;

        try {
          const chunk: ChatCompletionChunk = JSON.parse(data);
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            fullContent += content;
            onChunk(fullContent);
          }
        } catch {
          // 跳过解析失败的行
        }
      }
    }

    return fullContent;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw err instanceof AIError ? err : new AIError(`请求失败: ${(err as Error).message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 非流式 AI 请求
 */
export async function chatCompletion(
  messages: Pick<Message, 'role' | 'content'>[],
  apiKey: string,
  baseUrl: string,
  model: string,
): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      max_tokens: 100,
    }),
  });

  if (!res.ok) throw new AIError(`API Error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

function combineSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const sig of signals) {
    if (sig.aborted) {
      controller.abort(sig.reason);
      return controller.signal;
    }
    sig.addEventListener('abort', () => controller.abort(sig.reason), { once: true });
  }
  return controller.signal;
}
