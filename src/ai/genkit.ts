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
  console.warn("⚠️ AI CONFIG WARNING: GEMINI_API_KEY is not set in .env file. AI features will fail.");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});

// ELITE AI MODELS: Using latest stable aliases
// 🚀 FLASH: Fast & Free for scripts/chat
export const geminiModel = googleAI.model('gemini-flash-latest');
// 💎 PRO: High-intelligence for complex scripts
export const geminiProModel = googleAI.model('gemini-pro-latest');
// 🎨 IMAGEN: Cinematic thumbnail generation
export const imagenModel = googleAI.model('imagen-3.0-generate-001');
// 📽️ VEO: Text-to-Video generation
export const veoModel = googleAI.model('veo-2.0-generate-001');
// 🎙️ TTS: Natural voiceover generation
export const ttsModel = googleAI.model('gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
