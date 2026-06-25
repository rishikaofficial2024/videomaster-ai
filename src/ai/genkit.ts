import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Gemini Fast AI Initialization (Browser-Compatible).
 * 
 * ✅ STATUS: Optimized for Client-Side Static Export.
 */

// Safely retrieve API key from env or window context
const getApiKey = () => {
  if (typeof window === 'undefined') return '';
  const rawKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  return rawKey.trim().replace(/^["']|["']$/g, '').trim();
};

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: getApiKey(),
    }),
  ],
});

// 🚀 GEMINI STABLE MODELS
export const geminiModel = googleAI.model('gemini-1.5-flash-latest');
export const geminiProModel = googleAI.model('gemini-1.5-pro-latest');

// 🎨 VISUAL ENGINES
export const imagenModel = googleAI.model('googleai/imagen-4.0-fast-generate-001');
export const veoModel = googleAI.model('googleai/veo-3.0-generate-preview');

// 🎙️ AUDIO ENGINES
export const ttsModel = googleAI.model('googleai/gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
