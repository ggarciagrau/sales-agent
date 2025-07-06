import { Injectable } from '@nestjs/common';
import { GuidelineService } from '../guideline/guideline.service';
import { ChatInMemoryRepo } from './chat-memory.repo';
import { generateEmbedding } from '@sales-agent/generate-embedding';
import { buildPrompt, formatChat } from '@sales-agent/prompt-builder';
import { OpenAiApiService } from '../llm-integrations/open-ai-api.service';
import basePrompt from './base-prompt';

@Injectable()
export class ChatService {
  constructor(
    private readonly guidelineService: GuidelineService,
    private readonly openAiApiService: OpenAiApiService,
  ) {}

  async handleChat(sessionId: string, userMessage: string): Promise<string> {
    ChatInMemoryRepo.addMessage(sessionId, 'user', userMessage);
    const history = ChatInMemoryRepo.getMessages(sessionId);
    const embedding = await generateEmbedding(userMessage);

    const [globals, dynamics] = await Promise.all([
      this.guidelineService.getGlobals(),
      this.guidelineService.getRelevant(Array.from(embedding), 5),
    ]);

    const prompt = buildPrompt({
      systemIntro: basePrompt,
      globalGuidelines: globals,
      dynamicGuidelines: dynamics,
    });

    const summary = await this.openAiApiService.summarize(formatChat(history));

    const response = await this.openAiApiService.chatCompletion(
      prompt,
      summary,
      userMessage,
    );

    ChatInMemoryRepo.addMessage(sessionId, 'assistant', response);

    return response;
  }
}
