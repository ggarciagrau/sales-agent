import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiApiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async summarize(message: string): Promise<string> {
    if (!message || message.length === 0) {
      return 'No message to summarize.';
    }

    const res = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a system that summarizes customer interactions with a budgerigar sales agent. Provide a concise summary of the customer's intent, concerns, and previous decisions. Focus on what's relevant to continue the sales process effectively.`,
        },
        {
          role: 'user',
          content: `Please summarize this conversation:\n\n${message}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    return res.choices[0].message.content || 'Unable to generate summary.';
  }

  async chatCompletion(
    prompt: string,
    summary: string,
    userInput: string,
  ): Promise<string> {
    const res = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: prompt },
        {
          role: 'assistant',
          content: `Here is a summary of the conversation so far: ${summary}`,
        },
        { role: 'user', content: userInput },
      ],
    });

    return res.choices[0].message.content || 'Unable to response.';
  }
}
