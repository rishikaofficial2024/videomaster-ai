'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase, FirebaseProvider } from './index';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export const FirebaseClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
    storage: FirebaseStorage;
  } | null>(null);

  useEffect(() => {
    // Only initialize on the client
    const instances = initializeFirebase();
    setFirebase(instances);
  }, []);

  if (!firebase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05070a]">
        <div className="animate-pulse text-primary font-bold uppercase tracking-widest text-xs">Connecting to Studio Nodes...</div>
      </div>
    );
  }

  return (
    <FirebaseProvider {...firebase}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
};
