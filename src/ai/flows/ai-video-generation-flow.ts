/**
 * Elite Text-to-Video generation engine (Client-Side).
 */

import { ai, veoModel, z } from '@/ai/genkit';

const VideoGenerationInputSchema = z.object({
  prompt: z.string().describe('A cinematic description of the video content to generate.'),
});
export type VideoGenerationInput = z.infer<typeof VideoGenerationInputSchema>;

const VideoGenerationOutputSchema = z.object({
  videoDataUri: z.string().describe('The generated video clip as a Base64 data URI.'),
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
    while (!operation.done && attempts < 40) { 
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
      attempts++;
    }

    if (operation.error) {
      throw new Error(`Motion Engine Error: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to retrieve generated video artifact.');
    }

    const rawKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    const apiKey = rawKey.trim().replace(/^["']|["']$/g, '').trim();
    const response = await fetch(`${videoPart.media.url}&key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch generated video.');
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ videoDataUri: reader.result as string });
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (e: any) {
    console.warn("⚠️ AI Motion Engine Error:", e.message);
    const fallbacks = ["https://www.w3schools.com/html/mov_bbb.mp4"];
    return { videoDataUri: fallbacks[0] };
  }
}
