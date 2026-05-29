
'use server';
/**
 * @fileOverview A Genkit flow to analyze marketing documents (PDFs, briefs, strategies)
 * synced from Google Drive to extract key insights and campaign ideas.
 *
 * - analyzeMarketingDoc - Function to handle document intelligence.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeDocInputSchema = z.object({
  docContent: z.string().describe('The textual content of the marketing document.'),
  docName: z.string().optional().describe('The name of the document.'),
});
export type AnalyzeDocInput = z.infer<typeof AnalyzeDocInputSchema>;

const AnalyzeDocOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the document goals.'),
  targetAudience: z.array(z.string()).describe('Identified target audience segments.'),
  suggestedCampaigns: z.array(z.object({
    title: z.string(),
    strategy: z.string(),
  })).describe('Actionable campaign ideas based on the doc.'),
  kpis: z.array(z.string()).describe('Key performance indicators mentioned or inferred.'),
});
export type AnalyzeDocOutput = z.infer<typeof AnalyzeDocOutputSchema>;

export async function analyzeMarketingDoc(input: AnalyzeDocInput): Promise<AnalyzeDocOutput> {
  return analyzeMarketingDocFlow(input);
}

const analyzeDocPrompt = ai.definePrompt({
  name: 'analyzeDocPrompt',
  input: { schema: AnalyzeDocInputSchema },
  output: { schema: AnalyzeDocOutputSchema },
  prompt: `You are an expert marketing strategist. Analyze the following document and provide strategic insights for a multi-platform ad campaign.

Document Name: {{{docName}}}
Content:
{{{docContent}}}

Identify the core objective, target audience, and provide 3 specific campaign ideas.`,
});

const analyzeMarketingDocFlow = ai.defineFlow(
  {
    name: 'analyzeMarketingDocFlow',
    inputSchema: AnalyzeDocInputSchema,
    outputSchema: AnalyzeDocOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeDocPrompt(input);
    return output!;
  }
);
