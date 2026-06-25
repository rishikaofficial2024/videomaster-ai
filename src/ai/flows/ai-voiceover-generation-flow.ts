/**
 * @fileOverview An AI agent that generates professional voiceovers.
 */

import { ai, z, ttsModel } from '@/ai/genkit';

const VoiceoverInputSchema = z.object({
  text: z.string().describe('The text script to convert to speech.'),
  voiceName: z.enum(['Algenib', 'Achernar', 'Sirius']).default('Algenib'),
  language: z.enum(['en', 'hi']).default('en'),
});
export type VoiceoverInput = z.infer<typeof VoiceoverInputSchema>;

const VoiceoverOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a Base64 data URI.'),
});
export type VoiceoverOutput = z.infer<typeof VoiceoverOutputSchema>;

export async function generateAiVoiceover(input: VoiceoverInput): Promise<VoiceoverOutput> {
  try {
    const { media } = await ai.generate({
      model: ttsModel,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voiceName },
          },
        },
      },
      prompt: `Language: ${input.language}. Convert this text to a professional high-fidelity voiceover: ${input.text}`,
    });

    if (!media?.url) {
      throw new Error('No audio returned from AI.');
    }

    return {
      audioDataUri: media.url,
    };
  } catch (error: any) {
    console.error("Audio Generation Error:", error.message);
    throw error;
  }
}
