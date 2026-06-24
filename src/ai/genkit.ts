import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Gemini Fast AI Initialization for VideoMaster.
 * 
 * ✅ Optimized for Gemini Flash Latest Aliases.
 */

// Safely extract and clean the API Key from environment variables
const rawKey = process.env.GEMINI_API_KEY || '';
const apiKey = rawKey.trim().replace(/^["']|["']$/g, '').trim();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});

// 🚀 GEMINI FAST MODELS: Using preferred aliases as per documentation
export const geminiModel = googleAI.model('gemini-flash-latest');
export const geminiProModel = googleAI.model('gemini-pro-latest');

// 🎨 VISUAL ENGINES: Optimized for latest Genkit specs
export const imagenModel = googleAI.model('googleai/imagen-4.0-fast-generate-001');
export const veoModel = googleAI.model('googleai/veo-2.0-generate-001');

// 🎙️ AUDIO ENGINES
export const ttsModel = googleAI.model('googleai/gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
