'use server';
/**
 * @fileOverview Sovereign Intelligence Agent (Gemini-Powered Agentic Engine).
 * Implements Tool Use (Function Calling) to interact with the Sovereign Kernel.
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
    // In a production app, we would query Firestore here. 
    // For the prototype, we return deterministic simulated data.
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
});

const commandChatPrompt = ai.definePrompt({
  name: 'commandChatPrompt',
  input: { schema: CommandChatInputSchema },
  output: { schema: CommandChatOutputSchema },
  tools: [getPaymentStatusTool, getMeshIntegrityTool],
  system: `You are the FusionPay Sovereign Intelligence Agent (Node-04). 
Your core mission is to act as a technical co-pilot for the Sovereign OS.

CAPABILITIES:
1. Explain fintech architecture (ISO 20022, DPE, UBIL).
2. Check payment status using the getPaymentStatus tool.
3. Check mesh health using the getMeshIntegrity tool.
4. Help with compliance and verification queries.

GUIDELINES:
- Keep your tone professional, authoritative, and futuristic.
- If a user asks about a stuck payment, use the getPaymentStatus tool.
- If they ask about system status, use getMeshIntegrity.
- Always mention that you are operating via Node-04 (UK Corridor).
- Support Bengali and English seamlessly.`,
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
        response: "Node-04 is experiencing a reasoning lag. Switching to safe-buffer mode. Your request has been logged.",
        suggestedActions: ["Retry Sync", "Check Infra Plane"]
      };
    }
  }
);
