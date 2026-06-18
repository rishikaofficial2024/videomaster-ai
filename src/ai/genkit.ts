import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for VideoMaster AI.
 * 
 * CRITICAL: This requires GEMINI_API_KEY to be set in your environment variables (.env).
 * Get your key from: https://aistudio.google.com/app/apikey
 * 
 * NOTE: Ensure the variable name in .env is exactly GEMINI_API_KEY.
 */
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
  console.warn("⚠️ GEMINI_API_KEY is missing or using placeholder in .env file. AI features will not work.");
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
