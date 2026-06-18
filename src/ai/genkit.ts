import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for VideoMaster AI.
 * 
 * CRITICAL: This reads the GEMINI_API_KEY from your .env file.
 * We add cleaning logic to handle accidental spaces or quotes from copy-paste.
 */
const rawKey = process.env.GEMINI_API_KEY || '';
const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');

// Validation for Developer Logs
if (!apiKey) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in your .env file.");
} else if (!apiKey.startsWith("AIza")) {
  console.error("❌ INVALID KEY FORMAT: GEMINI_API_KEY should start with 'AIza'. Your key starts with: " + apiKey.substring(0, 4));
} else {
  console.log("✅ AI SERVICE: Gemini API Key detected and cleaned for use.");
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
