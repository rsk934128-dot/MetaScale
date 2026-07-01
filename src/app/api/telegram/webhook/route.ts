
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram';

/**
 * Telegram Webhook Handler
 * Processes commands from @Coolrubelbank2bot
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id.toString();
    const text = message.text;

    // Handle /start <uid> command
    if (text.startsWith('/start ')) {
      const userId = text.split(' ')[1];
      const { firestore } = initializeFirebase();

      if (userId && firestore) {
        const userRef = doc(firestore, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          await updateDoc(userRef, {
            telegramChatId: chatId,
            telegramLinked: true
          });

          await sendTelegramMessage(chatId, `<b>✅ IDENTITY BOUND</b>\n\nCitizen: ${userSnap.data().displayName}\nKernel ID: ${userSnap.data().kernelId}\n\nYour account is now linked to the Sovereign OS Telegram Gateway.`);
        } else {
          await sendTelegramMessage(chatId, "❌ User not found in Sovereign Mesh.");
        }
      }
    } else if (text === '/status') {
      await sendTelegramMessage(chatId, "<b>SYSTEM STATUS: NOMINAL</b>\nAll 42 nodes operational.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
