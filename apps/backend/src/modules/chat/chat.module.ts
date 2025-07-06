import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GuidelineModule } from '../guideline/guideline.module';
import { OpenAiApiService } from '../llm-integrations/open-ai-api.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [GuidelineModule],
  providers: [ChatService, OpenAiApiService],
  controllers: [ChatController],
})
export class ChatModule {}
