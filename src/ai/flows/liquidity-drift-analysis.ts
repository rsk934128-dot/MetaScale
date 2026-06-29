
'use server';
/**
 * @fileOverview Project 45: Forensic Liquidity Drift Analysis.
 * Analyzes transaction velocity and node-level liquidity to predict imbalances in the Sovereign Mesh.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DriftInputSchema = z.object({
  nodeId: z.string().describe('The Anycast Node identifier.'),
  currentLiquidity: z.number().describe('Current liquid assets on the node.'),
  transactionVelocity: z.number().describe('Number of transactions per second.'),
  outboundPressure: z.number().describe('Predicted outbound disbursement volume.'),
});

const DriftOutputSchema = z.object({
  driftScore: z.number().min(0).max(100).describe('Risk score for liquidity imbalance.'),
  recommendation: z.string().describe('Autonomous action suggested by AI.'),
  rebalancingProtocol: z.enum(['NONE', 'STANDARD_SHIFT', 'EMERGENCY_INJECTION', 'LOCKDOWN_THROTTLE']),
  estimatedImpactTime: z.string().describe('ETA of potential liquidity exhaustion.'),
});

const driftPrompt = ai.definePrompt({
  name: 'driftPrompt',
  input: { schema: DriftInputSchema },
  output: { schema: DriftOutputSchema },
  prompt: `You are the Project 45 Sovereign Fiscal Guardian.
Analyze the liquidity state for Node: {{{nodeId}}}.

METRICS:
- Liquidity: \${{{currentLiquidity}}}
- Velocity: {{{transactionVelocity}}} tps
- Pressure: \${{{outboundPressure}}}

1. Calculate a Drift Score based on velocity and pressure vs current liquidity.
2. If pressure exceeds 80% of liquidity, suggest EMERGENCY_INJECTION.
3. If drift is stable, set protocol to NONE or STANDARD_SHIFT.
4. Provide a technical recommendation for the Finance Plane.`,
});

const liquidityDriftFlow = ai.defineFlow(
  {
    name: 'liquidityDriftFlow',
    inputSchema: DriftInputSchema,
    outputSchema: DriftOutputSchema,
  },
  async (input) => {
    const { output } = await driftPrompt(input);
    return output!;
  }
);

export async function analyzeLiquidityDrift(input: z.infer<typeof DriftInputSchema>) {
  return liquidityDriftFlow(input);
}
