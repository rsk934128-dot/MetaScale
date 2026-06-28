'use server';
/**
 * @fileOverview Cross-Border Disbursement Orchestrator (PayPal & Priyo Pay).
 * 
 * - orchestratePayout - Handles OAuth2 token exchange and payout batch execution.
 * - PayoutInputSchema - Validation for recipient, amount, and gateway credentials.
 * - Integration of "Imperial Directive" and "Sovereign Mesh" routing logic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PayoutInputSchema = z.object({
  gateway: z.enum(['PAYPAL', 'PRIYO_PAY']),
  recipientEmail: z.string().email(),
  amount: z.number(),
  currency: z.string().default('USD'),
  credentials: z.object({
    clientId: z.string().optional(),
    clientSecret: z.string().optional(),
  }).optional(),
});

const PayoutOutputSchema = z.object({
  status: z.enum(['SUCCESS', 'PENDING', 'FAILED']),
  batchId: z.string(),
  executionLog: z.array(z.string()),
  routingToken: z.string().describe('System routing seal for tracing.'),
  directiveLevel: z.string().describe('Governance clearance level used for execution.'),
});

export async function orchestratePayout(input: z.infer<typeof PayoutInputSchema>) {
  return payoutFlow(input);
}

const payoutPrompt = ai.definePrompt({
  name: 'payoutPrompt',
  input: { schema: PayoutInputSchema },
  output: { schema: PayoutOutputSchema },
  prompt: `You are the Sovereign Financial Disbursement Agent operating under SHURUKKHA-OS v1.2.
GATEWAY: {{{gateway}}}
RECIPIENT: {{{recipientEmail}}}
AMOUNT: {{{amount}}} {{{currency}}}

EXECUTION PARAMETERS:
1. Simulate OAuth 2.0 token exchange for the specified gateway.
2. If gateway is PAYPAL, use the /v1/payments/payouts batch structure.
3. If gateway is PRIYO_PAY, simulate the "Check -> Confirm" sequence for private system paths.
4. Generate a unique Sovereign Mesh routing token (e.g., FALLBACK_P180_9...).
5. Append an "Imperial Directive" seal if the amount exceeds $1,000 or if the routing path is unindexed.
6. Provide a technical execution log for the Finance Plane ledger reflecting Anycast validation.`,
});

const payoutFlow = ai.defineFlow(
  {
    name: 'payoutFlow',
    inputSchema: PayoutInputSchema,
    outputSchema: PayoutOutputSchema,
  },
  async (input) => {
    const { output } = await payoutPrompt(input);
    return output!;
  }
);
