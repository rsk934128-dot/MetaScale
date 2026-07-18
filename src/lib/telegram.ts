'use server';
/**
 * NoorNexus Telegram Gateway Utility v5.0 (Financial Execution)
 * Handles communication, alerts, and interactive approvals.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7827860503:AAF-U-0jCAdDyla6_8qSmo9Mlp2-xxqZrHI';

export async function checkConfig() {
  return !!BOT_TOKEN && BOT_TOKEN !== 'your_token_here' && BOT_TOKEN.length > 20;
}

export async function testToken() {
  const isConfigured = await checkConfig();
  if (!isConfigured) return { ok: false, description: "Token Missing" };
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`, { cache: 'no-store' });
    return await response.json();
  } catch (error: any) {
    return { ok: false, description: "Network Error" };
  }
}

export async function sendTelegramMessage(chatId: string, text: string, options: any = {}) {
  const isConfigured = await checkConfig();
  if (!isConfigured) return { ok: false, description: "Token Missing" };
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        ...options
      }),
    });
    return await response.json();
  } catch (error) {
    return { ok: false, description: "Network Error" };
  }
}

export async function setTelegramWebhook(url: string) {
  const isConfigured = await checkConfig();
  if (!isConfigured) return { ok: false, description: "Token Missing" };
  const baseUrl = url.replace(/\/$/, "");
  const webhookUrl = `${baseUrl}/api/telegram/webhook`;
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}&drop_pending_updates=true`, {
      method: 'POST',
      cache: 'no-store'
    });
    return await response.json();
  } catch (error: any) {
    return { ok: false, description: error.message };
  }
}

export async function generateTelegramLink(userId: string) {
  const botInfo = await testToken();
  const botUsername = botInfo?.result?.username || 'Coolrubelbank2bot';
  return `https://t.me/${botUsername}?start=${userId}`;
}

export async function sendFinancialAlert(chatId: string, type: string, data: any) {
  const text = `<b>🛰️ FINANCIAL DIRECTIVE</b>\n\n<b>Type:</b> ${type}\n<b>Amount:</b> ${data.amount} ${data.currency || 'USD'}\n<b>Provider:</b> ${data.provider || 'Internal'}\n<b>Seal:</b> <code>${data.seal || data.id}</code>`;
  return await sendTelegramMessage(chatId, text);
}

export async function sendSecurityAlert(chatId: string, type: string, data: any) {
  const text = `<b>⚠️ SECURITY ALERT</b>\n\n<b>Threat:</b> ${type}\n<b>Reason:</b> ${data.reason}\n<b>User:</b> <code>${data.userId}</code>\n<b>Seal:</b> <code>${data.seal}</code>`;
  return await sendTelegramMessage(chatId, text);
}

/**
 * Sends an interactive approval request for high-value transactions.
 */
export async function sendInteractiveAlert(chatId: string, dispatchId: string, amount: string) {
  const text = `<b>🚨 HIGH-VALUE DISBURSEMENT</b>\n\nএকটি বড় পেমেন্ট অনুমোদনের জন্য পেন্ডিং আছে।\n\n<b>Amount:</b> ${amount}\n<b>ID:</b> <code>${dispatchId}</code>\n\nআপনি কি এই ট্রানজ্যাকশনটি অনুমোদন করতে চান?`;
  
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Approve Transaction", callback_data: `APPROVE_${dispatchId}` },
          { text: "❌ Reject", callback_data: `REJECT_${dispatchId}` }
        ]
      ]
    }
  };
  
  return await sendTelegramMessage(chatId, text, options);
}

export async function sendSecureOTP(chatId: string, otp: string) {
  const text = `<b>🔐 SECURITY OTP:</b> <code>${otp}</code>`;
  return await sendTelegramMessage(chatId, text);
}

export async function sendPulseReport(chatId: string, text: string) {
  return await sendTelegramMessage(chatId, text);
}
