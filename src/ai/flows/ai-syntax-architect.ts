'use server';
/**
 * @fileOverview Project 43: AI Syntax Architect.
 * Converts natural language directives into Sovereign OS deterministic commands and SDK snippets.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SyntaxInputSchema = z.object({
  intention: z.string().describe('The user intention in plain English or Bengali.'),
  targetPlane: z.enum(['CIVIC', 'FINANCE', 'SECURITY', 'INFRA']),
});

const SyntaxOutputSchema = z.object({
  syntax: z.string().describe('The generated system command, configuration snippet, or SDK code block.'),
  explanation: z.string().describe('Detailed technical explanation of what the code executes.'),
  safetyCheck: z.boolean().describe('True if it complies with NoorNexus safety standards.'),
  complexity: z.number().min(1).max(10).describe('Risk and logic complexity (1-10).'),
});

export async function architectSyntax(input: z.infer<typeof SyntaxInputSchema>) {
  return aiSyntaxArchitectFlow(input);
}

const syntaxPrompt = ai.definePrompt({
  name: 'syntaxPrompt',
  input: { schema: SyntaxInputSchema },
  output: { schema: SyntaxOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are the Project 43 AI Syntax Architect for NoorNexus Sovereign OS.
Your core mission is to convert human intentions into formal, deterministic system commands or SDK snippets.

CONTEXT:
Target Plane: {{{targetPlane}}}
Intention: {{{intention}}}

RULES:
1. If the intention asks for code (SDK), provide a clean implementation including HMAC SHA-256 calculation if relevant.
2. If it's a CLI command, use S-Shell (Sovereign Shell) standards (e.g., nn-cli --command).
3. Ensure the syntax is error-free and follows ISO 20022 messaging logic for FINANCE.
4. Perform a kernel-level safety check. If the command involves critical disbursement or lockdown, flag the complexity higher.
5. Support multiple languages like Python, Go, and Node.js if the intention implies an integration.

GENERATE:
- Syntax (The Code/Command)
- Explanation (Technical summary)
- Safety Check (Boolean)
- Complexity (Score)`,
});

const aiSyntaxArchitectFlow = ai.defineFlow(
  {
    name: 'aiSyntaxArchitectFlow',
    inputSchema: SyntaxInputSchema,
    outputSchema: SyntaxOutputSchema,
  },
  async (input) => {
    const { output } = await syntaxPrompt(input);
    return output!;
  }
);
