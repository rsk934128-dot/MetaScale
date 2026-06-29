
'use server';
/**
 * @fileOverview Predictive Compliance & Self-Healing Engine.
 * Analyzes historical documentation trends and jurisdictional changes to predict future compliance gaps
 * and suggests automated remediation steps.
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
  activeBlocks: z.array(z.string()).optional(),
});

const PredictiveComplianceOutputSchema = z.object({
  predictedFailures: z.array(z.object({
    type: z.string(),
    estimatedFailureDate: z.string(),
    probability: z.number(),
    reason: z.string(),
    remediationSteps: z.array(z.string()),
  })),
  regulatoryDriftScore: z.number().describe('Score 0-100 indicating jurisdictional change risk.'),
  automatedRemediationPlan: z.array(z.object({
    blockId: z.string(),
    fix: z.string(),
    eta: z.string(),
  })),
  policyAdaptationSuggestions: z.array(z.string()),
});

const compliancePredictorPrompt = ai.definePrompt({
  name: 'compliancePredictorPrompt',
  input: { schema: PredictiveComplianceInputSchema },
  output: { schema: PredictiveComplianceOutputSchema },
  prompt: `You are the SEIP Regulatory Intelligence & Self-Healing Agent.
Analyze the entity's documentation and active enforcement blocks for jurisdiction: {{{jurisdiction}}}.

CURRENT DOCUMENTS:
{{#each currentDocuments}}
- {{type}}: Status {{status}}, Expiry {{expiryDate}}
{{/each}}

ACTIVE BLOCKS:
{{#each activeBlocks}}
- {{this}}
{{/each}}

1. Predict potential compliance failures and provide step-by-step remediation plans.
2. For active blocks, suggest automated fixes and estimated time to restore compliance.
3. Suggest adaptive policy updates (IF-THEN rules) to prevent future drift in {{{jurisdiction}}}.`,
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

export async function predictComplianceRisk(input: z.infer<typeof PredictiveComplianceInputSchema>) {
  return predictiveComplianceFlow(input);
}
