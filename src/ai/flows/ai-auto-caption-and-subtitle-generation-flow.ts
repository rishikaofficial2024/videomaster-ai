'use server';
/**
 * @fileOverview A Genkit flow for automatically generating captions and subtitles (Server-Side Action).
 */

import { ai, geminiModel, z } from '@/ai/genkit';

const AutoCaptionAndSubtitleInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio content of a video, as a data URI."
    ),
});
export type AutoCaptionAndSubtitleInput = z.infer<typeof AutoCaptionAndSubtitleInputSchema>;

const AutoCaptionAndSubtitleOutputSchema = z.object({
  subtitles: z.string().describe('The generated captions/subtitles in WebVTT format.'),
});
export type AutoCaptionAndSubtitleOutput = z.infer<typeof AutoCaptionAndSubtitleOutputSchema>;

export async function generateAutoCaptionsAndSubtitles(
  input: AutoCaptionAndSubtitleInput
): Promise<AutoCaptionAndSubtitleOutput> {
  const { output } = await ai.generate({
    model: geminiModel,
    prompt: [
      { text: `You are an expert transcriber. Transcribe this audio into WebVTT format.` },
      { media: { url: input.audioDataUri } }
    ],
    output: { schema: AutoCaptionAndSubtitleOutputSchema },
  });

  if (!output) {
    throw new Error('Failed to generate captions.');
  }
  return output;
}
