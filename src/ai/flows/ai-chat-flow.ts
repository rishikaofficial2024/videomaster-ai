'use server';
/**
 * @fileOverview A free-tier Genkit AI chat assistant for general creative help.
 */

import { ai, geminiModel, z } from '@/ai/genkit';

const AiChatInputSchema = z.object({
  message: z.string().describe('The user message or query'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string(),
  })).optional().describe('Chat history for context'),
});
export type AiChatInput = z.infer<typeof AiChatInputSchema>;

const AiChatOutputSchema = z.object({
  response: z.string().describe('The AI generated response'),
});
export type AiChatOutput = z.infer<typeof AiChatOutputSchema>;

const aiChatFlow = ai.defineFlow(
  {
    name: 'aiChatFlow',
    inputSchema: AiChatInputSchema,
    outputSchema: AiChatOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      model: geminiModel,
      system: 'You are VideoMaster AI Assistant. You help Indian creators with video ideas, viral scripts, and social media tips. Keep your tone energetic and helpful. Always try to suggest how the user can make their video more viral.',
      prompt: input.message,
      // Pass history if needed, but for MVP we use single prompt
    });

    return { response: text || "Bhaai, AI server thoda busy hai, dobara try karein!" };
  }
);

export async function sendAiChatMessage(input: AiChatInput): Promise<AiChatOutput> {
  return aiChatFlow(input);
}
