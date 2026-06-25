'use server';
/**
 * @fileOverview A robust Genkit flow for generating professional video scripts.
 */

import { ai, geminiModel, geminiProModel, z } from '@/ai/genkit';

const ScriptWriterInputSchema = z.object({
  topic: z.string().describe('The main topic or subject of the video'),
  platform: z.enum(['YouTube', 'TikTok', 'Instagram', 'LinkedIn']).describe('Target platform'),
  tone: z.string().optional().describe('Tone of the script (e.g., professional, funny, energetic)'),
});
export type ScriptWriterInput = z.infer<typeof ScriptWriterInputSchema>;

const ScriptWriterOutputSchema = z.object({
  script: z.string().describe('The generated script with scene descriptions and narration'),
  suggestedDuration: z.string().describe('Recommended length of the video'),
  hook: z.string().describe('A powerful opening hook to grab attention'),
});
export type ScriptWriterOutput = z.infer<typeof ScriptWriterOutputSchema>;

const scriptWriterFlow = ai.defineFlow(
  {
    name: 'scriptWriterFlow',
    inputSchema: ScriptWriterInputSchema,
    outputSchema: ScriptWriterOutputSchema,
  },
  async (input) => {
    // 5-Stage Auto-Retry with Exponential Backoff for stability
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        const activeModel = attempts < 3 ? geminiModel : geminiProModel;
        
        const { output } = await ai.generate({
          model: activeModel,
          prompt: `You are a world-class viral video strategist. Create a script for ${input.platform} about "${input.topic}". 
          Tone: ${input.tone || 'energetic'}. Include a killer hook and professional scene descriptions.`,
          output: { schema: ScriptWriterOutputSchema },
        });
        
        if (!output) throw new Error('AI returned an empty response.');
        return output;
      } catch (e: any) {
        attempts++;
        const delay = Math.pow(2, attempts) * 1000;
        console.warn(`AI Attempt ${attempts} failed: ${e.message}. Retrying...`);
        
        const isRetryable = e.message.includes('503') || e.message.includes('429') || e.message.includes('UNAVAILABLE');
        if (attempts === maxAttempts || !isRetryable) throw e;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('AI Servers busy. Please retry in 1 minute.');
  }
);

export async function generateAiScript(input: ScriptWriterInput): Promise<ScriptWriterOutput> {
  return scriptWriterFlow(input);
}
