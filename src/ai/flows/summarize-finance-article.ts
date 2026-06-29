
'use server';
/**
 * @fileOverview AI Article Summarizer for financial news.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeArticleInputSchema = z.object({
  articleContent: z.string().describe('The text or URL content of the financial news article.'),
});

const SummarizeArticleOutputSchema = z.object({
  title: z.string(),
  summary: z.string(),
  keyTakeaways: z.array(z.string()),
  marketImpact: z.string().describe('Potential impact on specific sectors or tickers.'),
  readTime: z.string(),
});

export async function summarizeFinanceArticle(input: z.infer<typeof SummarizeArticleInputSchema>) {
  return summarizeArticleFlow(input);
}

const summaryPrompt = ai.definePrompt({
  name: 'summaryPrompt',
  input: { schema: SummarizeArticleInputSchema },
  output: { schema: SummarizeArticleOutputSchema },
  prompt: `You are an expert financial journalist. Summarize the following news article for a busy investor.

ARTICLE CONTENT:
{{{articleContent}}}

1. Create a catchy title.
2. Provide a 3-sentence executive summary.
3. List 4 key takeaways.
4. Explain the potential market impact.
5. Estimate read time in minutes.`,
});

const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async (input) => {
    const { output } = await summaryPrompt(input);
    return output!;
  }
);
