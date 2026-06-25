import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Gemini Fast AI Initialization for VideoMaster.
 * 
 * ✅ Optimized for Gemini 1.5 Flash Latest Aliases (v1.29+).
 * 🛠️ SANITIZATION: Robust API Key parsing.
 */

const rawKey = process.env.GEMINI_API_KEY || '';
const apiKey = rawKey.trim().replace(/^["']|["']$/g, '').trim();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});

// 🚀 GEMINI STABLE MODELS: Using recommended production aliases
export const geminiModel = googleAI.model('gemini-1.5-flash-latest');
export const geminiProModel = googleAI.model('gemini-1.5-pro-latest');

// 🎨 VISUAL ENGINES: High-speed generation
export const imagenModel = googleAI.model('googleai/imagen-4.0-fast-generate-001');
export const veoModel = googleAI.model('googleai/veo-3.0-generate-preview');

// 🎙️ AUDIO ENGINES
export const ttsModel = googleAI.model('googleai/gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
