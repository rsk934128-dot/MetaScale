'use server';
/**
 * @fileOverview Sovereign Economic Governance Simulator.
 * Predicts network-wide stability, civilization-level liquidity health, and optimizes settlement policy.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EconomicLayerSchema = z.object({
  micro: z.number().describe('Entity-level stability index.'),
  meso: z.number().describe('Network-level stability index.'),
  macro: z.number().describe('Global system stability index.'),
});

const EconomyInputSchema = z.object({
  networkNodes: z.array(z.object({
    id: z.string().describe('Unique identifier for the node.'),
    trustScore: z.number(),
    liquidityAvailable: z.number(),
    layer: z.enum(['micro', 'meso', 'macro']).default('micro'),
  })),
  activeCorridors: z.array(z.object({
    from: z.string(),
    to: z.string(),
    throughput: z.number(),
    latency: z.number(),
  })),
  policyChanges: z.object({
    creditExpansion: z.boolean().optional(),
    trustThresholdAdjustment: z.number().optional(),
    settlementThrottling: z.boolean().optional(),
  }).optional(),
  marketTrend: z.enum(['stable', 'volatile', 'stressed']),
});

const EconomyOutputSchema = z.object({
  civilizationStabilityIndex: z.number().describe('0-100 score of total civilization health.'),
  layerStability: EconomicLayerSchema,
  liquidityConcentrationRisk: z.number().describe('Percentage of liquidity tied to single points of failure.'),
  policyImpactForecast: z.string().describe('Predicted result of proposed policy changes.'),
  recommendedRouting: z.array(z.object({
    path: z.string(),
    priority: z.number(),
    reason: z.string(),
  })),
  shockResponseActions: z.array(z.object({
    action: z.string(),
    trigger: z.string(),
    impact: z.string(),
  })).optional(),
});

const economySimulatorPrompt = ai.definePrompt({
  name: 'economySimulatorPrompt',
  input: { schema: z.object({
    marketTrend: z.string(),
    nodeDetails: z.string(),
    policyText: z.string(),
  }) },
  output: { schema: EconomyOutputSchema },
  prompt: `You are the SEG-MLC Global Economic Governor.
Analyze the state of the Digital Economic Civilization.

MARKET CONDITION: {{{marketTrend}}}

HIERARCHICAL NODES:
{{{nodeDetails}}}

PROPOSED POLICY CHANGES:
{{{policyText}}}

1. Calculate a Civilization-Level Stability Index.
2. Forecast the impact of the proposed policy changes.
3. Detect "Economic Shocks" and recommend response actions.
4. Identify high-risk liquidity concentrations and Prime Paths.`,
});

const simulateTrustEconomyFlow = ai.defineFlow(
  {
    name: 'simulateTrustEconomyFlow',
    inputSchema: EconomyInputSchema,
    outputSchema: EconomyOutputSchema,
  },
  async (input) => {
    const nodeDetails = input.networkNodes.map(n => `- ${n.id} [${n.layer}]: Trust ${n.trustScore}, Liquidity \$${n.liquidityAvailable}`).join('\n');
    const policyText = input.policyChanges ? JSON.stringify(input.policyChanges, null, 2) : "None";

    const { output } = await economySimulatorPrompt({
      marketTrend: input.marketTrend,
      nodeDetails,
      policyText,
    });
    return output!;
  }
);

export async function simulateTrustEconomy(input: z.infer<typeof EconomyInputSchema>) {
  return simulateTrustEconomyFlow(input);
}
