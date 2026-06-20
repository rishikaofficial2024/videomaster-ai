
'use server';
/**
 * @fileOverview A professional Genkit AI chat assistant for creative guidance.
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
      system: 'You are the VideoMaster AI Assistant. You help content creators with viral video ideas, high-conversion scripts, and social media growth strategies. Maintain a professional, energetic, and highly encouraging tone. Always aim to provide actionable tips for virality.',
      prompt: input.message,
    });

    return { response: text || "I'm sorry, my neural core is temporarily busy. Please try asking again in a moment!" };
  }
);

export async function sendAiChatMessage(input: AiChatInput): Promise<AiChatOutput> {
  return aiChatFlow(input);
}
