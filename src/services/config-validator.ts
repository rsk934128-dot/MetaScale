'use server';
/**
 * @fileOverview Environment Configuration Validator for Sovereign OS.
 * Validates critical API keys and tokens before system stabilization.
 * Updated v1.4: Enhanced error categorization for Communication Plane.
 */

import { checkConfig } from '@/lib/telegram';

export const validateEnvironment = async () => {
  const isTelegramConfigured = checkConfig();

  if (!isTelegramConfigured) {
    console.error("%c[CONFIG_FATAL] Telegram Bot Token is MISSING or INVALID. Infrastructure Fallback Engaged.", "color: #f87171; font-weight: bold;");
    return {
      success: false,
      error: 'MISSING_TELEGRAM_TOKEN',
      message: 'টেলিগ্রাম বোট টোকেন খুঁজে পাওয়া যায়নি। আপনার সিস্টেমের রিমোট কন্ট্রোল আপাতত অফলাইন থাকবে।'
    };
  }

  // Future checks (Stripe, etc.) can be added here
  return {
    success: true,
    error: null
  };
};
