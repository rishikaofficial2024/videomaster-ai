'use server';

import { isAiEngineAuthorized } from '@/ai/genkit';

/**
 * 🛠️ SERVER ACTION: AI Availability Check.
 * Prevents client components from importing Genkit logic directly.
 */
export async function checkAiAvailability() {
  try {
    return isAiEngineAuthorized();
  } catch (e) {
    return false;
  }
}
