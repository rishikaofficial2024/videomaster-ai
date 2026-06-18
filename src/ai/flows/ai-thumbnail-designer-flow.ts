'use server';
/**
 * @fileOverview A Genkit flow for designing cinematic video thumbnails using Imagen 4.
 *
 * - generateAiThumbnail - Function to create thumbnail images from text descriptions.
 */

import { ai, z } from '@/ai/genkit';

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
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Cinematic high-quality professional video thumbnail about: ${input.prompt}. Eye-catching, high contrast, 4k resolution, professional photography style, vibrant colors.`,
    });

    if (!media?.url) {
      throw new Error('AI generated the response but no image was returned. Check your API quota or safety filters.');
    }

    return {
      thumbnailDataUri: media.url,
    };
  }
);
