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

export function initializeFirebase() {
  if (getApps().length > 0) {
    firebaseApp = getApp();
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }
  
  if (!firestore) {
    try {
      // Server-side environments (like API routes) don't have indexedDB or localStorage.
      // We must detect environment to avoid "Persistence" related crashes on the server.
      const isBrowser = typeof window !== 'undefined';
      
      if (isBrowser) {
        firestore = initializeFirestore(firebaseApp, {
          localCache: persistentLocalCache({ 
            tabManager: persistentMultipleTabManager() 
          }),
          experimentalForceLongPolling: true,
          ignoreUndefinedProperties: true
        });
      } else {
        // Simple initialization for Server side
        firestore = getFirestore(firebaseApp);
      }
    } catch (e) {
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
