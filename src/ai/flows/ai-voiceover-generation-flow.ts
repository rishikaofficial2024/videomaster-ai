
'use server';
/**
 * @fileOverview An AI agent that generates professional voiceovers from text scripts using Gemini TTS.
 *
 * - generateAiVoiceover - A function that handles the voiceover generation process.
 * - VoiceoverInput - The input type for the function.
 * - VoiceoverOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const VoiceoverInputSchema = z.object({
  text: z.string().describe('The text script to be converted to speech.'),
  voiceName: z.enum(['Algenib', 'Achernar', 'Sirius']).default('Algenib').describe('The voice style to use.'),
});
export type VoiceoverInput = z.infer<typeof VoiceoverInputSchema>;

const VoiceoverOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a Base64 data URI (WAV).'),
});
export type VoiceoverOutput = z.infer<typeof VoiceoverOutputSchema>;

export async function generateAiVoiceover(input: VoiceoverInput): Promise<VoiceoverOutput> {
  return voiceoverFlow(input);
}

const voiceoverFlow = ai.defineFlow(
  {
    name: 'voiceoverFlow',
    inputSchema: VoiceoverInputSchema,
    outputSchema: VoiceoverOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
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
      throw new Error('No audio media returned from AI.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
