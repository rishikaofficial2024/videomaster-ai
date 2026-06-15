
'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase, FirebaseProvider } from './index';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export const FirebaseClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
  } | null>(null);

  useEffect(() => {
    // Only initialize on the client
    const instances = initializeFirebase();
    setFirebase(instances);
  }, []);

  if (!firebase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-bold">Connecting to Services...</div>
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
