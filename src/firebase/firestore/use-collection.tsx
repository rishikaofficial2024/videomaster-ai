
'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Query,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * Optimized useCollection hook with deep path stabilization and error propagation.
 */
export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Ref to track query path and prevent infinite re-renders
  const lastQueryKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Generate a unique key for the query based on its internal path
    const currentQueryKey = query ? (query as any)._query?.path?.toString() || 'default' : null;
    
    if (!query) {
      if (lastQueryKeyRef.current !== null) {
        setData(null);
        setLoading(false);
        lastQueryKeyRef.current = null;
      }
      return;
    }

    // Stabilize re-renders: Don't re-subscribe if the query path is identical
    if (lastQueryKeyRef.current === currentQueryKey) return;
    lastQueryKeyRef.current = currentQueryKey;

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as T & { id: string }));
        setData(items);
        setLoading(false);
        setError(null);
      },
      async (serverError: any) => {
        // Map standard Firestore permission errors to our contextual error system
        const permissionError = new FirestorePermissionError({
          path: currentQueryKey || 'collection_query',
          operation: 'list',
        });
        
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
