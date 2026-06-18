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
 * useCollection hook for real-time Firestore collection updates.
 * Optimized with path-based stabilization to prevent infinite render loops.
 */
export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Track the query to avoid redundant subscriptions using a ref
  const lastQueryRef = useRef<string | null>(null);

  useEffect(() => {
    // Generate a unique identifier for the query based on its structure
    // We avoid JSON.stringify on the whole query as it can have circular refs
    const queryId = query ? (query as any)._query?.path?.toString() || 'default' : null;
    
    if (!query) {
      if (lastQueryRef.current !== null) {
        setData(null);
        setLoading(false);
        lastQueryRef.current = null;
      }
      return;
    }

    if (lastQueryRef.current === queryId) return;
    lastQueryRef.current = queryId;

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
      async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: 'collection_query',
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
