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
      // Must be the first call to getFirestore to set settings
      firestore = initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({ 
          tabManager: persistentMultipleTabManager() 
        }),
        experimentalForceLongPolling: true
      });
      console.log("Firestore initialized with Persistence and Long Polling.");
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
