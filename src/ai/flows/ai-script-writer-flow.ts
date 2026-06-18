'use server';
/**
 * @fileOverview A robust Genkit flow for generating professional video scripts with auto-retry logic.
 */

import { ai, geminiModel, z } from '@/ai/genkit';

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

export async function generateAiScript(input: ScriptWriterInput): Promise<ScriptWriterOutput> {
  return scriptWriterFlow(input);
}

const scriptWriterFlow = ai.defineFlow(
  {
    name: 'scriptWriterFlow',
    inputSchema: ScriptWriterInputSchema,
    outputSchema: ScriptWriterOutputSchema,
  },
  async (input) => {
    // STABILITY PATCH: 3-Stage Auto-Retry for 503 Server Busy errors
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const { output } = await ai.generate({
          model: geminiModel,
          prompt: `You are a world-class viral video strategist. Create a script for ${input.platform} about "${input.topic}". 
          Tone: ${input.tone || 'energetic'}. Include a killer hook.`,
          output: { schema: ScriptWriterOutputSchema },
        });
        
        if (!output) throw new Error('AI returned an empty response.');
        return output;
      } catch (e: any) {
        attempts++;
        console.warn(`AI Attempt ${attempts} failed: ${e.message}`);
        if (attempts === maxAttempts || !e.message.includes('503')) throw e;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    throw new Error('AI Servers are currently overloaded. Please try again in 1 minute.');
  }
);