import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * 🧠 Genkit AI Initialization (Server-Side Optimized).
 * Mark as server-side to ensure it doesn't get bundled into the client.
 */

const getApiKey = () => {
  // On the server, we can access environment variables directly.
  const rawKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  return rawKey.trim().replace(/^["']|["']$/g, '').trim();
};

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: getApiKey(),
    }),
  ],
});

// 🚀 PRODUCTION READY MODELS
export const geminiModel = googleAI.model('googleai/gemini-1.5-flash-latest');
export const geminiProModel = googleAI.model('googleai/gemini-1.5-pro-latest');

// 🎨 VISUAL ENGINES
export const imagenModel = googleAI.model('googleai/imagen-4.0-fast-generate-001');
export const veoModel = googleAI.model('googleai/veo-3.0-generate-preview');

// 🎙️ AUDIO ENGINES
export const ttsModel = googleAI.model('googleai/gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
