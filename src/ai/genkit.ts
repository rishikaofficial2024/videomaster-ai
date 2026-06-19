import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for VideoMaster AI.
 * 
 * We read the GEMINI_API_KEY from the environment and clean it.
 * Centralized instance ensures the API key is correctly applied.
 */

const rawKey = process.env.GEMINI_API_KEY || '';
const apiKey = rawKey.trim().replace(/^["']|["']$/g, '').trim();

if (!apiKey) {
  console.warn("⚠️ AI CONFIG WARNING: GEMINI_API_KEY is not set in .env file.");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});

// STABILITY FIX: Using 'gemini-flash-latest' alias to avoid 404 errors with versioned names
export const geminiModel = googleAI.model('gemini-flash-latest');
export const imagenModel = googleAI.model('imagen-3.0-generate-001');
export const veoModel = googleAI.model('veo-2.0-generate-001');
export const ttsModel = googleAI.model('gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
