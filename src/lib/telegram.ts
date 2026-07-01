
/**
 * NoorNexus Telegram Gateway Utility
 * Handles communication with @Coolrubelbank2bot
 */

const BOT_TOKEN = "7827860503:AAEVNXEe3mPUtPudIBT_S5aE1aHr56efaiA";
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendTelegramMessage(chatId: string, text: string) {
  try {
    const response = await fetch(`${BASE_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Telegram Send Error:', error);
    return null;
  }
}

export function generateTelegramLink(userId: string) {
  // Deep linking to bot with user ID as start parameter
  return `https://t.me/Coolrubelbank2bot?start=${userId}`;
}

export async function setTelegramWebhook(url: string) {
  try {
    const response = await fetch(`${BASE_URL}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: `${url}/api/telegram/webhook` }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
}
