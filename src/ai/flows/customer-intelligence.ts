'use server';
/**
 * @fileOverview Customer Intelligence flow for EGIOS.
 * Predicts churn risks and identifies high-value segments.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CustomerInputSchema = z.object({
  customerData: z.array(z.object({
    id: z.string(),
    lastInteractionDays: z.number(),
    totalSpent: z.number(),
    supportTickets: z.number(),
  })),
});

const CustomerOutputSchema = z.object({
  churnRiskAnalysis: z.array(z.object({
    customerId: z.string(),
    riskScore: z.number().min(0).max(1),
    reason: z.string(),
  })),
  segmentOpportunities: z.array(z.object({
    segmentName: z.string(),
    growthPotential: z.string(),
    actionableInsight: z.string(),
  })),
});

export async function analyzeCustomerIntelligence(input: z.infer<typeof CustomerInputSchema>) {
  return customerIntelligenceFlow(input);
}

const customerPrompt = ai.definePrompt({
  name: 'customerPrompt',
  input: { schema: CustomerInputSchema },
  output: { schema: CustomerOutputSchema },
  prompt: `You are the EGIOS Customer Intelligence Agent.
Analyze the provided customer behavioral data to identify churn risks and high-growth segments.

Customer Profiles:
{{#each customerData}}
- ID: {{id}}, Last Interaction: {{lastInteractionDays}} days, Spent: \${{totalSpent}}, Tickets: {{supportTickets}}
{{/each}}

Identify the top 3 churn risks and 2 major growth opportunities in the existing base.`,
});

const customerIntelligenceFlow = ai.defineFlow(
  {
    name: 'customerIntelligenceFlow',
    inputSchema: CustomerInputSchema,
    outputSchema: CustomerOutputSchema,
  },
  async (input) => {
    const { output } = await customerPrompt(input);
    return output!;
  }
);
