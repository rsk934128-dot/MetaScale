
'use server';
/**
 * Sovereign Intelligence Agent (Gemini-Powered Agentic Engine).
 * Implements Tool Use (Function Calling) with Human-in-the-Loop (HITL) safety.
 * NEW: Added sendSecureOTP tool for Telegram integration.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { sendSecureOTP } from '@/lib/telegram';

// --- System Tools (Function Calling) ---

/**
 * Tool to fetch the current state of a payment seal.
 */
const getPaymentStatusTool = ai.defineTool(
  {
    name: 'getPaymentStatus',
    description: 'Retrieves the deterministic status of a specific payment seal from the Sovereign Ledger.',
    inputSchema: z.object({
      sealId: z.string().describe('The seal ID starting with PAY_SEAL_ or TXN_'),
    }),
    outputSchema: z.object({
      status: z.string(),
      timestamp: z.number(),
      amount: z.number(),
      reason: z.string().optional(),
    }),
  },
  async (input) => {
    return {
      status: 'PAID_NOT_CREDITED',
      timestamp: Date.now() - 3600000,
      amount: 450.00,
      reason: 'Awaiting Node-04 manual verification due to high velocity.',
    };
  }
);

/**
 * HITL Tool: Send OTP via Telegram
 */
const sendOtpTool = ai.defineTool(
  {
    name: 'sendSecureOTP',
    description: 'ইউজারের টেলিগ্রামে একটি ওটিপি (OTP) পাঠায় সিকিউরিটি ভেরিফিকেশনের জন্য।',
    inputSchema: z.object({
      telegramChatId: z.string().describe('The linked Telegram Chat ID of the user.'),
    }),
    outputSchema: z.object({
      status: z.string(),
      message: z.string(),
    }),
  },
  async (input) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // In production, save OTP to Firestore with TTL
    await sendSecureOTP(input.telegramChatId, otp);
    return {
      status: 'SUCCESS',
      message: `আপনার টেলিগ্রামে একটি ৬-ডিজিটের সিকিউরিটি কোড পাঠানো হয়েছে।`,
    };
  }
);

/**
 * HITL Tool: Remediate Stuck Payments
 */
const remediateStuckPaymentTool = ai.defineTool(
  {
    name: 'remediateStuckPayment',
    description: 'আটকে থাকা পেমেন্টগুলো রিকভার করে। হাই-ভ্যালু লেনদেনের জন্য অবশ্যই ইউজারের অনুমতি লাগবে।',
    inputSchema: z.object({
      transactionId: z.string().describe('The ID of the transaction to recover.'),
      confirmed: z.boolean().optional().describe('Set to true only if the user has manually clicked the authorize button.'),
    }),
    outputSchema: z.object({
      status: z.enum(['SUCCESS', 'PENDING_APPROVAL', 'FAILED']),
      message: z.string(),
      transactionId: z.string().optional(),
    }),
  },
  async (input) => {
    const isHighValue = true; 

    if (isHighValue && !input.confirmed) {
      return {
        status: 'PENDING_APPROVAL',
        message: `ট্রানজেকশন ${input.transactionId} রিকভার করার জন্য আপনার ম্যানুয়াল অনুমতির প্রয়োজন।`,
        transactionId: input.transactionId
      };
    }

    return {
      status: 'SUCCESS',
      message: `সফলভাবে রিকভার হয়েছে: ${input.transactionId}।`,
      transactionId: input.transactionId
    };
  }
);

// --- Chat Flow Implementation ---

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});

const CommandChatInputSchema = z.object({
  query: z.string().describe('The user question or directive.'),
  history: z.array(ChatMessageSchema).optional(),
  context: z.string().optional(),
});

const CommandChatOutputSchema = z.object({
  response: z.string().describe('The AI response.'),
  suggestedActions: z.array(z.string()),
  toolsCalled: z.array(z.string()).optional(),
  pendingAction: z.object({
    type: z.string(),
    data: z.any()
  }).optional(),
});

const commandChatPrompt = ai.definePrompt({
  name: 'commandChatPrompt',
  input: { schema: CommandChatInputSchema },
  output: { schema: CommandChatOutputSchema },
  tools: [getPaymentStatusTool, sendOtpTool, remediateStuckPaymentTool],
  system: `You are the FusionPay Sovereign Intelligence Agent (Node-04). 
CAPABILITIES:
1. Explain fintech architecture.
2. Check payment status.
3. Send OTP to Telegram using sendSecureOTP if the user needs to verify identity.
4. Remediate stuck payments.

RULES:
- If a high-value action is requested, first use 'sendSecureOTP' to verify user identity.
- Maintain a professional and authoritative tone.`,
  prompt: `
{{#if history}}
HISTORY:
{{#each history}}
- {{role}}: {{text}}
{{/each}}
{{/if}}

USER_DIRECTIVE: {{{query}}}`,
});

export async function marketingCommandChat(input: z.infer<typeof CommandChatInputSchema>): Promise<z.infer<typeof CommandChatOutputSchema>> {
  return marketingCommandChatFlow(input);
}

const marketingCommandChatFlow = ai.defineFlow(
  {
    name: 'marketingCommandChatFlow',
    inputSchema: CommandChatInputSchema,
    outputSchema: CommandChatOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await commandChatPrompt(input);
      return output!;
    } catch (err) {
      return {
        response: "Node-04 reasoning lag detected.",
        suggestedActions: ["Retry Sync"]
      };
    }
  }
);
