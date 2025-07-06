import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { sessionId: string; message: string }) {
    const response = await this.chatService.handleChat(
      body.sessionId,
      body.message,
    );
    return { response };
  }
}
