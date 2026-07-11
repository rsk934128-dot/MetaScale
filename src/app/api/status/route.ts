
import { NextResponse } from 'next/server';

/**
 * Sovereign Mesh Health Check Endpoint.
 * Used by Firebase App Hosting and Global Load Balancers to monitor node health.
 */
export async function GET() {
  return NextResponse.json({
    status: 'OPERATIONAL',
    version: '1.2.0-stable',
    mesh_sync: 'ACTIVE',
    timestamp: Date.now(),
    node: 'NODE-04-UK'
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Sovereign-Pulse': 'OK'
    }
  });
}
