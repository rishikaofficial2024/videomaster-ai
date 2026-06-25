'use server';
/**
 * @fileOverview AI Growth Assistant.
 * ✅ CONVERTED TO SERVER ACTION.
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
  return aiChatFlow(input);
}

const aiChatFlow = ai.defineFlow(
  {
    name: 'aiChatFlow',
    inputSchema: AiChatInputSchema,
    outputSchema: AiChatOutputSchema,
  },
  async (input) => {
    if (!isAiEngineAuthorized()) {
      return { 
        response: "⚠️ CONFIGURATION REQUIRED: Please set GEMINI_API_KEY in your environment variables." 
      };
    }

    try {
      const { text } = await ai.generate({
        model: geminiModel,
        system: "You are the VideoMaster AI Growth Strategist. Expert in viral storytelling.",
        prompt: input.message,
      });

      if (!text) throw new Error("Empty response from AI core.");
      return { response: text };
    } catch (error: any) {
      console.error("AI Chat Error:", error.message);
      return { response: "My neural links are temporarily unstable. Please try again." };
    }
  }
);
