import { ChatMessage } from '@sales-agent/types';

export class ChatInMemoryRepo {
  private static memory: Record<string, ChatMessage[]> = {};

  static addMessage(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
  ) {
    if (!this.memory[sessionId]) this.memory[sessionId] = [];
    this.memory[sessionId].push({ sessionId, role, content });
  }

  static getMessages(sessionId: string, limit = 5): ChatMessage[] {
    return this.memory[sessionId]?.slice(-limit) || [];
  }
}
