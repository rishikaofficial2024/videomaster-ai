
'use server';
/**
 * @fileOverview An AI agent that generates cinematic video clips from text prompts using Veo.
 * 
 * - generateAiVideo - A function that handles the video generation process.
 * - VideoGenerationInput - The input type for the function.
 * - VideoGenerationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const VideoGenerationInputSchema = z.object({
  prompt: z.string().describe('The descriptive prompt for the video generation.'),
});
export type VideoGenerationInput = z.infer<typeof VideoGenerationInputSchema>;

const VideoGenerationOutputSchema = z.object({
  videoDataUri: z.string().describe('The generated video content as a Base64 data URI.'),
});
export type VideoGenerationOutput = z.infer<typeof VideoGenerationOutputSchema>;

export async function generateAiVideo(input: VideoGenerationInput): Promise<VideoGenerationOutput> {
  return videoGenerationFlow(input);
}

const videoGenerationFlow = ai.defineFlow(
  {
    name: 'videoGenerationFlow',
    inputSchema: VideoGenerationInputSchema,
    outputSchema: VideoGenerationOutputSchema,
  },
  async (input) => {
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: input.prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Failed to initiate video generation.');
    }

    // Wait for completion (Veo is a long-running process)
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      if (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    if (operation.error) {
      throw new Error('Video generation failed: ' + operation.error.message);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart?.media?.url) {
      throw new Error('No video output generated.');
    }

    // Download and convert to base64 for the client
    const response = await fetch(`${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`);
    if (!response.ok) throw new Error('Failed to download generated video.');
    
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return {
      videoDataUri: `data:video/mp4;base64,${base64}`,
    };
  }
);
