'use server';
/**
 * @fileOverview A Genkit flow for designing cinematic video thumbnails using Imagen.
 *
 * - generateAiThumbnail - Function to create thumbnail images from text descriptions.
 */

import { ai, z } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ThumbnailDesignerInputSchema = z.object({
  prompt: z.string().describe('Visual description of the thumbnail to generate'),
});
export type ThumbnailDesignerInput = z.infer<typeof ThumbnailDesignerInputSchema>;

const ThumbnailDesignerOutputSchema = z.object({
  thumbnailDataUri: z.string().describe('The generated thumbnail image as a Base64 data URI.'),
});
export type ThumbnailDesignerOutput = z.infer<typeof ThumbnailDesignerOutputSchema>;

export async function generateAiThumbnail(input: ThumbnailDesignerInput): Promise<ThumbnailDesignerOutput> {
  return thumbnailDesignerFlow(input);
}

const thumbnailDesignerFlow = ai.defineFlow(
  {
    name: 'thumbnailDesignerFlow',
    inputSchema: ThumbnailDesignerInputSchema,
    outputSchema: ThumbnailDesignerOutputSchema,
  },
  async (input) => {
    try {
      const { media } = await ai.generate({
        model: googleAI.model('imagen-3.0-fast-generate-001'),
        prompt: `Cinematic high-quality professional video thumbnail about: ${input.prompt}. Eye-catching, high contrast, 4k resolution, professional photography style.`,
      });

      if (!media?.url) {
        throw new Error('AI generated the response but no image was returned. Check your API quota.');
      }

      return {
        thumbnailDataUri: media.url,
      };
    } catch (error: any) {
      console.error('Thumbnail Generation Error:', error);
      throw new Error(error.message || 'Failed to generate thumbnail. Ensure your GEMINI_API_KEY is valid and has Imagen access.');
    }
  }
);
