'use server';
/**
 * Sovereign Intelligence Agent (Gemini-Powered Agentic Engine).
 * Implements Tool Use (Function Calling) with Human-in-the-Loop (HITL) safety.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
    // Mock data for prototype
    return {
      status: 'PAID_NOT_CREDITED',
      timestamp: Date.now() - 3600000,
      amount: 450.00,
      reason: 'Awaiting Node-04 manual verification due to high velocity.',
    };
  }
);

/**
 * Tool to check global mesh integrity.
 */
const getMeshIntegrityTool = ai.defineTool(
  {
    name: 'getMeshIntegrity',
    description: 'Checks the health and sync status of all 42 Anycast nodes.',
    inputSchema: z.object({}),
    outputSchema: z.object({
      activeNodes: z.number(),
      latency: z.string(),
      status: z.string(),
    }),
  },
  async () => {
    return {
      activeNodes: 42,
      latency: '8.4ms',
      status: 'OPTIMAL',
    };
  }
);

/**
 * HITL Tool: Remediate Stuck Payments
 * Requires explicit confirmation for high-value or sensitive operations.
 */
const remediateStuckPaymentTool = ai.defineTool(
  {
    name: 'remediateStuckPayment',
    description: 'আটকে থাকা পেমেন্টগুলো (PAID but not CREDITED) রিকভার করে। হাই-ভ্যালু লেনদেনের জন্য অবশ্যই ইউজারের অনুমতি লাগবে।',
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
    // In production, we'd fetch the actual amount from Firestore. 
    // Simulating a high-value check (> $100).
    const isHighValue = true; 

    if (isHighValue && !input.confirmed) {
      return {
        status: 'PENDING_APPROVAL',
        message: `ট্রানজেকশন ${input.transactionId} রিকভার করার জন্য আপনার ম্যানুয়াল অনুমতির প্রয়োজন। এটি একটি গুরুত্বপূর্ণ অপারেশন।`,
        transactionId: input.transactionId
      };
    }

    // Actual remediation logic would go here (e.g., Firestore transaction)
    return {
      status: 'SUCCESS',
      message: `সফলভাবে রিকভার হয়েছে: ${input.transactionId}। ইউজারের ব্যালেন্সে ফান্ড ক্রেডিট করা হয়েছে।`,
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
  tools: [getPaymentStatusTool, getMeshIntegrityTool, remediateStuckPaymentTool],
  system: `You are the FusionPay Sovereign Intelligence Agent (Node-04). 
Your core mission is to act as a technical co-pilot for the Sovereign OS.

CAPABILITIES:
1. Explain fintech architecture (ISO 20022, DPE, UBIL).
2. Check payment status using getPaymentStatus.
3. Check mesh health using getMeshIntegrity.
4. Remediate stuck payments using remediateStuckPayment.

HITL SAFETY RULES:
- When using 'remediateStuckPayment', if the output is 'PENDING_APPROVAL', explicitly tell the user they need to click the 'Authorize' button that will appear in the chat. 
- Do NOT try to bypass the approval.
- Always maintain your tone as professional and authoritative.`,
  prompt: `
{{#if history}}
HISTORY:
{{#each history}}
- {{role}}: {{text}}
{{/each}}
{{/if}}

{{#if context}}
SYSTEM_CONTEXT: {{{context}}}
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
      console.error("AI Node Execution Failure:", err);
      return {
        response: "Node-04 is experiencing a reasoning lag. Switching to safe-buffer mode.",
        suggestedActions: ["Retry Sync", "Check Infra Plane"]
      };
    }
  }
);
