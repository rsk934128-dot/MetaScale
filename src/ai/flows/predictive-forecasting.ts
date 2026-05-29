
'use server';
/**
 * @fileOverview A flow to generate predictive performance forecasts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ForecastInputSchema = z.object({
  historicalSpend: z.number(),
  historicalRevenue: z.number(),
  marketTrendFactor: z.number().describe('A factor representing current market growth (e.g., 1.2 for 20% growth).'),
});

const ForecastOutputSchema = z.object({
  predictedROAS: z.number(),
  predictedRevenue: z.number(),
  confidenceInterval: z.number(),
  suggestedBudgetAdjustment: z.string(),
});

export async function getPerformanceForecast(input: z.infer<typeof ForecastInputSchema>) {
  return performanceForecastFlow(input);
}

const forecastPrompt = ai.definePrompt({
  name: 'forecastPrompt',
  input: { schema: ForecastInputSchema },
  output: { schema: ForecastOutputSchema },
  prompt: `As the AMOS Predictive Analytics Agent, forecast the next 30 days based on:
Historical Spend: {{{historicalSpend}}}
Historical Revenue: {{{historicalRevenue}}}
Market Factor: {{{marketTrendFactor}}}

Provide a precise ROAS prediction and a strategic budget adjustment recommendation.`,
});

const performanceForecastFlow = ai.defineFlow(
  {
    name: 'performanceForecastFlow',
    inputSchema: ForecastInputSchema,
    outputSchema: ForecastOutputSchema,
  },
  async (input) => {
    const { output } = await forecastPrompt(input);
    return output!;
  }
);
