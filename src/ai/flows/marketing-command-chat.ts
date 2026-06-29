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
  system: "You are the Sovereign OS Intelligence Engine. You operate under Project 45 Eco Governance standards. Use the provided context and history to give deterministic, strategic advice.",
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

Provide a detailed response, relevant data points if available in context, and 2-3 specific "suggestedActions" the user can take.`,
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
          response: "I'm sorry, I encountered a reasoning block. Please rephrase your query.",
          suggestedActions: ["Retry Query", "Check System Status"]
        };
      }
      return output;
    } catch (err) {
      console.error("Chat Flow Error:", err);
      return {
        response: "The Sovereign AI node is currently unreachable. Error tracing Node-04.",
        suggestedActions: ["Check Connectivity", "Refresh Kernel"]
      };
    }
  }
);
