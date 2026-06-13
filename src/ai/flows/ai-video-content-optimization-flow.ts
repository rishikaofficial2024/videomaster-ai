'use server';
/**
 * @fileOverview An AI agent that analyzes video content to suggest optimized hashtags, titles, and descriptions.
 *
 * - aiVideoContentOptimization - A function that handles the video content optimization process.
 * - AiVideoContentOptimizationInput - The input type for the aiVideoContentOptimization function.
 * - AiVideoContentOptimizationOutput - The return type for the aiVideoContentOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiVideoContentOptimizationInputSchema = z.object({
  videoTranscript: z.string().describe('The transcript of the video content.'),
  videoUrl: z
    .string()
    .optional()
    .describe('The URL of the video content, if available.'),
});
export type AiVideoContentOptimizationInput = z.infer<
  typeof AiVideoContentOptimizationInputSchema
>;

const AiVideoContentOptimizationOutputSchema = z.object({
  hashtags: z.array(z.string()).describe('A list of optimized hashtags for the video.'),
  title: z.string().describe('A compelling title for the video.'),
  description: z.string().describe('An engaging description for the video.'),
});
export type AiVideoContentOptimizationOutput = z.infer<
  typeof AiVideoContentOptimizationOutputSchema
>;

const aiVideoContentOptimizationPrompt = ai.definePrompt({
  name: 'aiVideoContentOptimizationPrompt',
  input: {schema: AiVideoContentOptimizationInputSchema},
  output: {schema: AiVideoContentOptimizationOutputSchema},
  prompt: `You are an expert video content optimizer for social media platforms.
Your task is to analyze the provided video transcript and generate optimized hashtags, a compelling title, and an engaging description to maximize its discoverability and appeal.

Focus on:
- Identifying key themes and topics from the transcript.
- Using relevant keywords for SEO.
- Creating a title that grabs attention.
- Crafting a description that provides context and encourages engagement.
- Suggesting a variety of relevant hashtags.

Video Transcript:
{{{videoTranscript}}}`,
});

const aiVideoContentOptimizationFlow = ai.defineFlow(
  {
    name: 'aiVideoContentOptimizationFlow',
    inputSchema: AiVideoContentOptimizationInputSchema,
    outputSchema: AiVideoContentOptimizationOutputSchema,
  },
  async (input) => {
    const {output} = await aiVideoContentOptimizationPrompt(input);
    return output!;
  }
);

export async function aiVideoContentOptimization(
  input: AiVideoContentOptimizationInput
): Promise<AiVideoContentOptimizationOutput> {
  return aiVideoContentOptimizationFlow(input);
}
