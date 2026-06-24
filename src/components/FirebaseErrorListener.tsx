'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * Centrally listens for Firestore permission errors and displays a visual toast.
 * Removed console.error to prevent Next.js Red Screen crash in development.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Visual notification only - avoids interrupting dev flow with crashes
      toast({
        variant: 'destructive',
        title: 'Access Restricted',
        description: `Security Protocol: Your request to ${error.context.operation} data was denied.`,
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
