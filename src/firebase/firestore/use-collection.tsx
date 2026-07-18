
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
import { getAuth } from 'firebase/auth';

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
    let unsubscribe: () => void = () => {};

    try {
      unsubscribe = onSnapshot(
        query,
        (snapshot: QuerySnapshot<T>) => {
          if (!isMounted) return;
          setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T)));
          setLoading(false);
          setError(null);
        },
        async (serverError: FirestoreError) => {
          if (!isMounted) return;
          
          // Quietly handle permissions if auth is not ready
          const auth = getAuth();
          if (serverError.code === 'permission-denied') {
            if (!auth.currentUser) {
              console.debug("Firestore: Suppressing permission error (Not Logged In)");
              setLoading(false);
              return;
            }
            const permissionError = new FirestorePermissionError({
              path: (query as any)._query?.path?.segments?.join('/') || 'unknown',
              operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setError(permissionError);
          } else if (serverError.code === 'unavailable' || serverError.code === 'deadline-exceeded') {
            console.warn('Firestore Collection: Operating in restricted network/offline mode.');
            setError(null); 
          } else {
            const msg = serverError.message || "";
            if (!msg.includes('b815') && !msg.includes('ca9')) {
              setError(serverError);
            }
          }
          setLoading(false);
        }
      );
    } catch (e: any) {
      const msg = e.message || "";
      if (!msg.includes('b815') && !msg.includes('ca9')) {
        console.error("onSnapshot sync error (collection):", e);
      }
    }

    return () => {
      isMounted = false;
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (e) {}
      }
    };
  }, [query]);

  return { data, loading, error };
}
