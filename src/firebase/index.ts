'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

let firestoreInstance: any = null;
let authInstance: any = null;

export function initializeFirebase() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  if (!firestoreInstance) {
    try {
      // Optimized for reliable multi-tab and offline access
      firestoreInstance = initializeFirestore(app, {
        localCache: persistentLocalCache({ 
          tabManager: persistentMultipleTabManager() 
        })
      });
    } catch (e) {
      firestoreInstance = getFirestore(app);
    }
  }
  
  if (!authInstance) {
    authInstance = getAuth(app);
  }

  return { app, firestore: firestoreInstance, auth: authInstance };
}

export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
