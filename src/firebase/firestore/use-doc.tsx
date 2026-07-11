
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

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<T>) => {
        if (!isMounted) return;
        setData(snapshot.exists() ? ({ ...snapshot.data()!, id: snapshot.id } as T) : null);
        setLoading(false);
        setError(null);
      },
      async (serverError: FirestoreError) => {
        if (!isMounted) return;
        if (serverError.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
        } else if (serverError.code === 'unavailable' || serverError.code === 'deadline-exceeded') {
          // Suppress hard error for offline mode or timeouts
          console.warn('Firestore Document: Operating in restricted network/offline mode.');
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
  }, [ref]);

  return { data, loading, error };
}
