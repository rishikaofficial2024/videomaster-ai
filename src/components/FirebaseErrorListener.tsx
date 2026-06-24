
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * Centrally listens for Firestore permission errors and displays a user-friendly toast.
 * Removed console.error to prevent Next.js development error overlay from interrupting the flow.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Visual notification instead of console crash.
      // Logging to console is removed as it triggers the dev overlay in Next.js.
      toast({
        variant: 'destructive',
        title: 'Access Restricted',
        description: `Your request to ${error.context.operation} data was denied by security protocols.`,
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
