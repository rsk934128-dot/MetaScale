
'use server';
/**
 * @fileOverview Dynamic Trust Negotiation Engine for SSFN-ITP.
 * Evaluates the feasibility of establishing a Trusted Settlement Corridor between two entities.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NetworkTrustInputSchema = z.object({
  sourceEntity: z.object({
    id: z.string(),
    trustScore: z.number(),
    jurisdiction: z.string(),
    complianceStatus: z.string(),
  }),
  targetEntity: z.object({
    id: z.string(),
    trustScore: z.number(),
    jurisdiction: z.string(),
    complianceStatus: z.string(),
  }),
  requestedCorridorType: z.enum(['instant', 'standard', 'escrow']),
});

const NetworkTrustOutputSchema = z.object({
  negotiationStatus: z.enum(['approved', 'requires_manual_negotiation', 'rejected']),
  mutualTrustScore: z.number(),
  corridorConstraints: z.array(z.string()),
  riskPropagationWarning: z.string().optional(),
  suggestedEscrowRules: z.array(z.string()).optional(),
});

export async function negotiateNetworkTrust(input: z.infer<typeof NetworkTrustInputSchema>) {
  return negotiateNetworkTrustFlow(input);
}

const negotiatorPrompt = ai.definePrompt({
  name: 'negotiatorPrompt',
  input: { schema: NetworkTrustInputSchema },
  output: { schema: NetworkTrustOutputSchema },
  prompt: `You are the SSFN-ITP Network Negotiation Agent.
Evaluate a trust relationship request between two entities.

SOURCE: {{{sourceEntity.id}}} (Score: {{{sourceEntity.trustScore}}}, Jurisdiction: {{{sourceEntity.jurisdiction}}})
TARGET: {{{targetEntity.id}}} (Score: {{{targetEntity.trustScore}}}, Jurisdiction: {{{targetEntity.jurisdiction}}})
CORRIDOR REQUESTED: {{{requestedCorridorType}}}

1. Calculate a Mutual Trust Score based on the lower of the two scores and jurisdictional alignment.
2. Determine if the corridor can be 'approved' automatically or if it 'requires_manual_negotiation'.
3. Identify potential Risk Propagation (e.g., if one entity fails, how does it impact the other?).
4. If trust is below 80, suggest 'escrow' rules for the corridor.`,
});

const negotiateNetworkTrustFlow = ai.defineFlow(
  {
    name: 'negotiateNetworkTrustFlow',
    inputSchema: NetworkTrustInputSchema,
    outputSchema: NetworkTrustOutputSchema,
  },
  async (input) => {
    const { output } = await negotiatorPrompt(input);
    return output!;
  }
);
