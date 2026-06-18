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
 * Optimized useCollection hook to prevent infinite render loops.
 */
export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const lastQueryKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Stabilize query identification
    const currentQueryKey = query ? (query as any)._query?.path?.toString() || 'default' : null;
    
    if (!query) {
      if (lastQueryKeyRef.current !== null) {
        setData(null);
        setLoading(false);
        lastQueryKeyRef.current = null;
      }
      return;
    }

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
        if (serverError.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: 'collection_query',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
        } else {
          setError(serverError);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}