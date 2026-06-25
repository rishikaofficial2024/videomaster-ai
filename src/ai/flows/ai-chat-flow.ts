/**
 * AI Growth Assistant (Client-Side).
 */

import { ai, geminiModel, z } from '@/ai/genkit';

const AiChatInputSchema = z.object({
  message: z.string().describe('The user message'),
  history: z.array(z.any()).optional(),
});
export type AiChatInput = z.infer<typeof AiChatInputSchema>;

const AiChatOutputSchema = z.object({
  response: z.string().describe('The generated response'),
});
export type AiChatOutput = z.infer<typeof AiChatOutputSchema>;

export async function sendAiChatMessage(input: AiChatInput): Promise<AiChatOutput> {
  const { text } = await ai.generate({
    model: geminiModel,
    system: "You are the VideoMaster AI Growth Strategist. Help creators grow viral channels.",
    prompt: input.message,
  });

  if (!text) throw new Error("Empty response from AI.");
  return { response: text };
}
