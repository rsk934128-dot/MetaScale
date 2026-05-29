
'use server';
/**
 * @fileOverview Predictive Compliance Engine.
 * Analyzes historical documentation trends and jurisdictional changes to predict future compliance gaps.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictiveComplianceInputSchema = z.object({
  entityId: z.string(),
  currentDocuments: z.array(z.object({
    type: z.string(),
    expiryDate: z.string(),
    status: z.string(),
  })),
  jurisdiction: z.string(),
});

const PredictiveComplianceOutputSchema = z.object({
  predictedFailures: z.array(z.object({
    type: z.string(),
    estimatedFailureDate: z.string(),
    probability: z.number(),
    reason: z.string(),
  })),
  regulatoryDriftScore: z.number().describe('Score 0-100 indicating jurisdictional change risk.'),
  automatedRecommendations: z.array(z.string()),
});

export async function predictComplianceRisk(input: z.infer<typeof PredictiveComplianceInputSchema>) {
  return predictiveComplianceFlow(input);
}

const compliancePredictorPrompt = ai.definePrompt({
  name: 'compliancePredictorPrompt',
  input: { schema: PredictiveComplianceInputSchema },
  output: { schema: PredictiveComplianceOutputSchema },
  prompt: `You are the SEIP Regulatory Intelligence Agent.
Analyze the entity's documentation for jurisdiction: {{{jurisdiction}}}.

CURRENT DOCUMENTS:
{{#each currentDocuments}}
- {{type}}: Status {{status}}, Expiry {{expiryDate}}
{{/each}}

Predict potential compliance failures based on expiry dates and common jurisdictional regulatory updates. 
Identify documents likely to be requested next based on enterprise scaling in {{{jurisdiction}}}.`,
});

const predictiveComplianceFlow = ai.defineFlow(
  {
    name: 'predictiveComplianceFlow',
    inputSchema: PredictiveComplianceInputSchema,
    outputSchema: PredictiveComplianceOutputSchema,
  },
  async (input) => {
    const { output } = await compliancePredictorPrompt(input);
    return output!;
  }
);
