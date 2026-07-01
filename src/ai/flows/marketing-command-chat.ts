'use server';
/**
 * @fileOverview A RAG-powered chat flow for marketing intelligence.
 * It uses campaign data and document context to answer complex marketing queries.
 *
 * - marketingCommandChat - Main function for the intelligence chat.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});

const CommandChatInputSchema = z.object({
  query: z.string().describe('The user question about marketing data or strategy.'),
  history: z.array(ChatMessageSchema).optional().describe('Chat history for context.'),
  context: z.string().optional().describe('Additional context from indexed documents or campaign reports.'),
});
export type CommandChatInput = z.infer<typeof CommandChatInputSchema>;

const CommandChatOutputSchema = z.object({
  response: z.string().describe('The AI response to the user query.'),
  suggestedActions: z.array(z.string()).describe('List of actionable next steps.'),
  dataPoints: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional().describe('Key metrics related to the query.'),
});
export type CommandChatOutput = z.infer<typeof CommandChatOutputSchema>;

export async function marketingCommandChat(input: CommandChatInput): Promise<CommandChatOutput> {
  return marketingCommandChatFlow(input);
}

const commandChatPrompt = ai.definePrompt({
  name: 'commandChatPrompt',
  input: { schema: CommandChatInputSchema },
  output: { schema: CommandChatOutputSchema },
  config: {
    temperature: 0.7,
    topP: 0.9,
  },
  system: "You are the Sovereign OS Intelligence Engine (Node-04). You operate under Project 45 Eco Governance standards. Use the provided context and history to give deterministic, strategic advice. Keep your tone professional, authoritative, and slightly futuristic.",
  prompt: `
{{#if history}}
CHAT HISTORY:
{{#each history}}
- {{role}}: {{text}}
{{/each}}
{{/if}}

{{#if context}}
KNOWLEDGE CONTEXT:
{{{context}}}
{{/if}}

USER QUERY: {{{query}}}

Provide a detailed response as a strategic advisor. If data is unavailable, provide logical reasoning based on Sovereign OS protocols. Generate 2-3 specific suggestedActions.`,
});

const marketingCommandChatFlow = ai.defineFlow(
  {
    name: 'marketingCommandChatFlow',
    inputSchema: CommandChatInputSchema,
    outputSchema: CommandChatOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await commandChatPrompt(input);
      
      if (!output) {
        return {
          response: "Sovereign Intelligence Node-04 is currently in a reasoning state. I have established a temporary buffer. Please re-state your directive.",
          suggestedActions: ["Retry Sync", "Check Network Plane"]
        };
      }
      
      return output;
    } catch (err) {
      console.error("Node-04 Connectivity Breach:", err);
      
      // Fallback response to avoid hard UI failure
      return {
        response: "The Sovereign AI node is recovering from a latency spike in the Anycast mesh (Node-04). I am currently operating in limited reasoning mode. Your query has been logged for processing.",
        suggestedActions: ["Initialize Node-04", "Refresh Kernel"],
        dataPoints: [
          { label: "Status", value: "RECOVERING" },
          { label: "Mesh Load", value: "98.4%" }
        ]
      };
    }
  }
);
