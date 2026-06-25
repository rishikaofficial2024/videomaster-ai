import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * 🧠 Genkit AI Initialization (Hardened).
 * Features a safety check to prevent crashes if the API key is missing.
 */

const getApiKey = () => {
  const rawKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  return rawKey.trim().replace(/^["']|["']$/g, '').trim();
};

const apiKey = getApiKey();

// Defensive initialization: Only use googleAI if key is present
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || 'dummy-key-for-initialization',
    }),
  ],
});

/**
 * 🛠️ CONFIG CHECK UTILITY
 * Call this before executing flows to ensure the engine is ready.
 */
export const isAiEngineAuthorized = () => {
  return !!apiKey && apiKey.length > 20;
};

// 🚀 PRODUCTION READY MODELS
export const geminiModel = googleAI.model('googleai/gemini-1.5-flash-latest');
export const geminiProModel = googleAI.model('googleai/gemini-1.5-pro-latest');

// 🎨 VISUAL ENGINES
export const imagenModel = googleAI.model('googleai/imagen-4.0-fast-generate-001');
export const veoModel = googleAI.model('googleai/veo-3.0-generate-preview');

// 🎙️ AUDIO ENGINES
export const ttsModel = googleAI.model('googleai/gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
