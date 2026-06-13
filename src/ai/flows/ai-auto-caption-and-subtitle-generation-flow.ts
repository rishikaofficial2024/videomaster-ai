'use server';
/**
 * @fileOverview A Genkit flow for automatically generating captions and subtitles from video audio.
 *
 * - generateAutoCaptionsAndSubtitles - A function that handles the caption/subtitle generation process.
 * - AutoCaptionAndSubtitleInput - The input type for the generateAutoCaptionsAndSubtitles function.
 * - AutoCaptionAndSubtitleOutput - The return type for the generateAutoCaptionsAndSubtitles function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AutoCaptionAndSubtitleInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio content of a video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AutoCaptionAndSubtitleInput = z.infer<typeof AutoCaptionAndSubtitleInputSchema>;

const AutoCaptionAndSubtitleOutputSchema = z.object({
  subtitles: z.string().describe('The generated captions/subtitles in WebVTT format.'),
});
export type AutoCaptionAndSubtitleOutput = z.infer<typeof AutoCaptionAndSubtitleOutputSchema>;

const captionPrompt = ai.definePrompt({
  name: 'autoCaptionAndSubtitlePrompt',
  input: { schema: AutoCaptionAndSubtitleInputSchema },
  output: { schema: AutoCaptionAndSubtitleOutputSchema },
  prompt: `You are an expert transcriber and subtitle generator.
You will receive audio content from a video. Your task is to accurately transcribe the audio and format it into WebVTT subtitle format.
Ensure that the timestamps are precise and the text accurately reflects the spoken words.
The output should only contain the WebVTT content, nothing else.

WEBVTT

{{media url=audioDataUri}}`,
});

const generateAutoCaptionsAndSubtitlesFlow = ai.defineFlow(
  {
    name: 'generateAutoCaptionsAndSubtitlesFlow',
    inputSchema: AutoCaptionAndSubtitleInputSchema,
    outputSchema: AutoCaptionAndSubtitleOutputSchema,
  },
  async (input) => {
    const { output } = await captionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate captions/subtitles.');
    }
    return output;
  }
);

export async function generateAutoCaptionsAndSubtitles(
  input: AutoCaptionAndSubtitleInput
): Promise<AutoCaptionAndSubtitleOutput> {
  return generateAutoCaptionsAndSubtitlesFlow(input);
}
