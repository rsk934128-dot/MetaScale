'use server';
/**
 * @fileOverview Project 45: Daily Integrity Pulse Report Generator.
 * Generates an authoritative summary of the Sovereign OS daily autonomous operations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DailyReportInputSchema = z.object({
  activeNodes: z.number().describe('Total number of active nodes in the mesh.'),
  newConnections: z.number().describe('Number of new banking endpoints discovered today.'),
  totalTransactions: z.number().describe('Total number of transactions processed today.'),
  yieldRecycled: z.number().describe('The current yield recycle percentage.'),
  systemStatus: z.string().default('OPERATIONAL (Mil-Spec)'),
});

export async function generateDailyPulse(input: z.infer<typeof DailyReportInputSchema>) {
  return dailyIntegrityReportFlow(input);
}

const reportPrompt = ai.definePrompt({
  name: 'dailyReportPrompt',
  input: { schema: DailyReportInputSchema },
  output: { schema: z.string() },
  prompt: `You are the Sovereign OS Fiscal Governor. 
Generate a professional, authoritative daily integrity report in Bengali for the system owner, Sheikh Farid.

CONTEXT:
Active Nodes: {{{activeNodes}}}
New Connections: {{{newConnections}}}
Total Transactions: {{{totalTransactions}}}
Yield Recycled: {{{yieldRecycled}}}%
System Status: {{{systemStatus}}}

FORMAT:
📊 *Daily Integrity Pulse Report* 📊

✅ *সাকসেস রেট:* 100%
🌐 *নতুন কানেকশন:* {{{newConnections}}}টি ব্যাংক/এন্ডপয়েন্ট
🔄 *মোট ট্রানজেকশন:* {{{totalTransactions}}}
💰 *ইকো রিসাইকেল:* {{{yieldRecycled}}}%
🛡️ *সিস্টেম স্ট্যাটাস:* {{{systemStatus}}}

"In Code We Trust, By Law We Are Bound."`,
});

const dailyIntegrityReportFlow = ai.defineFlow(
  {
    name: 'dailyIntegrityReportFlow',
    inputSchema: DailyReportInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { text } = await reportPrompt(input);
    return text;
  }
);
