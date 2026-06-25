/**
 * AI Growth Assistant (Pure Client-Side).
 * Refactored to avoid server-side dependency injection.
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

/**
 * sendAiChatMessage - Client-side wrapper for Gemini interaction.
 */
export async function sendAiChatMessage(input: AiChatInput): Promise<AiChatOutput> {
  if (typeof window === 'undefined') return { response: "" };

  try {
    const { text } = await ai.generate({
      model: geminiModel,
      system: "You are the VideoMaster AI Growth Strategist. Help creators grow viral channels. Focus on SEO, hooks, and production quality.",
      prompt: input.message,
    });

    if (!text) throw new Error("Empty response from AI core.");
    return { response: text };
  } catch (error: any) {
    console.error("AI Node Error:", error.message);
    return { response: "Gemini Sync Interrupted. Please check your network connection and retry." };
  }
}
