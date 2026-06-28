'use server';
/**
 * @fileOverview Civic Incident Analysis Flow.
 * Evaluates civic emergencies (floods, fires, etc.) and suggests deterministic response strategies.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IncidentInputSchema = z.object({
  type: z.enum(['FLOOD', 'SOS', 'FIRE', 'CIVIL_UNREST']),
  severity: z.number().min(1).max(5),
  location: z.string(),
  description: z.string().optional(),
});

const IncidentAnalysisOutputSchema = z.object({
  riskLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
  suggestedAction: z.string(),
  dispatchPriority: z.number(),
  automatedResponseEnabled: z.boolean(),
  estimatedImpactRadius: z.string(),
});

export async function analyzeCivicIncident(input: z.infer<typeof IncidentInputSchema>) {
  return civicIncidentAnalysisFlow(input);
}

const civicIncidentPrompt = ai.definePrompt({
  name: 'civicIncidentPrompt',
  input: { schema: IncidentInputSchema },
  output: { schema: IncidentAnalysisOutputSchema },
  prompt: `You are the SHURUKKHA-OS Civic Response Intelligence Agent.
Analyze the following incident report:

TYPE: {{{type}}}
SEVERITY: {{{severity}}} / 5
LOCATION: {{{location}}}
DESCRIPTION: {{{description}}}

1. Determine the overall Risk Level.
2. Suggest a specific response action (e.g., "Dispatch Drones to Sector 7", "Activate Flood Barriers").
3. Set a Dispatch Priority (1-10, 1 being highest).
4. Decide if automated response protocols should be engaged immediately.
5. Estimate the impact radius based on the incident type and severity.`,
});

const civicIncidentAnalysisFlow = ai.defineFlow(
  {
    name: 'civicIncidentAnalysisFlow',
    inputSchema: IncidentInputSchema,
    outputSchema: IncidentAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await civicIncidentPrompt(input);
    return output!;
  }
);
