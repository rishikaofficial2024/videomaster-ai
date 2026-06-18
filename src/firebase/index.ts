
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useMemo, DependencyList } from 'react';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Initializes Firebase services and returns the instances.
 */
export function initializeFirebase() {
  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }
  
  auth = getAuth(app);
  firestore = getFirestore(app);
  
  return { app, auth, firestore };
}

/**
 * useMemoFirebase stabilizes Firestore references or queries.
 * Essential to prevent infinite re-render loops in useDoc/useCollection.
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
