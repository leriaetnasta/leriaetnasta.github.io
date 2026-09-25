import Anthropic from "@anthropic-ai/sdk";
import type { Env, Turn } from "./types";

/**
 * Each provider yields the answer as plain text deltas, so swapping the model
 * behind the assistant never changes the wire format the browser reads.
 */
export type TextStream = AsyncGenerator<string>;

export interface Provider {
  id: string;
  stream(env: Env, system: string, messages: Turn[]): TextStream;
}

/** Free tier, no key, and the default: Llama on Cloudflare's own edge. */
export const workersAi: Provider = {
  id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  async *stream(env, system, messages) {
    const upstream = await env.AI.run(workersAi.id, {
      stream: true,
      max_tokens: 700,
      temperature: 0.2,
      messages: [{ role: "system", content: system }, ...messages],
    });

    const decoder = new TextDecoder();
    const reader = upstream.getReader();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const { response } = JSON.parse(payload) as { response?: unknown };
          // the model occasionally emits a bare number for a numeric token
          if (response !== undefined && response !== null && response !== "") {
            yield String(response);
          }
        } catch {
          // a partial JSON line: the next chunk completes it
        }
      }
    }
  },
};

/**
 * Claude, via Anthropic directly or any Anthropic-compatible gateway pointed at
 * by ANTHROPIC_BASE_URL. Used only when ANTHROPIC_API_KEY is set as a secret.
 */
export const claude: Provider = {
  id: "claude",
  async *stream(env, system, messages) {
    const client = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
      ...(env.ANTHROPIC_BASE_URL ? { baseURL: env.ANTHROPIC_BASE_URL } : {}),
    });

    const stream = client.messages.stream({
      model: env.ANTHROPIC_MODEL ?? "claude-opus-5",
      max_tokens: 700,
      // a CV lookup is not a reasoning problem, and low effort keeps it cheap
      output_config: { effort: "low" },
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages: messages.map(({ role, content }) => ({ role, content })),
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield event.delta.text;
      }
    }
  },
};

/** the key decides: with one, Claude answers; without, the free model does */
export function pickProvider(env: Env): Provider {
  return env.ANTHROPIC_API_KEY ? claude : workersAi;
}
