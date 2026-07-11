
'use client';

import { useEffect, useState } from 'react';
import {
  Query,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        if (!isMounted) return;
        setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T)));
        setLoading(false);
        setError(null);
      },
      async (serverError: FirestoreError) => {
        if (!isMounted) return;
        if (serverError.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: (query as any)._query?.path?.segments?.join('/') || 'unknown',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
        } else if (serverError.code === 'unavailable' || serverError.code === 'deadline-exceeded') {
          // Suppress hard error for offline mode or timeouts
          console.warn('Firestore Collection: Operating in restricted network/offline mode.');
          setError(null); 
        } else {
          // Ignore specific internal assertion failures from spreading to the UI
          const msg = serverError.message || "";
          if (!msg.includes('b815') && !msg.includes('ca9')) {
            setError(serverError);
          }
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      try {
        unsubscribe();
      } catch (e) {
        // Silent catch for potential internal SDK issues during unmount
      }
    };
  }, [query]);

  return { data, loading, error };
}
