
'use server';
/**
 * @fileOverview An AI agent that generates cinematic video clips from text prompts using Veo.
 * 
 * 🚀 STABILITY PATCH: Professional English localization and error handling.
 */

import { ai, z } from '@/ai/genkit';

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
    try {
      let { operation } = await ai.generate({
        model: 'googleai/veo-2.0-generate-001',
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
        throw new Error(operation.error.message);
      }

      const videoPart = operation.output?.message?.content.find((p) => !!p.media);
      if (!videoPart?.media?.url) {
        throw new Error('No video output generated.');
      }

      const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '').trim();
      const response = await fetch(`${videoPart.media.url}&key=${apiKey}`);
      if (!response.ok) throw new Error('Failed to download generated video.');
      
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      return {
        videoDataUri: `data:video/mp4;base64,${base64}`,
      };
    } catch (e: any) {
      // Professional English Error Messaging
      if (e.message.includes('403') || e.message.includes('billing') || e.message.includes('permission')) {
        throw new Error("⚠️ Google Cloud Billing is required for video generation. [Fix]: Link a valid payment method in your Google Cloud Console.");
      }
      if (e.message.includes('429')) {
        throw new Error("⚠️ AI Rate Limit Reached. Please wait a few moments and try again.");
      }
      throw new Error(`AI Video Generation failed: ${e.message}`);
    }
  }
);
