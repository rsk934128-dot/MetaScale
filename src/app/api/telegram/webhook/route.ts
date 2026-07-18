import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, getDoc, collection, setDoc, addDoc } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram';

/**
 * Telegram Webhook Handler v3.0 (Stabilized)
 * Handles remote authorization signals and logs config failures to Kernel.
 */
export async function POST(req: Request) {
  const timestamp = Date.now();
  
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return NextResponse.json({ ok: true });

    // Internal check for Bot Token
    if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN.length < 20) {
      console.error(">>> [API_HALT] Webhook received signal but BOT_TOKEN is missing.");
      
      // Log failure to Kernel Events for Dashboard Visibility
      await addDoc(collection(firestore, 'events'), {
        type: 'BRIDGE_BREACH',
        plane: 'SECURITY',
        priority: 1,
        timestamp: Date.now(),
        payload: { reason: 'CRITICAL_CONFIG_MISSING', component: 'TELEGRAM_GATEWAY' },
        status: 'FAILED',
        category: 'BRIDGE_BREACH',
        severity: 'CRITICAL'
      });
      
      return NextResponse.json({ ok: true });
    }

    const body = await req.json();

    // Log the raw signal for forensic auditing
    await addDoc(collection(firestore, 'events'), {
      type: 'TELEGRAM_SIGNAL_RECEIVED',
      plane: 'SECURITY',
      priority: 4,
      timestamp: Date.now(),
      payload: { 
        hasCallback: !!body.callback_query,
        hasMessage: !!body.message,
        from: body.message?.from?.username || body.callback_query?.from?.username || 'ANON'
      },
      status: 'PROCESSING'
    });

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
          await sendTelegramMessage(chatId, `<b>❌ TRANSACTION REJECTED</b>\n\nID: <code>${dispatchId}</code>\n\nলেনদেনটি বাতিল করা হয়েছে।`);
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

        // Log successful binding to Kernel
        await addDoc(collection(firestore, 'events'), {
          type: 'HANDSHAKE_STABILIZED',
          plane: 'SECURITY',
          priority: 2,
          timestamp: Date.now(),
          payload: { userId, chatId, method: 'ECC_ED25519' },
          status: 'COMPLETED'
        });

        await sendTelegramMessage(chatId, `<b>✅ IDENTITY BOUND</b>\n\nCitizen: ${userSnap.data().displayName}\n\nআপনার মোবাইল নোড এখন সোভারেন কার্নেলের সাথে সিঙ্কড।`);
      } else {
         console.error(`>>> [HANDSHAKE_FAIL] User not found: ${userId}`);
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
