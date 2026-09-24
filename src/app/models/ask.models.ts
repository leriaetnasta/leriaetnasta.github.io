/**
 * who sent a message in the CV assistant
 */
export enum ChatRole {
  Visitor = 'visitor',
  Bot = 'bot',
}

/**
 * one turn in the CV assistant conversation
 */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}
