"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { firebaseConfig } from './config';
import { useMemo, DependencyList } from 'react';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Optimized Firebase Initialization for Next.js 15 Production.
 * Ensures services are only initialized once and safely on the client.
 */
export function initializeFirebase() {
  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }
  
  auth = getAuth(app);
  firestore = getFirestore(app);

  // 🛡️ ELITE SECURITY: App Check Initialization
  // Only initialize on the client and not in localhost/test environments
  if (typeof window !== 'undefined' && 
      firebaseConfig.appCheckSiteKey && 
      !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1')) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(firebaseConfig.appCheckSiteKey),
        isTokenAutoRefreshEnabled: true
      });
    } catch (e) {
      // App Check is non-critical for initial boot logic
      console.warn("App Check Shield: Handshake Pending.");
    }
  }
  
  return { app, auth, firestore };
}

/**
 * useMemoFirebase stabilizes Firestore references or queries.
 * Essential to prevent infinite re-render loops in useDoc/useCollection hooks.
 */
export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}

export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
