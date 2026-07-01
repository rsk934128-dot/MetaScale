
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram';

/**
 * Telegram Webhook Handler
 * Processes commands and callback queries from @Coolrubelbank2bot
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('>>> TELEGRAM WEBHOOK:', JSON.stringify(body));

    // Handle Callback Queries (Button Clicks)
    if (body.callback_query) {
      const { id, data, from, message } = body.callback_query;
      const chatId = from.id.toString();

      if (data.startsWith('APPROVE_')) {
        const txnId = data.replace('APPROVE_', '');
        await sendTelegramMessage(chatId, `<b>✅ TRANSACTION APPROVED</b>\n\nID: <code>${txnId}</code>\n\nলেনদেনটি সফলভাবে সোভারেন কার্নেল দ্বারা অথরাইজড হয়েছে।`);
      } else if (data.startsWith('REJECT_')) {
        const txnId = data.replace('REJECT_', '');
        await sendTelegramMessage(chatId, `<b>❌ TRANSACTION REJECTED</b>\n\nID: <code>${txnId}</code>\n\nলেনদেনটি বাতিল করা হয়েছে এবং সিকিউরিটি লগে রিপোর্ট করা হয়েছে।`);
      }

      return NextResponse.json({ ok: true });
    }

    const { message } = body;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id.toString();
    const text = message.text;

    // Handle Commands
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
          await sendTelegramMessage(chatId, `<b>✅ IDENTITY BOUND</b>\n\nCitizen: ${userSnap.data().displayName}\n\nআপনার অ্যাকাউন্ট এখন সোভারেন ওএস-এর সাথে লিঙ্কড। এখন থেকে ওটিপি এবং পেমেন্ট অ্যালার্ট এখানে পাবেন।`);
        }
      }
    } else if (text === '/status') {
      await sendTelegramMessage(chatId, "<b>SYSTEM STATUS: NOMINAL</b>\n\nMesh Health: 100%\nAnycast: Node-04 Priority\nSignal Mode: AES-256-GCM");
    } else if (text === '/otp') {
       const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
       await sendTelegramMessage(chatId, `<b>🔐 SECURITY OTP</b>\n\nআপনার কোড: <code>${mockOtp}</code>`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Runtime Error:', error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
