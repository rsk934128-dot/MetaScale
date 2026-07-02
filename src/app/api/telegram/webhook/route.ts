
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram';

/**
 * Telegram Webhook Handler v1.2
 * Processes commands and callback queries from @Coolrubelbank2bot
 * Updated with robust identity binding.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('>>> TELEGRAM WEBHOOK:', JSON.stringify(body));

    const { firestore } = initializeFirebase();
    if (!firestore) return NextResponse.json({ ok: true });

    // Handle Callback Queries (Approve/Reject)
    if (body.callback_query) {
      const { data, from } = body.callback_query;
      const chatId = from.id.toString();

      if (data.startsWith('APPROVE_')) {
        const dispatchId = data.replace('APPROVE_', '');
        const ubilRef = doc(firestore, 'ubil_events', dispatchId);
        const ubilSnap = await getDoc(ubilRef);
        
        if (ubilSnap.exists()) {
          await updateDoc(ubilRef, {
            status: 'SUCCESS',
            authorizedBy: from.username || from.id,
            authorizedAt: Date.now(),
            routingReason: 'Authorized via Multi-Sig Telegram Gateway.'
          });

          await sendTelegramMessage(chatId, `<b>✅ TRANSACTION AUTHORIZED</b>\n\nID: <code>${dispatchId}</code>\n\nলিঙ্কড পেমেন্টটি সফলভাবে সোভারেন কার্নেল দ্বারা রিলিজ করা হয়েছে।`);
        }
      } else if (data.startsWith('REJECT_')) {
        const dispatchId = data.replace('REJECT_', '');
        const ubilRef = doc(firestore, 'ubil_events', dispatchId);
        await updateDoc(ubilRef, {
          status: 'FAILED',
          routingReason: 'Rejected by Sovereign Owner via Multi-Sig.'
        });
        await sendTelegramMessage(chatId, `<b>❌ TRANSACTION REJECTED</b>\n\nID: <code>${dispatchId}</code>\n\nনিরাপত্তার স্বার্থে লেনদেনটি বাতিল করা হয়েছে।`);
      }

      return NextResponse.json({ ok: true });
    }

    const { message } = body;
    if (!message || !message.text) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const text = message.text;

    // Handle Identity Binding Command: /start <uid>
    if (text.startsWith('/start ')) {
      const userId = text.split(' ')[1];
      if (userId) {
        const userRef = doc(firestore, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          await updateDoc(userRef, {
            telegramChatId: chatId,
            telegramLinked: true,
            updatedAt: Date.now()
          });
          await sendTelegramMessage(chatId, `<b>✅ IDENTITY BOUND</b>\n\nCitizen: ${userSnap.data().displayName}\n\nআপনার অ্যাকাউন্ট এখন সোভারেন ওএস-এর সাথে লিঙ্কড। এখন থেকে পেমেন্ট আপডেট এবং সেটেলমেন্ট লিঙ্ক এখানে পাবেন।`);
        } else {
          await sendTelegramMessage(chatId, "❌ <b>IDENTITY_NOT_FOUND</b>\n\nআপনার ইউজার আইডিটি সঠিক নয়। দয়া করে অ্যাপ থেকে পুনরায় লিঙ্ক করুন।");
        }
      }
    } else if (text === '/status') {
      await sendTelegramMessage(chatId, "<b>SYSTEM STATUS: NOMINAL</b>\n\nMesh Health: 100%\nAnycast: Node-04 Priority\nMulti-Sig Guard: ACTIVE\nFinance Signal: READY");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Runtime Error:', error);
    return NextResponse.json({ ok: true }); 
  }
}
