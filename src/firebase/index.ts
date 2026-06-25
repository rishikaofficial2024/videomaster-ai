"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { firebaseConfig } from './config';
import { useMemo, DependencyList } from 'react';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

/**
 * Optimized Firebase Initialization for Next.js 15 Production.
 * Features strict conditional initialization for App Check to prevent local build failures.
 */
export function initializeFirebase() {
  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }
  
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);

  // 🛡️ ELITE SECURITY: App Check Initialization
  // Only attempt initialization if key is present AND not on localhost
  const isBrowser = typeof window !== 'undefined';
  const siteKey = firebaseConfig.appCheckSiteKey;
  const isLocal = isBrowser && (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1'));

  if (isBrowser && siteKey && !isLocal) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true
      });
      console.log("🛡️ App Check Protection Active.");
    } catch (e) {
      console.warn("🛡️ App Check initialization skipped or failed:", e);
    }
  } else if (isBrowser && isLocal) {
    console.log("🛡️ Development Mode: App Check bypassed on localhost.");
  }
  
  return { app, auth, firestore, storage };
}

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}

export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth, useStorage } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
