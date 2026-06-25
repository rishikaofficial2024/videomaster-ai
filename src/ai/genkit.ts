import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * 🧠 Genkit AI Initialization.
 * Optimized for both Static and Dynamic environments.
 */

const getApiKey = () => {
  // Check for public key first (for static/client calls) then fall back to server env
  const rawKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  return rawKey.trim().replace(/^["']|["']$/g, '').trim();
};

const apiKey = getApiKey();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || 'dummy-key-for-initialization',
    }),
  ],
});

/**
 * 🛠️ CONFIG CHECK UTILITY
 */
export const isAiEngineAuthorized = () => {
  return !!apiKey && apiKey.length > 20;
};

// 🚀 MODELS
export const geminiModel = googleAI.model('googleai/gemini-1.5-flash-latest');
export const geminiProModel = googleAI.model('googleai/gemini-1.5-pro-latest');
export const imagenModel = googleAI.model('googleai/imagen-4.0-fast-generate-001');
export const veoModel = googleAI.model('googleai/veo-3.0-generate-preview');
export const ttsModel = googleAI.model('googleai/gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
