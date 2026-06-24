
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for VideoMaster AI.
 * 
 * ✅ Professional API Key Sanitization Logic.
 */

// Safely extract and clean the API Key from environment variables
const rawKey = process.env.GEMINI_API_KEY || '';
const apiKey = rawKey.trim().replace(/^["']|["']$/g, '').trim();

if (!apiKey) {
  console.warn("⚠️ AI CONFIG WARNING: GEMINI_API_KEY is missing from environment. AI features will operate in simulation mode.");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});

// ELITE AI MODELS: Using latest stable production aliases
// 🚀 FLASH: Optimized for viral script generation and rapid chat response
export const geminiModel = googleAI.model('gemini-1.5-flash-latest');
// 💎 PRO: High-intelligence reasoning for complex project structures
export const geminiProModel = googleAI.model('gemini-1.5-pro-latest');
// 🎨 IMAGEN: Professional cinematic image generation for 4K thumbnails
export const imagenModel = googleAI.model('imagen-3.0-generate-001');
// 📽️ VEO: Elite Text-to-Video generation engine for HD cinematic clips
export const veoModel = googleAI.model('veo-2.0-generate-001');
// 🎙️ TTS: Studio-quality natural voiceover generation
export const ttsModel = googleAI.model('gemini-2.5-flash-preview-tts');

export { z } from 'genkit';
