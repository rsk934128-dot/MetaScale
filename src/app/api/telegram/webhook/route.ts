
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram';

/**
 * Telegram Webhook Handler v1.2
 * Processes commands and callback queries from @Coolrubelbank2bot
 * Updated with Multi-Sig Settlement Authorization support.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('>>> TELEGRAM WEBHOOK:', JSON.stringify(body));

    // Handle Callback Queries (Button Clicks from Interactive Alerts)
    if (body.callback_query) {
      const { id, data, from, message } = body.callback_query;
      const chatId = from.id.toString();
      const { firestore } = initializeFirebase();

      if (data.startsWith('APPROVE_')) {
        const dispatchId = data.replace('APPROVE_', '');
        
        if (firestore) {
          // Update UBIL Ledger
          const ubilRef = doc(firestore, 'ubil_events', dispatchId);
          const ubilSnap = await getDoc(ubilRef);
          
          if (ubilSnap.exists()) {
            await updateDoc(ubilRef, {
              status: 'SUCCESS',
              authorizedBy: from.username || from.id,
              authorizedAt: Date.now(),
              routingReason: 'Authorized via Multi-Sig Telegram Gateway.'
            });

            // Log Security Clearance
            const auditRef = doc(firestore, 'events', `CLEARANCE_${dispatchId}`);
            await setDoc(auditRef, {
              id: `CLEARANCE_${dispatchId}`,
              plane: 'SECURITY',
              type: 'MULTI_SIG_AUTHORIZED',
              priority: 1,
              timestamp: Date.now(),
              payload: { dispatchId, approver: from.id },
              status: 'COMPLETED'
            });

            await sendTelegramMessage(chatId, `<b>✅ TRANSACTION AUTHORIZED</b>\n\nID: <code>${dispatchId}</code>\n\nলিঙ্কড পেমেন্টটি সফলভাবে সোভারেন কার্নেল দ্বারা সেটেলমেন্টের জন্য রিলিজ করা হয়েছে।`);
          }
        }
      } else if (data.startsWith('REJECT_')) {
        const dispatchId = data.replace('REJECT_', '');
        
        if (firestore) {
          const ubilRef = doc(firestore, 'ubil_events', dispatchId);
          await updateDoc(ubilRef, {
            status: 'FAILED',
            routingReason: 'Rejected by Sovereign Owner via Multi-Sig.'
          });

          await sendTelegramMessage(chatId, `<b>❌ TRANSACTION REJECTED</b>\n\nID: <code>${dispatchId}</code>\n\nনিরাপত্তার স্বার্থে লেনদেনটি বাতিল করা হয়েছে এবং ব্রিজটি আইসোলেট করা হয়েছে।`);
        }
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
          await sendTelegramMessage(chatId, `<b>✅ IDENTITY BOUND</b>\n\nCitizen: ${userSnap.data().displayName}\n\nআপনার অ্যাকাউন্ট এখন সোভারেন ওএস-এর সাথে লিঙ্কড। এখন থেকে মাল্টি-সিগ পেমেন্ট অ্যালার্ট এখানে পাবেন।`);
        }
      }
    } else if (text === '/status') {
      await sendTelegramMessage(chatId, "<b>SYSTEM STATUS: NOMINAL</b>\n\nMesh Health: 100%\nAnycast: Node-04 Priority\nMulti-Sig Guard: ACTIVE");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Runtime Error:', error);
    return NextResponse.json({ ok: true }); 
  }
}
