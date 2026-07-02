
/**
 * NoorNexus Telegram Gateway Utility
 * Handles communication with @Coolrubelbank2bot
 * Includes OTP support, Interactive Keyboards, and Financial Alerts.
 */

const BOT_TOKEN = "7827860503:AAEVNXEe3mPUtPudIBT_S5aE1aHr56efaiA";
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendTelegramMessage(chatId: string, text: string, options: any = {}) {
  try {
    const response = await fetch(`${BASE_URL}/sendMessage`, {
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
    console.error('Telegram Send Error:', error);
    return null;
  }
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
           `আপনার ব্যালেন্স সফলভাবে আপডেট করা হয়েছে।`;
  } else if (type === 'REMOTE_SETTLE_INIT') {
    text = `<b>⏳ REMOTE SETTLEMENT INITIATED</b>\n\n` +
           `<b>Seal:</b> <code>${data.seal}</code>\n` +
           `<b>Status:</b> Reconciling with Hub...\n\n` +
           `দয়া করে অপেক্ষা করুন, সোভারেন কার্নেল লেনদেনটি যাচাই করছে।`;
  }

  return await sendTelegramMessage(chatId, text);
}

/**
 * Sends billing related alerts.
 */
export async function sendBillingAlert(chatId: string, type: 'UPGRADE' | 'OVERAGE' | 'SLA_BREACH', data: any) {
  let text = "";
  if (type === 'UPGRADE') {
    text = `<b>🚀 SYSTEM UPGRADE SUCCESSFUL</b>\n\nআপনার একাউন্টটি সফলভাবে <b>${data.plan}</b> টিয়ারে উন্নীত করা হয়েছে।\n\n<b>নতুন সুবিধা:</b>\n• ${data.limit} API Requests\n• Priority Anycast (Node-04)\n• Managed WAF Protection`;
  } else if (type === 'OVERAGE') {
    text = `<b>⚠️ BILLING ALERT: OVERAGE</b>\n\nআপনার বর্তমান প্ল্যানের এপিআই লিমিট অতিক্রম করেছে।\n\n<b>অতিরিক্ত ট্রাফিক:</b> ${data.excess} Requests\n<b>চার্জ:</b> $${data.charge}\n\nএটি পরবর্তী বিলিং সাইকেলে অটো-সেটেল হবে।`;
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

export function generateTelegramLink(userId: string) {
  return `https://t.me/Coolrubelbank2bot?start=${userId}`;
}

export async function setTelegramWebhook(url: string) {
  try {
    const webhookUrl = `${url}/api/telegram/webhook`;
    const response = await fetch(`${BASE_URL}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    });
    const result = await response.json();
    console.log('Webhook Setup Result:', result);
    return result;
  } catch (error) {
    console.error('Webhook Setup Error:', error);
    return null;
  }
}
