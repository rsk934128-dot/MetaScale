
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
        // First try to get any existing instance to prevent re-initialization conflicts
        firestore = getFirestore(firebaseApp);
      } catch (e) {
        try {
          // If not exists, initialize with a more stable persistence configuration
          firestore = initializeFirestore(firebaseApp, {
            localCache: persistentLocalCache({ 
              tabManager: persistentMultipleTabManager() 
            }),
            // Use long polling to mitigate WebSocket handshake failures in restricted networks
            experimentalForceLongPolling: true,
            ignoreUndefinedProperties: true
          });
        } catch (initErr) {
          // Fail-safe: Fallback to standard firestore instance without persistence if both fail
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
