import type { Message } from '../types';

interface Chunk { choices: { delta: { content?: string } }[] }

export async function streamChat(
  messages: Pick<Message, 'role' | 'content'>[],
  apiKey: string, baseUrl: string, model: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, stream: true, temperature: 0.7, max_tokens: 4096 }),
    signal,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${t}`);
  }
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No body');
  const dec = new TextDecoder();
  let full = '', buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() || '';
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith('data: ')) continue;
      const d = t.slice(6);
      if (d === '[DONE]') continue;
      try {
        const c: Chunk = JSON.parse(d);
        const content = c.choices?.[0]?.delta?.content;
        if (content) { full += content; onChunk(full); }
      } catch { /* skip */ }
    }
  }
  return full;
}
