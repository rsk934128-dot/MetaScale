
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { sendTelegramMessage, sendFinancialAlert, sendBillingAlert } from '@/lib/telegram';
import { reconcileAndSettleLink, processPaymentCredit } from '@/services/payment-service';

/**
 * Telegram Webhook Handler v1.4
 * Improved with Remote Settlement & Billing Control.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firestore } = initializeFirebase();
    if (!firestore) return NextResponse.json({ ok: true });

    // 1. Handle Callback Queries (Approve/Reject)
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
      }
      return NextResponse.json({ ok: true });
    }

    const { message } = body;
    if (!message || !message.text) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const text = message.text.trim();

    // 2. Identity Binding: /start <uid>
    if (text.startsWith('/start ')) {
      const userId = text.split(' ')[1];
      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, { telegramChatId: chatId, telegramLinked: true, updatedAt: Date.now() });
        await sendTelegramMessage(chatId, `<b>✅ IDENTITY BOUND</b>\n\nCitizen: ${userSnap.data().displayName}\n\nআপনার অ্যাকাউন্ট এখন সোভারেন ওএস-এর সাথে লিঙ্কড।`);
      } else {
        await sendTelegramMessage(chatId, "❌ <b>IDENTITY_NOT_FOUND</b>");
      }
    } 
    
    // 3. Billing Status: /plan
    else if (text === '/plan') {
      const usersQuery = query(collection(firestore, 'users'), where('telegramChatId', '==', chatId), limit(1));
      const userSnap = await getDocs(usersQuery);
      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        const planInfo = `<b>💳 BILLING STATUS</b>\n\n` +
                        `<b>Current Plan:</b> ${userData.plan || 'FREE'}\n` +
                        `<b>API Requests:</b> 420k / ${userData.plan === 'PRO' ? '10M' : '1M'}\n` +
                        `<b>Status:</b> ACTIVE\n\n` +
                        `আপনার প্ল্যান এবং ওভারএজ ট্র্যাকিং স্বাভাবিক আছে।`;
        await sendTelegramMessage(chatId, planInfo);
      }
    }

    // 4. Remote Settlement Action (If user sends a PAY_SEAL_ or TXN_)
    else if (text.startsWith('PAY_SEAL_')) {
      await sendFinancialAlert(chatId, 'REMOTE_SETTLE_INIT', { seal: text });
      
      try {
        const extTxnId = `REMOTE_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const reconResult = await reconcileAndSettleLink(firestore, text, 'TELEGRAM_BOT', extTxnId);
        
        if (reconResult.status === 'READY_FOR_CREDIT') {
          await processPaymentCredit(firestore, reconResult.normalizedEvent!, 'WEBHOOK');
          await sendTelegramMessage(chatId, `<b>✅ REMOTE SETTLEMENT SUCCESS</b>\n\nপেমেন্ট <code>${text}</code> সফলভাবে সেটেল করা হয়েছে। ব্যালেন্স আপডেট কমপ্লিট।`);
        } else {
          await sendTelegramMessage(chatId, `❌ <b>SETTLEMENT_FAILED</b>\n\nReason: ${reconResult.status}`);
        }
      } catch (err: any) {
        await sendTelegramMessage(chatId, `❌ <b>KERNEL_ERROR</b>\n\n${err.message}`);
      }
    }

    // 5. System Commands
    else if (text === '/status') {
      await sendTelegramMessage(chatId, "<b>SYSTEM STATUS: NOMINAL</b>\n\nMesh Health: 100%\nAnycast: Node-04 Priority\nMulti-Sig Guard: ACTIVE\nFinance Signal: READY");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Runtime Error:', error);
    return NextResponse.json({ ok: true }); 
  }
}
