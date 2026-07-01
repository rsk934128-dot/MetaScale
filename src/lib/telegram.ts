
/**
 * NoorNexus Telegram Gateway Utility
 * Handles communication with @Coolrubelbank2bot
 * Includes OTP support and Interactive Keyboards.
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
