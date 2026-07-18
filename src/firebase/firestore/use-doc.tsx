
'use client';

import { useEffect, useState } from 'react';
import {
  onSnapshot,
  DocumentSnapshot,
  DocumentData,
  FirestoreError,
  DocumentReference,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { getAuth } from 'firebase/auth';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let unsubscribe: () => void = () => {};

    try {
      unsubscribe = onSnapshot(
        ref,
        (snapshot: DocumentSnapshot<T>) => {
          if (!isMounted) return;
          setData(snapshot.exists() ? ({ ...snapshot.data()!, id: snapshot.id } as T) : null);
          setLoading(false);
          setError(null);
        },
        async (serverError: FirestoreError) => {
          if (!isMounted) return;
          
          const auth = getAuth();
          if (serverError.code === 'permission-denied') {
            if (!auth.currentUser) {
              console.debug("Firestore: Suppressing doc permission error (Not Logged In)");
              setLoading(false);
              return;
            }
            const permissionError = new FirestorePermissionError({
              path: ref.path,
              operation: 'get',
            });
            errorEmitter.emit('permission-error', permissionError);
            setError(permissionError);
          } else if (serverError.code === 'unavailable' || serverError.code === 'deadline-exceeded') {
            console.warn('Firestore Document: Operating in restricted network/offline mode.');
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
        console.error("onSnapshot sync error (doc):", e);
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
  }, [ref]);

  return { data, loading, error };
}
