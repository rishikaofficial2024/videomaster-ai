/**
 * @fileOverview An AI agent that generates professional voiceovers.
 * 
 * ✅ TRANSFORMED: Converted to Client-Side utility.
 * 🛠️ FIX: Removed Node-only 'wav' dependency for browser compatibility.
 */

import { ai, z } from '@/ai/genkit';

const VoiceoverInputSchema = z.object({
  text: z.string().describe('The text script.'),
  voiceName: z.enum(['Algenib', 'Achernar', 'Sirius']).default('Algenib'),
});
export type VoiceoverInput = z.infer<typeof VoiceoverInputSchema>;

const VoiceoverOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a Base64 data URI.'),
});
export type VoiceoverOutput = z.infer<typeof VoiceoverOutputSchema>;

export async function generateAiVoiceover(input: VoiceoverInput): Promise<VoiceoverOutput> {
  const { media } = await ai.generate({
    model: 'googleai/gemini-2.5-flash-preview-tts',
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: input.voiceName },
        },
      },
    },
    prompt: input.text,
  });

  if (!media?.url) {
    throw new Error('No audio returned from AI.');
  }

  // In the browser, we can use the media.url directly as it's already a data URI or blob
  return {
    audioDataUri: media.url,
  };
}
