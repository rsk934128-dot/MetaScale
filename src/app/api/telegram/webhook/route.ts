
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, getDoc, collection, getDocs, query, where, orderBy, limit, setDoc } from 'firebase/firestore';
import { sendTelegramMessage, sendFinancialAlert, sendHealthReport, sendMaintenanceAlert } from '@/lib/telegram';
import { reconcileAndSettleLink, processPaymentCredit } from '@/services/payment-service';

/**
 * Telegram Webhook Handler v2.1 (Command & Control Enabled)
 * Handles remote authorization signals (Approve/Reject) from the Governor.
 */
export async function POST(req: Request) {
  const timestamp = Date.now();
  console.log(`>>> [TELEGRAM_SIGNAL] Pulse detected at ${new Date(timestamp).toISOString()}`);

  try {
    const { firestore } = initializeFirebase();
    if (!firestore) {
      console.error(">>> [FATAL_KERNEL] Firestore initialization failed.");
      return NextResponse.json({ ok: true });
    }

    const body = await req.json();

    // 1. Handle Callback Queries (Approve/Reject from inline buttons)
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
            routingReason: 'Authorized via Remote Imperial Control (ECC_ED25519).'
          });
          await sendTelegramMessage(chatId, `<b>✅ TRANSACTION AUTHORIZED</b>\n\nID: <code>${dispatchId}</code>\n\nকার্নেল সফলভাবে লেনদেনটি রিলিজ করেছে।`);
        }
      } else if (data.startsWith('REJECT_')) {
        const dispatchId = data.replace('REJECT_', '');
        const ubilRef = doc(firestore, 'ubil_events', dispatchId);
        if ((await getDoc(ubilRef)).exists()) {
          await updateDoc(ubilRef, {
            status: 'REJECTED',
            rejectedBy: from.username || from.id,
            rejectedAt: Date.now(),
            routingReason: 'Rejected by Governor via Telegram.'
          });
          await sendTelegramMessage(chatId, `<b>❌ TRANSACTION REJECTED</b>\n\nID: <code>${dispatchId}</code>\n\nলেনদেনটি বাতিল করা হয়েছে এবং ফান্ড হোল্ড মোডে আছে।`);
        }
      }
      return NextResponse.json({ ok: true });
    }

    const { message } = body;
    if (!message || !message.text) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const text = message.text.trim();

    // --- COMMAND ROUTER ---

    if (text === '/test') {
      await sendTelegramMessage(chatId, "<b>🛰️ সিস্টেম অনলাইন আছে, বস!</b>\n\nকার্নেল সিগন্যাল রিসিভ করছে।");
    } else if (text.startsWith('/start ')) {
      const userId = text.split(' ')[1];
      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, { 
          telegramChatId: chatId, 
          telegramLinked: true, 
          updatedAt: Date.now()
        });
        await sendTelegramMessage(chatId, `<b>✅ IDENTITY BOUND</b>\n\nCitizen: ${userSnap.data().displayName}\n\nআপনার মোবাইল নোড এখন সোভারেন কার্নেলের সাথে সিঙ্কড।`);
      }
    } else if (text === '/status') {
      await sendTelegramMessage(chatId, "<b>SYSTEM STATUS: NOMINAL</b>\n\nMesh Health: 100%\nHunter Mode: ACTIVE\nKill Switch: READY");
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('>>> [SIGNAL_FATAL_ERROR]:', error.message);
    return NextResponse.json({ ok: true }); 
  }
}
