
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  Firestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

/**
 * Initializes Firebase services with a robust singleton pattern.
 * Specifically handles Firestore persistence edge cases to prevent "INTERNAL ASSERTION FAILED" errors.
 */
export function initializeFirebase() {
  if (getApps().length > 0) {
    firebaseApp = getApp();
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }
  
  if (!firestore) {
    const isBrowser = typeof window !== 'undefined';
    
    if (isBrowser) {
      try {
        // Use standard initialization first if possible
        firestore = getFirestore(firebaseApp);
      } catch (e) {
        try {
          // If fallback needed, use specialized persistence settings
          firestore = initializeFirestore(firebaseApp, {
            localCache: persistentLocalCache({ 
              tabManager: persistentMultipleTabManager() 
            }),
            // Force long polling and auto-detection to stabilize handshake in restricted networks
            experimentalForceLongPolling: true,
            experimentalAutoDetectLongPolling: true,
            ignoreUndefinedProperties: true
          });
        } catch (initErr) {
          // Final fail-safe: Basic firestore without persistence
          firestore = getFirestore(firebaseApp);
        }
      }
    } else {
      // Standard initialization for Server side (API routes / SSR)
      firestore = getFirestore(firebaseApp);
    }
  }

  if (!auth) {
    auth = getAuth(firebaseApp);
  }

  return { app: firebaseApp, firestore, auth };
}

export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
