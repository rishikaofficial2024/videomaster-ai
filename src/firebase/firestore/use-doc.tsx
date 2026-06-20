
'use client';

import { useEffect, useState, useRef } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * Optimized useDoc hook for real-time document updates.
 * Features path-based stabilization to prevent expensive re-render loops.
 */
export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Track the reference path to avoid redundant subscriptions
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = ref?.path || null;
    
    if (!ref) {
      if (lastPathRef.current !== null) {
        setData(null);
        setLoading(false);
        lastPathRef.current = null;
      }
      return;
    }

    // Skip if the path hasn't changed (prevents infinite render loops)
    if (lastPathRef.current === currentPath) return;
    lastPathRef.current = currentPath;

    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<T>) => {
        setData(snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } as T & { id: string } : null);
        setLoading(false);
        setError(null);
      },
      async (serverError) => {
        // Promote standard error to rich contextual error
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get',
        });
        
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
