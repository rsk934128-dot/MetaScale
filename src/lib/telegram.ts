'use server';
/**
 * NoorNexus Telegram Gateway Utility v3.5 (Resilient Handshake)
 * Handles communication with the Sovereign Bot.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7827860503:AAF-U-0jCAdDyla6_8qSmo9Mlp2-xxqZrHI';

/**
 * Validate if the token is available and formatted correctly
 */
export async function checkConfig() {
  const isPlaceholder = !BOT_TOKEN || 
                        BOT_TOKEN === 'your_token_here' || 
                        BOT_TOKEN.trim() === '' ||
                        BOT_TOKEN.length < 20;

  return !isPlaceholder;
}

/**
 * Tests if the current token is valid by calling getMe
 */
export async function testToken() {
  const isConfigured = await checkConfig();
  if (!isConfigured) {
    return { ok: false, description: "টোকেনটি এনভায়রনমেন্টে পাওয়া যায়নি।" };
  }
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`, { cache: 'no-store' });
    const data = await response.json();
    return data;
  } catch (error: any) {
    return { ok: false, description: "টেলিগ্রাম সার্ভারে পৌঁছানো যাচ্ছে না।" };
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
    const result = await response.json();
    return result;
  } catch (error) {
    return { ok: false, description: "Network Error" };
  }
}

/**
 * Sends the Daily Integrity Pulse Report.
 */
export async function sendPulseReport(chatId: string, reportText: string) {
  return await sendTelegramMessage(chatId, reportText);
}

/**
 * Sends an alert with Interactive Approval Buttons.
 */
export async function sendInteractiveAlert(chatId: string, transactionId: string, amount: string) {
  const text = `<b>🚨 PENDING AUTHORIZATION</b>\n\nএকটি হাই-ভ্যালু লেনদেন শনাক্ত করা হয়েছে।\n\n<b>ID:</b> <code>${transactionId}</code>\n<b>Amount:</b> $${amount}\n\nআপনি কি এই লেনদেনটি এপ্রুভ করতে চান?`;
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: "✅ Approve", callback_data: `APPROVE_${transactionId}` },
        { text: "❌ Reject", callback_data: `REJECT_${transactionId}` }
      ]
    ]
  };

  return await sendTelegramMessage(chatId, text, { reply_markup: keyboard });
}

/**
 * Generates a dynamic link based on the actual bot info.
 */
export async function generateTelegramLink(userId: string) {
  const botInfo = await testToken();
  const botUsername = botInfo?.result?.username || 'Coolrubelbank2bot';
  return `https://t.me/${botUsername}?start=${userId}`;
}

/**
 * Sets the Webhook with high priority.
 */
export async function setTelegramWebhook(url: string) {
  const isConfigured = await checkConfig();
  if (!isConfigured) return { ok: false, description: "Token Missing" };
  
  try {
    const webhookUrl = `${url}/api/telegram/webhook`;
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}&drop_pending_updates=true`, {
      method: 'POST',
      cache: 'no-store'
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    return { ok: false, description: error.message };
  }
}

/**
 * Specific Alert helpers
 */
export async function sendFinancialAlert(chatId: string, type: 'LINK_CREATED' | 'SETTLED' | 'REMOTE_SETTLE_INIT', data: any) {
  let text = "";
  if (type === 'LINK_CREATED') {
    text = `<b>🆕 NEW PAYMENT LINK GENERATED</b>\n\n<b>Brand:</b> ${data.brand}\n<b>Amount:</b> ${data.amount} ${data.currency}\n<b>🔗 Link:</b> <code>${data.url}</code>`;
  } else if (type === 'SETTLED') {
    text = `<b>✅ PAYMENT SETTLED (T+0)</b>\n\n<b>Amount:</b> ${data.amount} ${data.currency}\n<b>Seal:</b> <code>${data.seal}</code>`;
  }
  return await sendTelegramMessage(chatId, text);
}

export async function sendSecurityAlert(chatId: string, type: string, data: any) {
  const text = `<b>🚨 SECURITY ALERT</b>\n\n<b>Type:</b> ${type}\n<b>User:</b> ${data.userId}\n<b>Seal:</b> <code>${data.seal}</code>`;
  return await sendTelegramMessage(chatId, text);
}

export async function sendSecureOTP(chatId: string, otp: string) {
  const text = `<b>🔐 SECURITY OTP:</b> <code>${otp}</code>`;
  return await sendTelegramMessage(chatId, text);
}
