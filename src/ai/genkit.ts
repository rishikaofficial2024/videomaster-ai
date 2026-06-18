import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for VideoMaster AI.
 * 
 * This reads the GEMINI_API_KEY from the .env file.
 * Includes cleaning logic to handle potential formatting issues.
 */
const rawKey = process.env.GEMINI_API_KEY || '';
const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');

// Developer Logging for Connection Verification
if (!apiKey) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing in your .env file.");
} else {
  console.log("✅ AI SERVICE: Gemini API Key loaded and initialized.");
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
