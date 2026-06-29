'use server';
/**
 * @fileOverview A flow to simulate autonomous agent decision making.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AgentExecutionInputSchema = z.object({
  agentRole: z.string(),
  currentMetrics: z.record(z.any()),
  governanceLimits: z.string(),
});

const AgentExecutionOutputSchema = z.object({
  actionTaken: z.string(),
  reasoning: z.string(),
  isApprovalRequired: z.boolean(),
  impactForecast: z.string(),
});

export async function executeAgentLogic(input: z.infer<typeof AgentExecutionInputSchema>) {
  return agentExecutionFlow(input);
}

const agentPrompt = ai.definePrompt({
  name: 'agentPrompt',
  input: { schema: z.object({
    agentRole: z.string(),
    metricsText: z.string(),
    governanceLimits: z.string(),
  }) },
  output: { schema: AgentExecutionOutputSchema },
  prompt: `You are the AMOS Autonomous Agent (Role: {{{agentRole}}}).
CURRENT METRICS:
{{{metricsText}}}

GOVERNANCE: {{{governanceLimits}}}

Decide on a high-impact action. Determine if it requires human approval based on governance.`,
});

const agentExecutionFlow = ai.defineFlow(
  {
    name: 'agentExecutionFlow',
    inputSchema: AgentExecutionInputSchema,
    outputSchema: AgentExecutionOutputSchema,
  },
  async (input) => {
    const metricsText = JSON.stringify(input.currentMetrics, null, 2);
    const { output } = await agentPrompt({
      agentRole: input.agentRole,
      metricsText,
      governanceLimits: input.governanceLimits,
    });
    return output!;
  }
);
