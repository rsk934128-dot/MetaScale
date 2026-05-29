'use server';
/**
 * @fileOverview This file implements a Genkit flow for the Targeting Intelligence Tool.
 * It analyzes campaign objectives and existing ad set configurations to provide AI-powered
 * suggestions for refining audience demographics and optimizing budget allocations.
 *
 * - suggestTargetingOptimizations - The main function to call for optimizing ad targeting.
 * - SuggestTargetingOptimizationsInput - The input type for the suggestTargetingOptimizations function.
 * - SuggestTargetingOptimizationsOutput - The return type for the suggestTargetingOptimizations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestTargetingOptimizationsInputSchema = z.object({
  campaignObjective: z
    .string()
    .describe(
      'The primary objective of the advertising campaign, e.g., "drive Page post engagement", "generate leads".'
    ),
  existingAdSets: z
    .array(
      z.object({
        name: z.string().describe('The name or identifier of the ad set.'),
        targetAudienceDescription: z
          .string()
          .describe(
            'A detailed description of the current target audience for this ad set (e.g., "Males, 25-34, interested in sports cars, living in California").'
          ),
        budget: z
          .number()
          .describe('The current budget allocated to this ad set in USD.'),
        schedule: z
          .string()
          .describe(
            'The current schedule or duration for which this ad set is configured to run (e.g., "runs for 2 weeks from May 1st", "always on").'
          ),
      })
    )
    .describe(
      'An array of existing ad set configurations, each detailing its current targeting and budget.'
    ),
});

export type SuggestTargetingOptimizationsInput = z.infer<
  typeof SuggestTargetingOptimizationsInputSchema
>;

const SuggestTargetingOptimizationsOutputSchema = z.object({
  overallRecommendations: z
    .string()
    .describe(
      'General strategic recommendations for the campaign to maximize overall ad performance and achieve the campaign objective.'
    ),
  adSetOptimizations: z
    .array(
      z.object({
        adSetName: z
          .string()
          .describe('The name of the ad set to which these optimizations apply.'),
        audienceSuggestions: z
          .array(z.string())
          .describe(
            'Specific, actionable suggestions for refining the target audience demographics for this ad set (e.g., "Narrow age range to 28-32", "Add interest: luxury watches", "Exclude users who have already purchased").'
          ),
        budgetSuggestions: z
          .string()
          .describe(
            'Specific, actionable suggestions for optimizing budget allocation for this ad set (e.g., "Increase budget by 15% for the first week", "Reallocate 10% from Ad Set X to this ad set due to higher potential CTR", "Consider A/B testing a lower budget with a hyper-targeted audience").'
          ),
      })
    )
    .describe(
      'An array of detailed optimization suggestions, one for each provided ad set.'
    ),
});

export type SuggestTargetingOptimizationsOutput = z.infer<
  typeof SuggestTargetingOptimizationsOutputSchema
>;

export async function suggestTargetingOptimizations(
  input: SuggestTargetingOptimizationsInput
): Promise<SuggestTargetingOptimizationsOutput> {
  return suggestTargetingOptimizationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTargetingOptimizationsPrompt',
  input: { schema: SuggestTargetingOptimizationsInputSchema },
  output: { schema: SuggestTargetingOptimizationsOutputSchema },
  prompt: `You are an expert marketing strategist and an AI-powered Targeting Intelligence Tool for Meta advertising. Your goal is to analyze the provided campaign objective and existing ad set configurations to generate actionable suggestions for refining audience demographics and optimizing budget allocations. This should help maximize ad performance and achieve the campaign objective.\n\nCampaign Objective: {{{campaignObjective}}}\n\nExisting Ad Sets:\n{{#each existingAdSets}}\n--- Ad Set: {{{name}}} ---\n  Current Target Audience Description: {{{targetAudienceDescription}}}\n  Current Budget: ${{{budget}}}\n  Current Schedule: {{{schedule}}}\n{{/each}}\n\nBased on the campaign objective and the details of each existing ad set, provide:\n1.  Overall strategic recommendations for the entire campaign.\n2.  Specific, actionable suggestions for each ad set to refine audience demographics and optimize budget allocations. Be creative and precise in your suggestions. Consider market trends, best practices for the given objective, and potential areas for A/B testing or reallocation.\n`,
});

const suggestTargetingOptimizationsFlow = ai.defineFlow(
  {
    name: 'suggestTargetingOptimizationsFlow',
    inputSchema: SuggestTargetingOptimizationsInputSchema,
    outputSchema: SuggestTargetingOptimizationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
