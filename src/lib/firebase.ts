/**
 * This file is deprecated. 
 * Please use the centralized Firebase services from "@/firebase".
 */
import { initializeFirebase } from '@/firebase';

const { auth, firestore: db } = initializeFirebase();

// Maintaining exports for backward compatibility during transition
export { auth, db };
export const storage = null; // Storage not yet initialized in centralized config
