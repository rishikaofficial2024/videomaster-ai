/**
 * AI Growth Assistant (Pure Client-Side).
 * 🧠 Optimized for VideoMaster AI Strategy.
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
  if (typeof window === 'undefined') return { response: "" };

  try {
    const { text } = await ai.generate({
      model: geminiModel,
      system: "You are the VideoMaster AI Growth Strategist. Help creators build viral channels. Expert in SEO, storytelling, and high-retention editing techniques.",
      prompt: input.message,
    });

    if (!text) throw new Error("Empty response from AI core.");
    return { response: text };
  } catch (error: any) {
    return { response: "Gemini Sync Error. Please check your network connection and retry." };
  }
}
