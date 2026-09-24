import { Injectable } from '@angular/core';
import { ChatEvent, ChatMessage, ChatRole } from '@models/ask.models';
import { Language } from '@models/preferences.models';
import {
  ASK_ENDPOINT,
  ASK_MAX_TURNS,
  ASK_TIMEOUT_MS,
} from '@constants/ask.constants';

/**
 * Ask Service
 *
 * streams an answer from the CV assistant worker. Uses `fetch` rather than
 * HttpClient because the reply is server-sent events read as they arrive, and
 * EventSource cannot POST.
 */
@Injectable({ providedIn: 'root' })
export class AskService {
  /**
   * yield the answer token by token, or throw so the caller can fall back
   */
  public async *stream(
    language: Language,
    history: ChatMessage[]
  ): AsyncGenerator<string> {
    const messages = history
      .slice(-ASK_MAX_TURNS)
      .map((message) => ({
        role: message.role === ChatRole.Visitor ? 'user' : 'assistant',
        content: message.text,
      }));

    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), ASK_TIMEOUT_MS);

    try {
      const response = await fetch(ASK_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ locale: language, messages }),
        signal: abort.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`assistant responded ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let answered = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data:')) {
            continue;
          }

          const event = this.parse(line.slice(5).trim());
          if (event?.type === 'token') {
            answered = true;
            yield event.text;
          } else if (event?.type === 'error') {
            throw new Error(event.code);
          }
        }
      }

      if (!answered) {
        throw new Error('empty answer');
      }
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * a partial line is completed by the next chunk, so bad JSON is not fatal
   */
  private parse(payload: string): ChatEvent | null {
    if (!payload) {
      return null;
    }
    try {
      return JSON.parse(payload) as ChatEvent;
    } catch {
      return null;
    }
  }
}
