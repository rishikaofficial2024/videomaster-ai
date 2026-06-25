/**
 * @fileOverview A Genkit flow for automatically generating captions and subtitles.
 * 
 * ✅ TRANSFORMED: Converted to Client-Side utility.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are an expert transcriber. Transcribe this audio into WebVTT format.
    
    {{media url=audioDataUri}}`,
    output: { schema: AutoCaptionAndSubtitleOutputSchema },
    // @ts-ignore
    input: input
  });

  if (!output) {
    throw new Error('Failed to generate captions.');
  }
  return output;
}
