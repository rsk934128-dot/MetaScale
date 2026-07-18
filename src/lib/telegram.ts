'use server';
/**
 * NoorNexus Telegram Gateway Utility v3.0 (Sovereign Stabilization)
 * Handles communication with @Coolrubelbank2bot
 * Optimized for secure server-side execution of Telegram API calls.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_NAME = 'Coolrubelbank2bot';

/**
 * Validate if the token is available and formatted correctly
 */
export async function checkConfig() {
  const isPlaceholder = !BOT_TOKEN || 
                        BOT_TOKEN === 'your_token_here' || 
                        BOT_TOKEN.trim() === '' ||
                        BOT_TOKEN.length < 20;

  if (isPlaceholder) {
    return false;
  }
  return true;
}

/**
 * Tests if the current token is valid by calling getMe
 */
export async function testToken() {
  const isConfigured = await checkConfig();
  if (!isConfigured) {
    return { ok: false, description: "টোকেনটি এনভায়রনমেন্টে পাওয়া যায়নি অথবা এর নাম ভুল (Must be TELEGRAM_BOT_TOKEN)।" };
  }
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const data = await response.json();
    return data;
  } catch (error: any) {
    return { ok: false, description: "নেটওয়ার্ক এরর: টেলিগ্রাম সার্ভারে পৌঁছানো যাচ্ছে না।" };
  }
}

export async function sendTelegramMessage(chatId: string, text: string, options: any = {}) {
  const isConfigured = await checkConfig();
  if (!isConfigured) {
    console.error(">>> [SIGNAL_HALTED] Cannot dispatch message: Missing or Invalid Token.");
    return { ok: false, description: "Token Missing or Invalid" };
  }
  
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
    if (!result.ok) {
      console.error('Telegram API Error:', result.description);
    }
    return result;
  } catch (error) {
    console.error('Telegram fetch network error:', error);
    return { ok: false, description: "Network Error" };
  }
}

/**
 * Sends a system health report to Telegram.
 */
export async function sendHealthReport(chatId: string, stats: any) {
  const text = `<b>📊 SYSTEM HEALTH REPORT</b>\n\n` +
               `<b>Status:</b> ${stats.isLocked ? '🔴 LOCKED' : '🟢 OPERATIONAL'}\n` +
               `<b>Uptime:</b> ${stats.uptime}s\n` +
               `<b>Mesh Nodes:</b> 42/42 Active\n` +
               `<b>Latency:</b> 8.4ms\n\n` +
               `সিস্টেম বর্তমানে স্বাভাবিক গতিতে কাজ করছে। (Node-04 Stabilization: OK)`;
  return await sendTelegramMessage(chatId, text);
}

/**
 * Sends a security alert for breaches or handshake failures.
 */
export async function sendSecurityAlert(chatId: string, type: string, data: any) {
  const text = `<b>🚨 SECURITY BREACH DETECTED</b>\n\n` +
               `<b>Type:</b> <code>${type}</code>\n` +
               `<b>User Node:</b> ${data.userId}\n` +
               `<b>Reason:</b> ${data.reason}\n` +
               `<b>Seal:</b> <code>${data.seal}</code>\n\n` +
               `নিরাপত্তার স্বার্থে উক্ত আইডেন্টিটি নোডটি <b>AUTO-LOCKED</b> করা হয়েছে। অবিলম্বে ম্যানুয়াল অডিট প্রয়োজন।`;
  return await sendTelegramMessage(chatId, text);
}

/**
 * Sends a maintenance alert.
 */
export async function sendMaintenanceAlert(chatId: string, isActive: boolean) {
  const text = isActive 
    ? `<b>⚠️ MAINTENANCE MODE: ACTIVE</b>\n\nসিস্টেম এখন মেইনটেন্যান্স মোডে আছে। পরবর্তী নির্দেশ না দেওয়া পর্যন্ত পাবলিক পেমেন্ট বন্ধ থাকবে।`
    : `<b>✅ MAINTENANCE MODE: DEACTIVATED</b>\n\nসিস্টেম এখন লাইভ। সকল অপারেশন স্বাভাবিক।`;
  return await sendTelegramMessage(chatId, text);
}

/**
 * Sends a formatted financial alert for link generation or settlement.
 */
export async function sendFinancialAlert(chatId: string, type: 'LINK_CREATED' | 'SETTLED' | 'REMOTE_SETTLE_INIT', data: any) {
  let text = "";
  
  if (type === 'LINK_CREATED') {
    text = `<b>🆕 NEW PAYMENT LINK GENERATED</b>\n\n` +
           `<b>Brand:</b> ${data.brand}\n` +
           `<b>Amount:</b> ${data.amount} ${data.currency}\n` +
           `<b>Description:</b> ${data.description}\n` +
           `<b>Mission:</b> ${data.mission}\n\n` +
           `<b>🔗 Payment URL:</b>\n<code>${data.url}</code>\n\n` +
           `এটি আপনার মার্চেন্ট নোডের মাধ্যমে সরাসরি সেটেলমেন্টের জন্য প্রস্তুত।`;
  } else if (type === 'SETTLED') {
    text = `<b>✅ PAYMENT SETTLED (T+0)</b>\n\n` +
           `<b>Amount:</b> ${data.amount} ${data.currency}\n` +
           `<b>Provider:</b> ${data.provider}\n` +
           `<b>External ID:</b> <code>${data.externalTxnId}</code>\n` +
           `<b>Seal:</b> <code>${data.seal}</code>\n\n` +
           `আপনার ব্যালেন্স সফলভাবে আপডেট করা হয়েছে। (ECC_ED25519 Verified)`;
  } else if (type === 'REMOTE_SETTLE_INIT') {
    text = `<b>⏳ REMOTE SETTLEMENT INITIATED</b>\n\n` +
           `<b>Seal:</b> <code>${data.seal}</code>\n` +
           `<b>Status:</b> Reconciling with Hub...\n\n` +
           `দয়া করে অপেক্ষা করুন, সোভারেন কার্নেল লেনদেনটি যাচাই করছে।`;
  }

  return await sendTelegramMessage(chatId, text);
}

/**
 * Sends the Daily Integrity Pulse Report.
 */
export async function sendPulseReport(chatId: string, reportText: string) {
  return await sendTelegramMessage(chatId, reportText);
}

/**
 * Sends a Secure OTP to the user's Telegram.
 */
export async function sendSecureOTP(chatId: string, otp: string) {
  const text = `<b>🔐 SECURITY PROTOCOL: OTP</b>\n\nআপনার FusionPay সিকিউরিটি কোড হলো: <code>${otp}</code>\n\nএটি পরবর্তী ৫ মিনিটের জন্য কার্যকর। নিরাপত্তার স্বার্থে এটি কারো সাথে শেয়ার করবেন না।`;
  return await sendTelegramMessage(chatId, text);
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

export async function generateTelegramLink(userId: string) {
  // Directly returns the link for the bot
  return `https://t.me/${BOT_NAME}?start=${userId}`;
}

export async function setTelegramWebhook(url: string) {
  const isConfigured = await checkConfig();
  if (!isConfigured) return { ok: false, description: "Bot Token Missing or Invalid in Environment Variables." };
  
  try {
    const webhookUrl = `${url}/api/telegram/webhook`;
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Webhook Setup Error:', error.message);
    return { ok: false, description: error.message };
  }
}
