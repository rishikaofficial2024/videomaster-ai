import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for VideoMaster AI.
 * 
 * This reads the GEMINI_API_KEY from the .env file.
 * We use a very robust cleaning logic to ensure copy-paste errors 
 * (like extra spaces or quotes) don't break the connection.
 */
const getApiKey = () => {
  const rawKey = process.env.GEMINI_API_KEY || '';
  // Remove spaces, quotes, and any hidden characters that might cause 401 errors
  return rawKey.trim().replace(/^["']|["']$/g, '').trim();
};

const apiKey = getApiKey();

// Masked logging for debugging in the console
if (!apiKey) {
  console.error("❌ AI ERROR: GEMINI_API_KEY is missing from .env file.");
} else {
  console.log(`✅ AI SERVICE: Key detected (Starts with: ${apiKey.substring(0, 6)}...)`);
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
