'use server';
/**
 * @fileOverview Revenue Intelligence flow for EGIOS.
 * Forecasts revenue, pipeline health, and CAC/LTV ratios.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RevenueInputSchema = z.object({
  currentPipeline: z.number().describe('Total value of active sales pipeline.'),
  historicalConversionRate: z.number().describe('Historical close rate from pipeline to revenue.'),
  marketingSpend: z.number().describe('Total marketing spend for the period.'),
  timeframeDays: z.number().default(30),
});

const RevenueOutputSchema = z.object({
  forecastedRevenue: z.number(),
  predictedCAC: z.number().describe('Estimated Customer Acquisition Cost.'),
  predictedLTV: z.number().describe('Estimated Lifetime Value based on segment trends.'),
  riskAssessment: z.string().describe('Potential risks to revenue targets.'),
  strategicRecommendation: z.string(),
});

export async function getRevenueIntelligence(input: z.infer<typeof RevenueInputSchema>) {
  return revenueIntelligenceFlow(input);
}

const revenuePrompt = ai.definePrompt({
  name: 'revenuePrompt',
  input: { schema: RevenueInputSchema },
  output: { schema: RevenueOutputSchema },
  prompt: `You are the EGIOS Revenue Operations Agent.
Analyze the following financial and marketing data to forecast revenue and efficiency metrics:
Pipeline: {{{currentPipeline}}}
Conversion Rate: {{{historicalConversionRate}}}
Marketing Spend: {{{marketingSpend}}}
Timeframe: {{{timeframeDays}}} days

Provide a precise forecast, LTV/CAC projection, and a strategic action plan to improve profitability.`,
});

const revenueIntelligenceFlow = ai.defineFlow(
  {
    name: 'revenueIntelligenceFlow',
    inputSchema: RevenueInputSchema,
    outputSchema: RevenueOutputSchema,
  },
  async (input) => {
    const { output } = await revenuePrompt(input);
    return output!;
  }
);
