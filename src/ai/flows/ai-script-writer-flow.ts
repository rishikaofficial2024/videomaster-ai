'use server';
/**
 * @fileOverview A Genkit flow for generating professional video scripts.
 *
 * - generateAiScript - Function to generate scripts based on topic and platform.
 */

import { ai, z } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';

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
    const { output } = await ai.generate({
      model: googleAI.model('gemini-flash-latest'),
      prompt: `You are a world-class social media content strategist and script writer. 
      Create a viral-ready script for ${input.platform} about "${input.topic}". 
      Tone: ${input.tone || 'energetic and engaging'}.
      Format the output to include clear Scene Descriptions and Narration/Dialogue.`,
      output: { schema: ScriptWriterOutputSchema },
    });
    return output!;
  }
);
