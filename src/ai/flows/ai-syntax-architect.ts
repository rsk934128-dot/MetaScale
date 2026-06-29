'use server';
/**
 * @fileOverview Project 43: AI Syntax Architect.
 * Converts natural language directives into Sovereign OS deterministic commands.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SyntaxInputSchema = z.object({
  intention: z.string().describe('The user intention in plain English or Bengali.'),
  targetPlane: z.enum(['CIVIC', 'FINANCE', 'SECURITY', 'INFRA']),
});

const SyntaxOutputSchema = z.object({
  syntax: z.string().describe('The generated system command or configuration snippet.'),
  explanation: z.string().describe('Explanation of the generated syntax.'),
  safetyCheck: z.boolean().describe('Whether the syntax passed internal safety protocols.'),
  complexity: z.number().min(1).max(10),
});

export async function architectSyntax(input: z.infer<typeof SyntaxInputSchema>) {
  return aiSyntaxArchitectFlow(input);
}

const syntaxPrompt = ai.definePrompt({
  name: 'syntaxPrompt',
  input: { schema: SyntaxInputSchema },
  output: { schema: SyntaxOutputSchema },
  prompt: `You are the Project 43 AI Syntax Architect for Sovereign OS.
Your task is to convert human intentions into formal system commands for the {{{targetPlane}}} plane.

INTENTION: {{{intention}}}

Guidelines:
1. Ensure the syntax is deterministic and follows the Sovereign Shell (S-Shell) standards.
2. Provide a clear, technical explanation of what this command will execute.
3. Perform a safety check to ensure it doesn't violate core kernel stability.
4. Assign a complexity score (1-10) based on the execution risk.`,
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
