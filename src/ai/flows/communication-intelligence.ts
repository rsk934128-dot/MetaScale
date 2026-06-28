
'use server';
/**
 * @fileOverview Communication Intelligence Flow.
 * Extracts operational intelligence from emails and alerts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CommInputSchema = z.object({
  emailBody: z.string().describe('The content of the email or communication.'),
  sender: z.string().describe('Originating address.'),
});

const CommOutputSchema = z.object({
  threatLevel: z.enum(['NONE', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
  operationalSummary: z.string().describe('Actionable summary of the message.'),
  suggestedKernelAction: z.string().optional().describe('System command suggested by AI.'),
  priority: z.number().min(1).max(10),
  requiresHumanReview: z.boolean(),
});

export async function analyzeCommunication(input: z.infer<typeof CommInputSchema>) {
  return commIntelligenceFlow(input);
}

const commIntelligencePrompt = ai.definePrompt({
  name: 'commIntelligencePrompt',
  input: { schema: CommInputSchema },
  output: { schema: CommOutputSchema },
  prompt: `You are the SHURUKKHA-OS Communication Intelligence Agent.
Analyze the following incoming communication for mission-critical insights:

FROM: {{{sender}}}
CONTENT:
{{{emailBody}}}

1. Determine the Threat Level based on operational keywords.
2. Provide a concise Operational Summary.
3. Suggest a Kernel Action if this requires system-level changes (e.g., "Trigger Lockdown", "Update Node P180").
4. Assign a Priority (1 highest).
5. Determine if Human Review is required based on sensitive data presence.`,
});

const commIntelligenceFlow = ai.defineFlow(
  {
    name: 'commIntelligenceFlow',
    inputSchema: CommInputSchema,
    outputSchema: CommOutputSchema,
  },
  async (input) => {
    const { output } = await commIntelligencePrompt(input);
    return output!;
  }
);
