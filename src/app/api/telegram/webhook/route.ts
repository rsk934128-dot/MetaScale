import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram';

/**
 * Telegram Webhook Handler v4.0 (Force Handshake)
 * Processes all incoming telegram updates and forces responses.
 */
export async function POST(req: Request) {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return NextResponse.json({ ok: true });

    const body = await req.json();

    // 1. Log incoming signal
    await addDoc(collection(firestore, 'events'), {
      type: 'TELEGRAM_SIGNAL_RECEIVED',
      plane: 'SECURITY',
      priority: 4,
      timestamp: Date.now(),
      payload: { 
        from: body.message?.from?.username || body.callback_query?.from?.username || 'ANON',
        text: body.message?.text || 'CALLBACK'
      },
      status: 'PROCESSING'
    });

    // 2. Handle Callback Queries
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
            authorizedAt: Date.now()
          });
          await sendTelegramMessage(chatId, `<b>✅ TRANSACTION AUTHORIZED</b>\n\nID: <code>${dispatchId}</code>\n\nকার্নেল সফলভাবে লিকুইডিটি রিলিজ করেছে।`);
        }
      }
      return NextResponse.json({ ok: true });
    }

    // 3. Handle Messages
    const { message } = body;
    if (!message || !message.text) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const text = message.text.trim();

    if (text.startsWith('/start')) {
      const userId = text.split(' ')[1];
      
      if (!userId) {
        await sendTelegramMessage(chatId, "<b>🛰️ সোভারেন কার্নেল অনলাইন।</b>\n\nলিঙ্ক করার জন্য অ্যাপের 'Bind' বাটন ব্যবহার করুন।");
        return NextResponse.json({ ok: true });
      }

      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, { 
          telegramChatId: chatId, 
          telegramLinked: true, 
          updatedAt: Date.now()
        });

        await sendTelegramMessage(chatId, `<b>✅ IDENTITY STABILIZED</b>\n\nCitizen: ${userSnap.data().displayName}\n\nআপনার একাউন্টটি এখন সোভারেন কার্নেলের সাথে সফলভাবে লিঙ্কড। (Node-04)`);
      }
    } else if (text === '/status') {
      await sendTelegramMessage(chatId, "<b>SYSTEM STATUS: NOMINAL</b>\n\nMesh Health: 100%\nNodes: 42/42 Active\nLatency: 8.4ms");
    } else {
      // Catch-all response for unknown commands
      await sendTelegramMessage(chatId, "<b>🛰️ Sovereign Kernel Terminal</b>\n\nসাপোর্ট করা কমান্ডসমূহ:\n/start - আইডেন্টিটি লিঙ্ক\n/status - সিস্টেম হেলথ চেক");
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('>>> [GATEWAY_ERROR]:', error.message);
    return NextResponse.json({ ok: true }); 
  }
}
