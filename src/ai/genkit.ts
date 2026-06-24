
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Gemini Fast AI Initialization for VideoMaster.
 * 
 * ✅ Optimized for Gemini 1.5 Flash (Free Tier / High Speed).
 */

// Safely extract and clean the API Key from environment variables
const rawKey = process.env.GEMINI_API_KEY || '';
const apiKey = rawKey.trim().replace(/^["']|["']$/g, '').trim();

if (!apiKey) {
  console.warn("⚠️ AI CONFIG WARNING: GEMINI_API_KEY is missing. AI features will operate in simulation mode.");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});

// 🚀 GEMINI FAST MODELS: Optimized for high-speed content generation
export const geminiModel = googleAI.model('gemini-1.5-flash-latest');
export const geminiProModel = googleAI.model('gemini-1.5-pro-latest');

// 🎨 VISUAL ENGINES
export const imagenModel = googleAI.model('imagen-3.0-generate-001');
export const veoModel = googleAI.model('veo-2.0-generate-001');

// 🎙️ AUDIO ENGINES
export const ttsModel = googleAI.model('gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
