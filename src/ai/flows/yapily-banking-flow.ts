'use server';
/**
 * @fileOverview Yapily Direct API Orchestrator for NoorNexus UBIL.
 * Handles institution discovery, consent lifecycle, and direct PIS/AIS rails.
 * Integrates with config/yapily_config.json structure logic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const YapilyInstitutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  fullName: z.string().optional(),
  countries: z.array(z.string()),
  features: z.array(z.string()),
});

const YapilyConsentInputSchema = z.object({
  institutionId: z.string(),
  callbackUrl: z.string(),
  scope: z.enum(['AIS', 'PIS']),
  userId: z.string(),
});

const YapilyConsentOutputSchema = z.object({
  consentId: z.string(),
  authorisationUrl: z.string(),
  status: z.string(),
  expiresAt: z.string(),
});

/**
 * Bank Discovery logic for NoorNexus UBIL Core.
 * Matches Yapily institutions with NoorNexus global mapping.
 */
export async function getYapilyInstitutions(countryCode: string = 'GB') {
  return yapilyInstitutionsFlow({ countryCode });
}

/**
 * Secure Handshake & Consent Management.
 * Implements PSD2/SCA flow for direct PIS/AIS access.
 */
export async function createYapilyConsent(input: z.infer<typeof YapilyConsentInputSchema>) {
  return yapilyConsentFlow(input);
}

const yapilyInstitutionsFlow = ai.defineFlow(
  {
    name: 'yapilyInstitutionsFlow',
    inputSchema: z.object({ countryCode: z.string() }),
    outputSchema: z.array(YapilyInstitutionSchema),
  },
  async (input) => {
    // In production, this would call Yapily GET /institutions
    // Using নূর নেক্সাস (NoorNexus) mapping logic
    return [
      { id: 'barclays', name: 'Barclays', countries: ['GB'], features: ['INITIATE_DOMESTIC_PERIODIC_PAYMENT', 'READ_ACCOUNTS'] },
      { id: 'hsbc-uk', name: 'HSBC UK', countries: ['GB'], features: ['INITIATE_DOMESTIC_SINGLE_PAYMENT', 'READ_ACCOUNTS'] },
      { id: 'revolut', name: 'Revolut', countries: ['GB', 'IE', 'FR'], features: ['INITIATE_DOMESTIC_SINGLE_PAYMENT', 'READ_ACCOUNTS'] },
      { id: 'brac-bank-mock', name: 'Brac Bank (UBIL-Bridge)', countries: ['BD'], features: ['READ_ACCOUNTS'] },
    ];
  }
);

const yapilyConsentFlow = ai.defineFlow(
  {
    name: 'yapilyConsentFlow',
    inputSchema: YapilyConsentInputSchema,
    outputSchema: YapilyConsentOutputSchema,
  },
  async (input) => {
    // Secure Handshake simulation as per NoorNexus operational guidelines
    const consentId = `CON_YAP_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    return {
      consentId,
      authorisationUrl: `https://auth.yapily.com/direct?consent=${consentId}&institution=${input.institutionId}`,
      status: 'AWAITING_AUTHORISATION',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
);
