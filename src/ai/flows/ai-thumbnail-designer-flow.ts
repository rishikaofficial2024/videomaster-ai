/**
 * @fileOverview Cinematic video thumbnail designer.
 */

import { ai, imagenModel, z } from '@/ai/genkit';

const ThumbnailDesignerInputSchema = z.object({
  prompt: z.string().describe('Visual description of the thumbnail to generate'),
});
export type ThumbnailDesignerInput = z.infer<typeof ThumbnailDesignerInputSchema>;

const ThumbnailDesignerOutputSchema = z.object({
  thumbnailDataUri: z.string().describe('The generated thumbnail image.'),
  isAiGenerated: z.boolean().default(true),
});
export type ThumbnailDesignerOutput = z.infer<typeof ThumbnailDesignerOutputSchema>;

export async function generateAiThumbnail(input: ThumbnailDesignerInput): Promise<ThumbnailDesignerOutput> {
  try {
    const { media } = await ai.generate({
      model: imagenModel,
      prompt: `Cinematic professional video thumbnail: ${input.prompt}. 4k resolution, professional photography.`,
      config: {
        responseModalities: ['IMAGE']
      }
    });

    if (media?.url) {
      return { thumbnailDataUri: media.url, isAiGenerated: true };
    }
    throw new Error('No media generated.');

  } catch (e: any) {
    console.error("Thumbnail Generation Error:", e.message);
    const fallbackUrl = `https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80`;
    return { thumbnailDataUri: fallbackUrl, isAiGenerated: false };
  }
}
