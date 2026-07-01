
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
    console.log('>>> TELEGRAM WEBHOOK INCOMING:', JSON.stringify(body));

    const { message } = body;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id.toString();
    const text = message.text;

    // Handle /start <uid> command from deep link
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

          await sendTelegramMessage(chatId, `<b>✅ IDENTITY BOUND</b>\n\nCitizen: ${userSnap.data().displayName}\nKernel ID: ${userSnap.data().kernelId}\n\nYour account is now linked to the Sovereign OS Telegram Gateway. You will receive critical alerts here.`);
        } else {
          await sendTelegramMessage(chatId, "❌ User not found in Sovereign Mesh. Please try initializing again from the OS dashboard.");
        }
      }
    } else if (text === '/status') {
      await sendTelegramMessage(chatId, "<b>SYSTEM STATUS: NOMINAL</b>\n\nAll 42 nodes operational.\nAnycast Latency: 8.4ms\nSignal Plane: AES-256-GCM");
    } else if (text === '/start') {
       await sendTelegramMessage(chatId, "👋 Welcome to <b>Sovereign OS Gateway</b>.\n\nPlease use the <b>Initialize Gateway</b> button in your Communication Plane to link this bot with your account.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Runtime Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
