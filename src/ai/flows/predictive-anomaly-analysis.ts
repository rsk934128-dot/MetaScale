'use server';
/**
 * @fileOverview Predictive Anomaly Profiling Flow (The Hunter Mode).
 * Analyzes transaction context and behavioral patterns to generate a risk score.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnomalyInputSchema = z.object({
  transaction: z.object({
    amount: z.number(),
    currency: z.string(),
    provider: z.string(),
    externalTxnId: z.string(),
    nodeId: z.string(),
  }),
  userContext: z.object({
    uid: z.string(),
    trustScore: z.number(),
    verificationStatus: z.string(),
    recentActivityCount: z.number(),
    averageTxnAmount: z.number(),
  }),
  networkMetadata: z.object({
    ip: z.string().optional(),
    userAgent: z.string().optional(),
    latency: z.number().optional(),
  }),
});

const AnomalyOutputSchema = z.object({
  riskScore: z.number().min(0).max(100).describe('0-100 risk score where >80 is critical.'),
  threatCategory: z.enum(['NONE', 'BEHAVIORAL_DRIFT', 'VELOCITY_ATTACK', 'NODE_ANOMALY', 'POTENTIAL_FRAUD']),
  isProactiveBlockRecommended: z.boolean(),
  reasoning: z.string().describe('Detailed technical reasoning in Bengali/English.'),
  suggestedAction: z.string(),
});

export async function runPredictiveAnalysis(input: z.infer<typeof AnomalyInputSchema>) {
  return predictiveAnomalyFlow(input);
}

const anomalyPrompt = ai.definePrompt({
  name: 'anomalyPrompt',
  input: { schema: AnomalyInputSchema },
  output: { schema: AnomalyOutputSchema },
  prompt: `You are the Sovereign "Hunter Mode" Intelligence Agent.
Analyze the following transaction for behavioral fingerprints and context-aware risks.

TRANSACTION: {{{transaction.amount}}} {{{transaction.currency}}} via {{{transaction.provider}}} (Node: {{{transaction.nodeId}}})
USER_PROFILE: Score {{{userContext.trustScore}}}, Status {{{userContext.verificationStatus}}}, Avg Txn: {{{userContext.averageTxnAmount}}}
ACTIVITY: {{{userContext.recentActivityCount}}} txns in last 24h.

TASKS:
1. Detect Behavioral Drift: Is this transaction amount significantly higher than their average?
2. Velocity Check: Is the activity count suspicious for this tier?
3. Node Check: Is the transaction originating from a node or IP inconsistent with historical patterns?
4. Generate a Risk Score (0-100).
5. Recommend a Proactive Block if risk > 80.

Provide reasoning in Bengali to assist the local admin Sheikh Farid.`,
});

const predictiveAnomalyFlow = ai.defineFlow(
  {
    name: 'predictiveAnomalyFlow',
    inputSchema: AnomalyInputSchema,
    outputSchema: AnomalyOutputSchema,
  },
  async (input) => {
    const { output } = await anomalyPrompt(input);
    return output!;
  }
);
