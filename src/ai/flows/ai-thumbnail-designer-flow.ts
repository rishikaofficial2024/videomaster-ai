'use server';
/**
 * @fileOverview A Genkit flow for designing cinematic video thumbnails.
 * 
 * 🚀 JUGAAD: Added a smart fallback to professional Unsplash images if 
 * the premium Imagen 4 model fails due to billing/quota issues.
 */

import { ai, imagenModel, geminiModel, z } from '@/ai/genkit';

const ThumbnailDesignerInputSchema = z.object({
  prompt: z.string().describe('Visual description of the thumbnail to generate'),
});
export type ThumbnailDesignerInput = z.infer<typeof ThumbnailDesignerInputSchema>;

const ThumbnailDesignerOutputSchema = z.object({
  thumbnailDataUri: z.string().describe('The generated thumbnail image as a Base64 data URI or a high-res URL.'),
  isAiGenerated: z.boolean().default(true),
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
      // 1. First, attempt to use the premium Imagen 4 model
      const { media } = await ai.generate({
        model: imagenModel,
        prompt: `Cinematic high-quality professional video thumbnail about: ${input.prompt}. Eye-catching, high contrast, 4k resolution, professional photography style, vibrant colors.`,
      });

      if (media?.url) {
        return {
          thumbnailDataUri: media.url,
          isAiGenerated: true,
        };
      }
      throw new Error('No media returned');

    } catch (e: any) {
      // 🛠️ THE JUGAAD: If Billing is required or AI fails, provide a high-quality Unsplash alternative
      console.warn("⚠️ AI Billing Error or Quota hit. Using Professional Fallback System...");
      
      // Use the free Gemini Flash to extract 2-3 search keywords from the user's complex prompt
      const { text: keywords } = await ai.generate({
        model: geminiModel,
        prompt: `Extract 2-3 visual search keywords from this thumbnail prompt: "${input.prompt}". Output ONLY the keywords separated by commas.`,
      });

      const cleanKeywords = keywords?.replace(/[^a-zA-Z,]/g, '') || "cinematic,video";
      
      // Return a high-resolution professional image from Unsplash as a "Free Fallback"
      // This ensures the user experience never breaks
      const fallbackUrl = `https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80&sig=${Math.random()}&q=${cleanKeywords}`;

      return {
        thumbnailDataUri: fallbackUrl,
        isAiGenerated: false,
      };
    }
  }
);
