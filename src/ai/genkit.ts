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
  // Standard keys start with AIzaSy... but we allow others if provided
  return rawKey.trim().replace(/^["']|["']$/g, '').trim();
};

const apiKey = getApiKey();

// Masked logging for debugging in the console
if (!apiKey || apiKey.includes('PASTE_YOUR')) {
  console.error("❌ AI ERROR: GEMINI_API_KEY is missing or invalid in .env file.");
} else {
  // If key doesn't start with AIzaSy, it might be a different token type or mis-copied
  if (!apiKey.startsWith('AIzaSy')) {
    console.warn(`⚠️ AI WARNING: Your key starts with '${apiKey.substring(0, 3)}'. Standard Gemini keys usually start with 'AIzaSy'. If AI features fail, please re-check Google AI Studio.`);
  }
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
