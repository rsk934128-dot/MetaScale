'use server';
/**
 * @fileOverview Sovereign Forensic Intelligence Engine (Cognitive Layer).
 * Implements advanced reasoning over audit logs to determine Root Causes 
 * and match historical failure patterns.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AuditEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  node: z.string(),
  msg: z.string(),
  timestamp: z.number(),
  plane: z.string(),
});

const ForensicIntelligenceInputSchema = z.object({
  currentIncident: z.string().describe('The log message or error to analyze.'),
  historicalLogs: z.array(AuditEventSchema).describe('Past logs for pattern matching.'),
  context: z.string().optional().describe('Additional system context (e.g., Phase 4 Execution).'),
});

const ForensicIntelligenceOutputSchema = z.object({
  rootCauseAnalysis: z.string().describe('Detailed explanation of why the incident occurred.'),
  patternMatch: z.object({
    isRecurring: z.boolean(),
    pastOccurrenceId: z.string().optional(),
    similarityScore: z.number().min(0).max(100),
    historicalContext: z.string().optional(),
  }),
  riskLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
  recommendedStrategy: z.string().describe('Step-by-step autonomous or manual fix.'),
  confidenceIndex: z.number().min(0).max(100),
});

export async function runForensicCognition(input: z.infer<typeof ForensicIntelligenceInputSchema>) {
  return forensicIntelligenceFlow(input);
}

const cognitionPrompt = ai.definePrompt({
  name: 'cognitionPrompt',
  input: { schema: ForensicIntelligenceInputSchema },
  output: { schema: ForensicIntelligenceOutputSchema },
  prompt: `You are the Sovereign Forensic Intelligence Agent (Level 0 - Cognitive Layer).
Your mission is to perform Root Cause Analysis (RCA) on the current incident by cross-referencing it with the historical audit mesh.

CURRENT INCIDENT:
{{{currentIncident}}}

HISTORICAL MESH LOGS:
{{#each historicalLogs}}
- [{{id}}] {{plane}} | {{type}} | Node: {{node}} | {{msg}}
{{/each}}

SYSTEM CONTEXT: {{{context}}}

TASKS:
1. Identify the Root Cause: Why did this happen? (e.g., sequence of events, specific node drift, or external probe).
2. Pattern Matching: Search the historical logs for similar events. If a match is found, explain the similarity.
3. Assess Risk Level: Determine the severity based on potential impact on the Finance Plane.
4. Recommended Strategy: Provide a deterministic solution (e.g., "Rotate HMAC on Node-04", "Trigger Lock on Proxy-X").
5. Confidence Index: How certain are you of this analysis?

TONE: Authoritative, Technical, and Proactive.`,
});

const forensicIntelligenceFlow = ai.defineFlow(
  {
    name: 'forensicIntelligenceFlow',
    inputSchema: ForensicIntelligenceInputSchema,
    outputSchema: ForensicIntelligenceOutputSchema,
  },
  async (input) => {
    const { output } = await cognitionPrompt(input);
    return output!;
  }
);
