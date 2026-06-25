/**
 * Professional video script writer (Client-Side).
 */

import { ai, geminiModel, z } from '@/ai/genkit';

const ScriptWriterInputSchema = z.object({
  topic: z.string().describe('The main topic or subject of the video'),
  platform: z.enum(['YouTube', 'TikTok', 'Instagram', 'LinkedIn']).describe('Target platform'),
  tone: z.string().optional().describe('Tone of the script'),
});
export type ScriptWriterInput = z.infer<typeof ScriptWriterInputSchema>;

const ScriptWriterOutputSchema = z.object({
  script: z.string().describe('The generated script'),
  suggestedDuration: z.string().describe('Recommended length'),
  hook: z.string().describe('Opening hook'),
});
export type ScriptWriterOutput = z.infer<typeof ScriptWriterOutputSchema>;

export async function generateAiScript(input: ScriptWriterInput): Promise<ScriptWriterOutput> {
  const { output } = await ai.generate({
    model: geminiModel,
    prompt: `Create a viral script for ${input.platform} about "${input.topic}". Tone: ${input.tone || 'energetic'}.`,
    output: { schema: ScriptWriterOutputSchema },
  });
  
  if (!output) throw new Error('AI returned an empty response.');
  return output;
}
