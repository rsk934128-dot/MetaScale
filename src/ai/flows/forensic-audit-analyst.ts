'use server';
/**
 * @fileOverview Forensic Audit Analyst Flow.
 * Implements RAG-like pattern analysis over the Sovereign Audit Mesh logs.
 * Identifies recurring failure patterns and infrastructure drift.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AuditLogSchema = z.object({
  id: z.string(),
  type: z.string(),
  node: z.string(),
  msg: z.string(),
  timestamp: z.number(),
  plane: z.string(),
});

const ForensicInputSchema = z.object({
  logs: z.array(AuditLogSchema).describe('The collection of historical audit logs to analyze.'),
  query: z.string().optional().describe('Specific concern or question about the audit history.'),
});

const ForensicOutputSchema = z.object({
  summary: z.string().describe('High-level summary of the audit mesh state.'),
  detectedPatterns: z.array(z.object({
    pattern: z.string(),
    frequency: z.string(),
    riskLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
    recommendation: z.string(),
  })),
  healthIndex: z.number().min(0).max(100).describe('Calculated health score of the mesh based on logs.'),
  isDriftDetected: z.boolean(),
  proactiveFixes: z.array(z.string()),
});

export async function analyzeForensicHistory(input: z.infer<typeof ForensicInputSchema>) {
  return forensicAuditAnalystFlow(input);
}

const forensicPrompt = ai.definePrompt({
  name: 'forensicPrompt',
  input: { schema: ForensicInputSchema },
  output: { schema: ForensicOutputSchema },
  prompt: `You are the Sovereign Forensic Intelligence Agent (Level 0).
Your mission is to analyze the historical audit logs of the Sovereign OS to find hidden patterns, recurring failures, and security drift.

CONTEXT:
Historical Logs:
{{#each logs}}
- [{{id}}] {{plane}} | {{type}} | Node: {{node}} | {{msg}}
{{/each}}

USER QUERY: {{{query}}}

TASKS:
1. Scan for recurring failure modes (e.g., specific nodes failing HMAC checks multiple times).
2. Calculate a Health Index (0-100) based on critical vs info logs.
3. Detect "Infrastructure Drift" - signs that the system is moving away from its deterministic state.
4. Suggest 3 proactive fixes to prevent future incidents.
5. Provide a summary in a professional, authoritative tone.`,
});

const forensicAuditAnalystFlow = ai.defineFlow(
  {
    name: 'forensicAuditAnalystFlow',
    inputSchema: ForensicInputSchema,
    outputSchema: ForensicOutputSchema,
  },
  async (input) => {
    const { output } = await forensicPrompt(input);
    return output!;
  }
);
