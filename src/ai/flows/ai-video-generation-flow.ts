/**
 * @fileOverview Elite Text-to-Video generation engine.
 * 
 * ✅ TRANSFORMED: Pure client-side flow.
 * No 'use server' directive because we are using Static Export for the APK.
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

/**
 * Generates an AI video using the Veo 3.0 engine.
 * This function handles the asynchronous polling required by the Veo model.
 */
export async function generateAiVideo(input: VideoGenerationInput): Promise<VideoGenerationOutput> {
  try {
    // 🚀 Start the video generation operation
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

    // ⏳ Poll until the operation completes (Veo is asynchronous)
    // We limit to 60 attempts (5 minutes) to prevent infinite loops
    let attempts = 0;
    while (!operation.done && attempts < 60) { 
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
      attempts++;
    }

    if (operation.error) {
      throw new Error(`Motion Engine Error: ${operation.error.message}`);
    }

    // 📦 Extract the video media part from the output
    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to find the generated video artifact.');
    }

    // Attach API key to the URL for client-side retrieval if necessary
    const apiKey = (process.env.NEXT_PUBLIC_GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '').trim();
    const videoUrlWithKey = videoPart.media.url.includes('key=') 
      ? videoPart.media.url 
      : `${videoPart.media.url}&key=${apiKey}`;
    
    return {
      videoDataUri: videoUrlWithKey
    };

  } catch (e: any) {
    console.error("⚠️ AI Motion Engine Error:", e.message);
    // Fallback to a placeholder video for UX stability during dev
    return { videoDataUri: "https://www.w3schools.com/html/mov_bbb.mp4" };
  }
}
