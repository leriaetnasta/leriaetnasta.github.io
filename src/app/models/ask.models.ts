/**
 * who sent a message in the CV assistant
 */
export enum ChatRole {
  Visitor = 'visitor',
  Bot = 'bot',
}

/**
 * how a bot message was produced, which drives the streaming cursor and the
 * "answered offline" note
 */
export type ChatStatus = 'streaming' | 'done' | 'fallback';

/**
 * one turn in the CV assistant conversation
 */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  status?: ChatStatus;
}

/**
 * one event from the assistant's streaming endpoint
 */
export type ChatEvent =
  | { type: 'token'; text: string }
  | { type: 'done'; model?: string; version?: string }
  | { type: 'error'; code: string; retryAfter?: number };
