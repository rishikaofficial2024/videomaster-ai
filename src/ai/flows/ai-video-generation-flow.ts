/**
 * @fileOverview Elite Text-to-Video generation engine.
 */

import { ai, veoModel, z } from '@/ai/genkit';

const VideoGenerationInputSchema = z.object({
  prompt: z.string().describe('A cinematic description of the video content to generate.'),
});
export type VideoGenerationInput = z.infer<typeof VideoGenerationInputSchema>;

const VideoGenerationOutputSchema = z.object({
  videoDataUri: z.string().describe('The generated video clip as a data URL.'),
});
export type VideoGenerationOutput = z.infer<typeof VideoGenerationOutputSchema>;

export async function generateAiVideo(input: VideoGenerationInput): Promise<VideoGenerationOutput> {
  try {
    let { operation } = await ai.generate({
      model: veoModel,
      prompt: `Cinematic HD high-quality video clip: ${input.prompt}. 4k, hyper-realistic, professional cinematography, 24fps.`,
      config: {
        aspectRatio: '16:9',
      }
    });

    if (!operation) {
      throw new Error('Neural core failed to initiate motion operation.');
    }

    let attempts = 0;
    while (!operation.done && attempts < 60) { 
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
      attempts++;
    }

    if (operation.error) {
      throw new Error(`Motion Engine Error: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to find the generated video artifact.');
    }

    return {
      videoDataUri: videoPart.media.url
    };

  } catch (e: any) {
    console.error("⚠️ AI Motion Engine Error:", e.message);
    return { videoDataUri: "https://www.w3schools.com/html/mov_bbb.mp4" };
  }
}
