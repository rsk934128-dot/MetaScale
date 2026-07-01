
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { processInboundBridge } from '@/api/bridge/inbound';

/**
 * Inbound Bridge API Endpoint.
 * External systems POST here to send money into the Sovereign Mesh.
 */
export async function POST(req: Request) {
  const { firestore } = initializeFirebase();
  if (!firestore) return NextResponse.json({ error: 'CORE_OFFLINE' }, { status: 503 });

  try {
    const body = await req.json();
    const result = await processInboundBridge(firestore, body);
    
    return NextResponse.json({ 
      ok: true, 
      seal: result.bridgeSeal || body.paymentSeal,
      status: 'HANDSHAKE_STABILIZED'
    });
  } catch (err: any) {
    return NextResponse.json({ 
      ok: false, 
      error: 'BRIDGE_REJECTED',
      message: err.message 
    }, { status: 400 });
  }
}
