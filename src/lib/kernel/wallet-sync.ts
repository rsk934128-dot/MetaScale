
/**
 * @fileOverview Wallet Synchronization Utility.
 * Ensures consistent balance states between UBIL Mainframe and Bridge nodes.
 */

import { Firestore, doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export async function syncVirtualBalance(
  firestore: Firestore,
  userId: string,
  amount: number,
  operation: 'CREDIT' | 'DEBIT'
) {
  const userRef = doc(firestore, 'users', userId);
  const multiplier = operation === 'CREDIT' ? 1 : -1;

  // We perform a safe atomic increment
  await updateDoc(userRef, {
    balance: increment(amount * multiplier),
    lastSyncAt: Date.now()
  });

  console.log(`>>> [WALLET_SYNC] ${operation} of ${amount} for ${userId} stabilized.`);
  return { stabilized: true, newSyncTime: Date.now() };
}
