'use server';
/**
 * @fileOverview Yapily Direct API Orchestrator & Smart Router for NoorNexus UBIL.
 * Handles institution discovery, consent lifecycle, and intelligent integration path switching.
 * Synchronized with Global Ledger Access (Level 0).
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
  requestType: z.enum([
    'single_payment', 
    'bulk_payment', 
    'scheduled_payment', 
    'international_transfer', 
    'standard_consent',
    'custom_ui_required'
  ]).default('standard_consent'),
});

const YapilyConsentOutputSchema = z.object({
  consentId: z.string(),
  authorisationUrl: z.string(),
  status: z.string(),
  expiresAt: z.string(),
  integrationPath: z.enum(['HOSTED', 'DIRECT_API']),
  routingReason: z.string(),
  handshakeStatus: z.string().default('OK'),
});

/**
 * Smart Router Logic for Integration Path selection.
 * Determines whether to use Hosted Pages or Direct API based on request complexity and NoorNexus Priority Rules.
 */
function determineIntegrationPath(requestType: string): { path: 'HOSTED' | 'DIRECT_API', reason: string } {
  const hostedTypes = ['single_payment', 'standard_consent'];
  const directTypes = ['bulk_payment', 'scheduled_payment', 'international_transfer', 'custom_ui_required'];

  if (directTypes.includes(requestType)) {
    return { 
      path: 'DIRECT_API', 
      reason: `Complex transaction (${requestType}) detected. Direct API Engine utilized for full control and custom UI compliance.` 
    };
  }
  
  return { 
    path: 'HOSTED', 
    reason: `Standard request (${requestType}) detected. Hosted Pages prioritized for rapid scaling and automated SCA handling.` 
  };
}

/**
 * Bank Discovery logic for NoorNexus UBIL Core.
 */
export async function getYapilyInstitutions(countryCode: string = 'GB') {
  return yapilyInstitutionsFlow({ countryCode });
}

/**
 * Intelligent Handshake & Consent Management with Auto-Switch.
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
    // Simulated mapping of 14,000 banks
    return [
      { id: 'barclays', name: 'Barclays', countries: ['GB'], features: ['INITIATE_DOMESTIC_PERIODIC_PAYMENT', 'READ_ACCOUNTS'] },
      { id: 'hsbc-uk', name: 'HSBC UK', countries: ['GB'], features: ['INITIATE_DOMESTIC_SINGLE_PAYMENT', 'READ_ACCOUNTS'] },
      { id: 'revolut', name: 'Revolut', countries: ['GB', 'IE', 'FR'], features: ['INITIATE_DOMESTIC_SINGLE_PAYMENT', 'READ_ACCOUNTS'] },
      { id: 'brac-bank-mock', name: 'Brac Bank (UBIL-Bridge)', countries: ['BD'], features: ['READ_ACCOUNTS'] },
      { 
        id: 'amex-ob_uk', 
        name: 'Amex UK', 
        fullName: 'American Express UK', 
        countries: ['GB'], 
        features: ['PIS', 'AIS', 'READ_ACCOUNTS', 'INITIATE_PAYMENT'] 
      },
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
    const routing = determineIntegrationPath(input.requestType);
    const consentId = `CON_YAP_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Simulate different URLs based on path
    const authUrl = routing.path === 'HOSTED' 
      ? `https://auth.yapily.com/hosted?consent=${consentId}`
      : `https://auth.yapily.com/direct?consent=${consentId}&institution=${input.institutionId}`;

    return {
      consentId,
      authorisationUrl: authUrl,
      status: 'AWAITING_AUTHORISATION',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      integrationPath: routing.path,
      routingReason: routing.reason,
      handshakeStatus: 'DETERMINISTIC_FINALITY_READY'
    };
  }
);
