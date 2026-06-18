'use server';
/**
 * @fileOverview A Genkit flow for generating professional video scripts.
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
    // Basic retry logic for 503/server busy errors
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const { output } = await ai.generate({
          model: geminiModel,
          prompt: `You are a world-class social media content strategist and script writer. 
          Create a viral-ready script for ${input.platform} about "${input.topic}". 
          Tone: ${input.tone || 'energetic and engaging'}.
          Format the output to include clear Scene Descriptions and Narration/Dialogue.`,
          output: { schema: ScriptWriterOutputSchema },
          config: {
            safetySettings: [
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            ]
          }
        });
        
        if (!output) {
          throw new Error('AI engine returned an empty response.');
        }
        
        return output;
      } catch (e: any) {
        attempts++;
        if (attempts === maxAttempts || !e.message.includes('503')) {
          throw e;
        }
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    throw new Error('Failed to generate script after multiple attempts due to high server demand.');
  }
);
