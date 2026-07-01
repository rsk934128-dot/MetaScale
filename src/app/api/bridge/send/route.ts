
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { dispatchOutboundBridge } from '@/api/bridge/outbound';

/**
 * Outbound Bridge API Endpoint.
 * Authorized systems POST here to dispatch money from the Sovereign Mesh.
 */
export async function POST(req: Request) {
  const { firestore } = initializeFirebase();
  if (!firestore) return NextResponse.json({ error: 'CORE_OFFLINE' }, { status: 503 });

  try {
    // Security Note: In production, verify Team API Secret here
    const body = await req.json();
    const result = await dispatchOutboundBridge(firestore, body);
    
    return NextResponse.json({ 
      ok: true, 
      dispatchId: result.dispatchId,
      txHash: result.txHash,
      status: result.status 
    });
  } catch (err: any) {
    return NextResponse.json({ 
      ok: false, 
      error: 'DISPATCH_FAILED',
      message: err.message 
    }, { status: 500 });
  }
}
