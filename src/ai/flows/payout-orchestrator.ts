
'use server';
/**
 * Cross-Border Disbursement Orchestrator (PayPal, Priyo Pay, Payoneer & Telegram Wallet).
 * 
 * Updated v1.2: Added Multi-Sig Directive Levels and Ephemeral Signature Logic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PayoutInputSchema = z.object({
  gateway: z.enum(['PAYPAL', 'PRIYO_PAY', 'PAYONEER', 'TELEGRAM_WALLET']),
  recipientInfo: z.string().describe('Recipient email, Telegram ID, TON Address, or phone number.'),
  amount: z.number(),
  currency: z.string().default('USD'),
  memo: z.string().optional().describe('Optional Memo/Tag for Centralized Exchanges or reference.'),
  credentials: z.object({
    clientId: z.string().optional(),
    clientSecret: z.string().optional(),
  }).optional(),
});

const PayoutOutputSchema = z.object({
  status: z.enum(['SUCCESS', 'PENDING', 'FAILED']),
  batchId: z.string(),
  txHash: z.string().describe('Simulated blockchain or gateway transaction hash.'),
  executionLog: z.array(z.string()),
  routingToken: z.string().describe('System routing seal for tracing.'),
  directiveLevel: z.string().describe('Governance clearance level used for execution.'),
  refundEligible: z.boolean().default(true),
  destinationType: z.enum(['P2P', 'EXTERNAL_WALLET', 'CEX_EXCHANGE', 'MERCHANT']).optional(),
  institutionalMetadata: z.object({
    custodyNode: z.string().describe('External custodian vault identifier.'),
    auditSignature: z.string().describe('SHA-256 integrity seal for the transaction.'),
    compliancePass: z.boolean(),
  }).optional(),
});

export async function orchestratePayout(input: z.infer<typeof PayoutInputSchema>) {
  return payoutFlow(input);
}

const payoutPrompt = ai.definePrompt({
  name: 'payoutPrompt',
  input: { schema: PayoutInputSchema },
  output: { schema: PayoutOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are the Sovereign Financial Disbursement Agent operating under SHURUKKHA-OS v1.2.
GATEWAY: {{{gateway}}}
RECIPIENT: {{{recipientInfo}}}
AMOUNT: {{{amount}}} {{{currency}}}
MEMO: {{{memo}}}

EXECUTION PARAMETERS:
1. Simulate OAuth 2.0 token exchange for the specified gateway.
2. If gateway is TELEGRAM_WALLET:
   - Identify if recipient is a username (@), a phone number, or a TON Wallet address (starts with EQ/UQ).
   - If it is a TON Address AND a Memo is provided, mark destinationType as 'CEX_EXCHANGE'.
3. Apply Custody-Execution Separation logic: 
   - Assign a Custody Node (e.g., ANCHORAGE_V2_VAULT) to the institutionalMetadata.
   - Generate an ephemeral auditSignature (SHA-256) valid only for this session.
4. If amount >= $1000, set directiveLevel to 'IMPERIAL' and status to 'PENDING'.
   Otherwise set status to 'SUCCESS' and directiveLevel to 'CITIZEN'.
5. Provide a detailed execution log reflecting Anycast validation and Multi-Sig status.`,
});

const payoutFlow = ai.defineFlow(
  {
    name: 'payoutFlow',
    inputSchema: PayoutInputSchema,
    outputSchema: PayoutOutputSchema,
  },
  async (input) => {
    const { output } = await payoutPrompt(input);
    
    if (output && !output.txHash) {
      output.txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    }
    
    return output!;
  }
);
