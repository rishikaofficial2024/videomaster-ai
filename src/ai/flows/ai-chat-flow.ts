/**
 * @fileOverview AI Growth Assistant.
 * ✅ Hardened: Returns a configuration error instead of crashing.
 */

import { ai, geminiModel, z, isAiEngineAuthorized } from '@/ai/genkit';

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
  // Defensive Check
  if (!isAiEngineAuthorized()) {
    return { 
      response: "⚠️ CONFIGURATION REQUIRED: Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables to enable the AI Growth Assistant." 
    };
  }

  try {
    const { text } = await ai.generate({
      model: geminiModel,
      system: "You are the VideoMaster AI Growth Strategist. Help creators build viral channels. Expert in SEO, storytelling, and high-retention editing techniques.",
      prompt: input.message,
    });

    if (!text) throw new Error("Empty response from AI core.");
    return { response: text };
  } catch (error: any) {
    console.error("AI Chat Error:", error.message);
    return { response: "I'm currently recalibrating my neural links. Please try again in a moment." };
  }
}
