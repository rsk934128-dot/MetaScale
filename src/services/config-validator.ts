'use server';
/**
 * @fileOverview Environment Configuration Validator for Sovereign OS.
 * Validates critical API keys and tokens before system stabilization.
 * Updated v1.5: Strict Naming & Security Rule Enforcement.
 */

import { checkConfig } from '@/lib/telegram';

export const validateEnvironment = async () => {
  // 1. Strict Telegram Token Check
  const isTelegramConfigured = checkConfig();
  const tokenName = 'TELEGRAM_BOT_TOKEN';

  if (!isTelegramConfigured) {
    console.error(`%c[CONFIG_FATAL] ${tokenName} is MISSING or INVALID. Infrastructure Fallback Engaged.`, "color: #f87171; font-weight: bold;");
    return {
      success: false,
      error: 'MISSING_TELEGRAM_TOKEN',
      message: `টেলিগ্রাম বোট টোকেন (${tokenName}) খুঁজে পাওয়া যায়নি। হোস্টিং ড্যাশবোর্ড চেক করুন এবং রি-ডেপ্লয় করুন।`
    };
  }

  // 2. Future check for Stripe or other critical keys
  const hasStripe = !!process.env.STRIPE_SECRET_KEY;
  if (!hasStripe) {
    console.warn("[CONFIG_WARN] STRIPE_SECRET_KEY is missing. Stripe payments will operate in sandbox mode.");
  }

  return {
    success: true,
    error: null
  };
};
