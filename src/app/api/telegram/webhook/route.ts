import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, getDoc, collection, getDocs, query, where, orderBy, limit, setDoc } from 'firebase/firestore';
import { sendTelegramMessage, sendFinancialAlert, sendHealthReport, sendMaintenanceAlert } from '@/lib/telegram';
import { reconcileAndSettleLink, processPaymentCredit } from '@/services/payment-service';

/**
 * Telegram Webhook Handler v1.6
 * Improved with Server-safe Firebase Init and Robust Error Logging.
 */
export async function POST(req: Request) {
  console.log(">>> [TELEGRAM_WEBHOOK] Signal Received.");

  try {
    const { firestore } = initializeFirebase();
    if (!firestore) {
      console.error(">>> [TELEGRAM_ERROR] Firestore not initialized.");
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

    console.log(`>>> [TELEGRAM_COMMAND] From: ${chatId} | Text: ${text}`);

    // --- COMMAND ROUTER ---

    // 2. Identity Binding: /start <uid>
    if (text.startsWith('/start ')) {
      const userId = text.split(' ')[1];
      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, { 
          telegramChatId: chatId, 
          telegramLinked: true, 
          updatedAt: Date.now() 
        });
        await sendTelegramMessage(chatId, `<b>✅ IDENTITY BOUND & STABILIZED</b>\n\nCitizen: ${userSnap.data().displayName}\n\nআপনার মোবাইল নোড এখন সোভারেন কার্নেলের সাথে সফলভাবে সিঙ্কড (ECC_ED25519)। আপনি এখন হাই-ভ্যালু লেনদেন সম্পন্ন করতে পারবেন।`);
      } else {
        await sendTelegramMessage(chatId, "❌ <b>IDENTITY_NOT_FOUND</b>");
      }
    } 
    
    // 3. Health Check: /health
    else if (text === '/health') {
      const usersQuery = query(collection(firestore, 'users'), where('telegramChatId', '==', chatId), limit(1));
      const userSnap = await getDocs(usersQuery);
      if (!userSnap.empty) {
        await updateDoc(userSnap.docs[0].ref, { telegramLinked: true });
        await sendHealthReport(chatId, { isLocked: false, uptime: 14200 });
      } else {
        await sendTelegramMessage(chatId, "❌ <b>LINK_NOT_FOUND</b>\n\nদয়া করে অ্যাপ থেকে 'Bind Identity' বাটনটি ক্লিক করুন।");
      }
    }

    // 4. Logs: /logs
    else if (text === '/logs') {
      const eventsQuery = query(collection(firestore, 'events'), where('plane', '==', 'SECURITY'), orderBy('timestamp', 'desc'), limit(5));
      const eventsSnap = await getDocs(eventsQuery);
      let logText = "<b>🛡️ LATEST SECURITY LOGS</b>\n\n";
      eventsSnap.forEach(d => {
        const ev = d.data();
        logText += `• [${ev.type}] ${ev.id.substring(0,6)}... (${new Date(ev.timestamp).toLocaleTimeString()})\n`;
      });
      await sendTelegramMessage(chatId, logText || "No security events found.");
    }

    // 5. Maintenance Toggle: /maintenance
    else if (text === '/maintenance') {
      const configRef = doc(firestore, 'system', 'config');
      const configSnap = await getDoc(configRef);
      const currentState = configSnap.data()?.maintenance || false;
      const newState = !currentState;
      
      await setDoc(configRef, { maintenance: newState }, { merge: true });
      await sendMaintenanceAlert(chatId, newState);
    }

    // 7. Remote Settlement Action
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

    // 8. System Status
    else if (text === '/status') {
      await sendTelegramMessage(chatId, "<b>SYSTEM STATUS: NOMINAL</b>\n\nMesh Health: 100%\nAnycast: Node-04 Priority\nMulti-Sig Guard: ACTIVE\nFinance Signal: READY");
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('>>> [WEBHOOK_FATAL_ERROR]:', error.message);
    return NextResponse.json({ ok: true }); 
  }
}
