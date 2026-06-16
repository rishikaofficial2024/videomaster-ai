
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for VideoMaster AI.
 * Uses the latest Gemini Flash alias for optimal performance and cost-efficiency.
 * 
 * IMPORTANT: This requires GEMINI_API_KEY to be set in your environment variables (.env).
 */
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: googleAI.model('gemini-flash-latest'),
});

export { z } from 'genkit';
