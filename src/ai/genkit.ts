import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for VideoMaster AI.
 * 
 * CRITICAL: This reads the GEMINI_API_KEY from your .env file.
 */
const apiKey = process.env.GEMINI_API_KEY;

// Validation for Developer Logs
if (!apiKey) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in your .env file.");
} else if (!apiKey.startsWith("AIza")) {
  console.error("❌ INVALID KEY FORMAT: GEMINI_API_KEY should start with 'AIza'. Please check your key.");
} else {
  console.log("✅ AI SERVICE: Gemini API Key detected and loaded.");
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
