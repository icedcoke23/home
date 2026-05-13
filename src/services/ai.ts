import type { Message } from '../types';

interface ChatCompletionChunk {
  choices: { delta: { content?: string }; index: number }[];
}

/**
 * 流式 AI 对话请求
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

  const res = await fetch(url, {
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
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    throw new Error(`API Error ${res.status}: ${errText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');

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
}

/**
 * 非流式 AI 请求（用于标题生成等）
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

  if (!res.ok) throw new Error(`API Error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
