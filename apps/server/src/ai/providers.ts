import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

export async function getStream(provider: string, model: string, apiKey: string, messages: {role: string; content: string}[]) {
//   if (provider === 'openai') {
//     const openai = createOpenAI({ apiKey });
//     return streamText({ model: openai(model), messages });
//   }
//   if (provider === 'anthropic') {
//     const anthropic = createAnthropic({ apiKey });
//     return streamText({ model: anthropic(model), messages });
//   }
//   throw new Error('Unsupported provider');
}