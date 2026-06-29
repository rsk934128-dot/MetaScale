
'use server';
/**
 * @fileOverview AI Financial Analyst for stock and crypto tickers.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StockAnalysisInputSchema = z.object({
  ticker: z.string().describe('The stock or crypto ticker symbol (e.g., AAPL, BTC).'),
});

const StockAnalysisOutputSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  sentiment: z.enum(['BULLISH', 'NEUTRAL', 'BEARISH']),
  summary: z.string().describe('A concise explanation of current performance.'),
  riskScore: z.number().min(0).max(100).describe('0-100 risk assessment.'),
  recommendation: z.string(),
  keyMetrics: z.array(z.object({
    label: z.string(),
    value: z.string()
  })),
});

export async function analyzeStockTicker(input: z.infer<typeof StockAnalysisInputSchema>) {
  return analyzeStockTickerFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analysisPrompt',
  input: { schema: StockAnalysisInputSchema },
  output: { schema: StockAnalysisOutputSchema },
  prompt: `You are the FusionPay AI Financial Analyst. 
Analyze the current market sentiment and performance for the ticker: {{{ticker}}}.

Provide:
1. Sentiment (BULLISH, NEUTRAL, BEARISH).
2. A summary of recent news and price action.
3. A risk score from 0-100.
4. Actionable recommendation for a smart investor.
5. 3 key hypothetical metrics (P/E, Volatility, Market Cap) for context.`,
});

const analyzeStockTickerFlow = ai.defineFlow(
  {
    name: 'analyzeStockTickerFlow',
    inputSchema: StockAnalysisInputSchema,
    outputSchema: StockAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
