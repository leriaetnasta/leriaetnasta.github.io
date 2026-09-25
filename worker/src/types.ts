export type Locale = "en" | "fr";

export type Turn = { role: "user" | "assistant"; content: string };

export interface Env {
  AI: { run(model: string, options: Record<string, unknown>): Promise<ReadableStream> };
  CHAT_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };

  /** set as a Wrangler secret to answer with Claude instead of the free model */
  ANTHROPIC_API_KEY?: string;
  /** points the Anthropic client at a compatible gateway rather than api.anthropic.com */
  ANTHROPIC_BASE_URL?: string;
  ANTHROPIC_MODEL?: string;
}
