import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for VideoMaster AI.
 * 
 * This reads the GEMINI_API_KEY from the environment.
 * We use a single centralized instance to ensure the API key is 
 * correctly applied to all AI operations.
 */
const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '').trim();

if (!apiKey) {
  console.warn("⚠️ AI WARNING: GEMINI_API_KEY is missing in environment variables.");
} else {
  console.log(`✅ AI SERVICE: Configured with key starting with ${apiKey.substring(0, 6)}...`);
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
  // Default configuration for all model calls
  model: 'googleai/gemini-flash-latest',
});

export { z } from 'genkit';
