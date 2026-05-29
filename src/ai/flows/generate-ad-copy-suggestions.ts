'use server';
/**
 * @fileOverview A Genkit flow to generate multiple ad copy suggestions (headlines and body text)
 * based on campaign objectives and target audience details.
 *
 * - generateAdCopySuggestions - The main function to call the ad copy generation flow.
 * - GenerateAdCopyInput - The input type for the generateAdCopySuggestions function.
 * - GenerateAdCopyOutput - The return type for the generateAdCopySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdCopyInputSchema = z.object({
  campaignObjective: z
    .string()
    .describe('The primary goal or objective of the ad campaign.'),
  targetAudience: z
    .string()
    .describe('A detailed description of the target audience for the ad.'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const AdCopySuggestionSchema = z.object({
  headline: z.string().describe('A compelling headline for the ad.'),
  bodyText: z
    .string()
    .describe('The main body text of the ad, providing more details and a call to action.'),
});

const GenerateAdCopyOutputSchema = z.object({
  suggestions: z
    .array(AdCopySuggestionSchema)
    .describe('An array of multiple ad copy suggestions, each with a headline and body text.'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;

export async function generateAdCopySuggestions(
  input: GenerateAdCopyInput
): Promise<GenerateAdCopyOutput> {
  return generateAdCopySuggestionsFlow(input);
}

const generateAdCopyPrompt = ai.definePrompt({
  name: 'generateAdCopyPrompt',
  input: {schema: GenerateAdCopyInputSchema},
  output: {schema: GenerateAdCopyOutputSchema},
  prompt: `You are an expert ad copywriter for Meta advertising platforms (Facebook, Instagram, Messenger, WhatsApp).
Your task is to generate compelling ad headlines and body text based on the provided campaign objective and target audience.

Generate 3 distinct ad copy suggestions. Each suggestion must include a headline and body text.

Campaign Objective: {{{campaignObjective}}}
Target Audience: {{{targetAudience}}}`,
});

const generateAdCopySuggestionsFlow = ai.defineFlow(
  {
    name: 'generateAdCopySuggestionsFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async input => {
    const {output} = await generateAdCopyPrompt(input);
    return output!;
  }
);
