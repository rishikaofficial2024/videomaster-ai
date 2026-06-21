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
  console.warn("⚠️ AI CONFIG WARNING: GEMINI_API_KEY is not set. AI features will remain in offline mode until the key is provided.");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});

// ELITE AI MODELS: Using latest stable aliases for production
// 🚀 FLASH: Fastest brain for viral scripts and chat assistant
export const geminiModel = googleAI.model('gemini-1.5-flash-latest');
// 💎 PRO: High-intelligence engine for complex, multi-scene scripts
export const geminiProModel = googleAI.model('gemini-1.5-pro-latest');
// 🎨 IMAGEN: Cinematic image generation for 4K thumbnails
export const imagenModel = googleAI.model('imagen-3.0-generate-001');
// 📽️ VEO: Elite Text-to-Video generation engine
export const veoModel = googleAI.model('veo-2.0-generate-001');
// 🎙️ TTS: Natural voiceover generation with WAV output
export const ttsModel = googleAI.model('gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
