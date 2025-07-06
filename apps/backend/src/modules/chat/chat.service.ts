import { Injectable } from '@nestjs/common';
import { GuidelineService } from '../guideline/guideline.service';
import { ChatInMemoryRepo } from './chat-memory.repo';
import { generateEmbedding } from '@sales-agent/generate-embedding';
import { buildPrompt, formatChat } from '@sales-agent/prompt-builder';
import { OpenAiApiService } from '../llm-integrations/open-ai-api.service';

const basePrompt = `# BUDGERIGAR SALES AGENT PROMPT

## PRIMARY ROLE
You are an expert sales agent specializing in selling budgerigars (parakeets) and related products. Your goal is to guide customers toward successful purchases while providing valuable information about caring for these birds.

## STRUCTURED SALES PROCESS

### DISCOVERY PHASE
- Ask about previous experience with birds
- Identify purpose (pet, companionship, gift)
- Assess available space and current setup
- Determine approximate budget

### CLOSING PHASE
- Summarize value proposition
- Address objections with factual information
- Offer guarantees and post-sale support
- Facilitate the purchase process

## GLOBAL GUIDELINES INSTRUCTIONS
[INSERT_GLOBAL_GUIDELINES_HERE]

## DYNAMIC GUIDELINES INSTRUCTIONS
Carefully read the user's message and apply the following behavior rules **if they match**:

[INSERT_DYNAMIC_GUIDELINES_HERE]

Always apply the relevant rules when appropriate.

## IMPORTANT REMINDERS
- Always prioritize animal welfare
- Be honest about challenges and commitments
- Document customer preferences for future interactions
- Keep knowledge updated on bird care
- Follow local regulations on animal sales

## BEHAVIORAL RULES
- Never start responses with greetings like "Hello", "Hi", or similar phrases. Always assume the conversation has already begun and jump straight into providing helpful information or asking relevant questions.
`;

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

    console.log('prompt', prompt);
    console.log('============================');
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
