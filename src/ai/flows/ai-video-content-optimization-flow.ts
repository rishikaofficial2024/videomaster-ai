/**
 * @fileOverview AI agent that suggests optimized hashtags, titles, and descriptions.
 * 
 * ✅ TRANSFORMED: Converted to Client-Side utility.
 */

import { ai, z } from '@/ai/genkit';

const AiVideoContentOptimizationInputSchema = z.object({
  videoTranscript: z.string().describe('The transcript of the video content.'),
});
export type AiVideoContentOptimizationInput = z.infer<typeof AiVideoContentOptimizationInputSchema>;

const AiVideoContentOptimizationOutputSchema = z.object({
  hashtags: z.array(z.string()).describe('A list of optimized hashtags.'),
  title: z.string().describe('A compelling title.'),
  description: z.string().describe('An engaging description.'),
});
export type AiVideoContentOptimizationOutput = z.infer<typeof AiVideoContentOptimizationOutputSchema>;

export async function aiVideoContentOptimization(
  input: AiVideoContentOptimizationInput
): Promise<AiVideoContentOptimizationOutput> {
  const { output } = await ai.generate({
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `Analyze this transcript and provide optimized SEO metadata:
    
    ${input.videoTranscript}`,
    output: { schema: AiVideoContentOptimizationOutputSchema }
  });

  if (!output) throw new Error("Optimization failed.");
  return output;
}
