import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for VideoMaster AI.
 * 
 * CRITICAL: This reads the GEMINI_API_KEY from your .env file.
 */
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ GEMINI_API_KEY is missing in your .env file. AI features will fail with a 400 error.");
} else if (!apiKey.startsWith("AIza")) {
  console.warn("⚠️ GEMINI_API_KEY format looks invalid. It should start with 'AIza'.");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
  model: googleAI.model('gemini-flash-latest'),
});

export { z } from 'genkit';
