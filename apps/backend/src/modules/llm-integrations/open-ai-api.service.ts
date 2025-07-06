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
    if (!history || history.length === 0) {
      return 'No message to summarize.';
    }

    const res = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that summarizes conversations. Provide a concise summary of the key points and outcomes from the conversation.',
        },
        {
          role: 'user',
          content: `Please summarize this conversation:\n\n${message}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    return res.choices[0].message.content || 'Unable to generate summary.';
  }

  async chatCompletion(prompt: string, userInput: string): Promise<string> {
    const res = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userInput },
      ],
    });

    return res.choices[0].message.content || 'Unable to response.';
  }
}
