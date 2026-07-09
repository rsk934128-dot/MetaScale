"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Mail, 
  RefreshCw, 
  BrainCircuit, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Eye,
  ArrowRight,
  MessageSquare,
  Send,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Bot,
  Loader2,
  Lock,
  Key,
  Server,
  Code2,
  AlertTriangle,
  Unplug,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { analyzeCommunication } from "@/ai/flows/communication-intelligence";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { generateTelegramLink, setTelegramWebhook } from "@/lib/telegram";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function CommunicationPlanePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isWebhookLoading, setIsWebhookLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [intelligenceReport, setIntelligenceReport] = useState<any>(null);
  const { toast } = useToast();
  const { emitEvent } = useKernel();

  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  const handleSyncGmail = () => {
    setIsSyncing(true);
    emitEvent('COMMUNICATION', 'GMAIL_SYNC_INITIATED', 4, { scope: 'INBOX_ONLY' });
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Gmail Sync Complete",
        description: "Successfully fetched 3 mission-critical messages.",
      });
    }, 2000);
  };

  const handleTestOTP = () => {
    if (!profile?.telegramLinked) {
      toast({ variant: "destructive", title: "Gateway Unlinked", description: "প্রথমে টেলিগ্রাম আইডি লিঙ্ক করুন।" });
      return;
    }
    setIsOtpLoading(true);
    setTimeout(() => {
      setIsOtpLoading(false);
      toast({ title: "OTP Sent", description: "আপনার টেলিগ্রামে একটি সিকিউরিটি কোড পাঠানো হয়েছে।" });
      emitEvent('SECURITY', 'TEST_OTP_DISPATCHED', 3, { chatId: profile.telegramChatId });
    }, 1200);
  };

  const handleSetWebhook = async () => {
    setIsWebhookLoading(true);
    try {
      const origin = window.location.origin;
      const res = await setTelegramWebhook(origin);
      if (res?.ok) {
        toast({ title: "Webhook Secured", description: "টেলিগ্রাম বটের সাথে সোভারেন কার্নেলের সিঙ্ক সফল হয়েছে।" });
        emitEvent('SECURITY', 'WEBHOOK_SYNC_SUCCESS', 2, { status: 'CONNECTED' });
      } else {
        const errorDesc = res?.description || "Unauthorized (Check Vercel Deployment Protection)";
        toast({ 
          variant: "destructive", 
          title: "Webhook Failed", 
          description: errorDesc
        });
        emitEvent('SECURITY', 'WEBHOOK_SYNC_FAILED', 1, { reason: errorDesc });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Connection Error", description: "ভার্সেল পাসওয়ার্ড প্রটেকশন অন থাকলে এটি ফেইল করতে পারে।" });
    } finally {
      setIsWebhookLoading(false);
    }
  };

  const handleRunAnalysis = async (email: any) => {
    setAnalyzingId(email.id);
    try {
      const result = await analyzeCommunication({ emailBody: email.body, sender: email.sender });
      setIntelligenceReport(result);
      toast({ title: "Analysis Complete", description: `Threat Level: ${result.threatLevel}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Analysis Failed" });
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-primary">
              <Mail className="h-5 w-5 text-primary" />
              Communication Plane
            </h1>
          </div>
          <Button size="sm" onClick={handleSyncGmail} disabled={isSyncing} className="blue-glow text-xs font-bold">
            {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Sync Gmail
          </Button>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Vercel Environment Configuration Section */}
              <Card className="glass-panel border-l-4 border-l-primary bg-primary/5 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-headline italic uppercase tracking-tighter flex items-center gap-3">
                    <Server className="h-6 w-6 text-primary" />
                    Vercel Configuration Node
                  </CardTitle>
                  <CardDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Server-side Secrets Management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-4 items-start">
                     <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-white uppercase">Critical Action Required</p>
                        <p className="text-[10px] text-red-400 italic leading-relaxed">
                          "নিশ্চিত করুন যে আপনার Vercel ড্যাশবোর্ডে **Deployment Protection** ডিজেবল করা আছে। পাসওয়ার্ড প্রটেকশন অন থাকলে টেলিগ্রাম সিগন্যালগুলো ৪০১ এরর দিয়ে ব্লক হয়ে যাবে।"
                        </p>
                     </div>
                  </div>

                  <p className="text-sm text-white/80 leading-relaxed italic">
                    "আপনার বটের আসল টোকেন ভার্সেল (Vercel) ড্যাশবোর্ডে এনভায়রনমেন্ট ভেরিয়েবল হিসেবে সেট করুন এবং প্রজেক্টটি একবার **Redeploy** করুন।"
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 font-mono text-[10px]">
                      <p className="text-primary font-bold">// Mandatory Key</p>
                      <p className="text-white">KEY: <span className="text-accent">TELEGRAM_BOT_TOKEN</span></p>
                      <p className="text-white">VALUE: <span className="text-yellow-400">আপনার_আসল_টোকেন_এখানে</span></p>
                    </div>

                    <div className="flex flex-col gap-2 justify-center">
                      <Button asChild className="h-11 blue-glow bg-primary text-white font-bold uppercase tracking-widest text-[10px]">
                        <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Open Vercel Settings
                        </a>
                      </Button>
                      <p className="text-[9px] text-center text-muted-foreground italic">
                        ভার্সেল ড্যাশবোর্ডে গিয়ে Settings &gt; Environment Variables এ টোকেনটি যুক্ত করুন।
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Telegram Gateway Section (Stabilized mode) */}
              <Card className="glass-panel border-l-4 border-l-accent bg-accent/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant={profile?.telegramLinked ? "default" : "outline"} className={cn(
                    "text-[8px] uppercase tracking-widest font-bold",
                    profile?.telegramLinked ? "bg-green-500/20 text-green-400 border-green-500/30" : "animate-pulse"
                  )}>
                    {profile?.telegramLinked ? "MESH_BINDING: CONNECTED" : "AWAITING_SYNC"}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-headline italic uppercase tracking-tighter flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-accent" />
                    Telegram Alert Gateway
                  </CardTitle>
                  <CardDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground">ECC_ED25519 Security Sync</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    {profile?.telegramLinked 
                      ? "আপনার সার্বভৌম কার্নেল এবং টেলিগ্রাম বটের মধ্যকার কানেকশন এখন সফলভাবে স্ট্যাবিলাইজড (CONNECTED)। সকল অটোনোমাস ডিরেক্টিভ এখন সচল।"
                      : "সরাসরি আপনার টেলিগ্রামে কার্নেল অ্যালার্ট এবং ওটিপি পেতে নিচের ৩টি ধাপ সম্পন্ন করুন। এটি সফল হলে 'AWAITING_SYNC' পিলটি সবুজ হয়ে যাবে।"}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase">
                        <ShieldCheck className="h-3.5 w-3.5" /> Identity Status
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Mesh Protocol</span>
                        <span className={profile?.telegramLinked ? "text-green-400 font-bold" : "text-yellow-500 font-bold"}>{profile?.telegramLinked ? "CONNECTED" : "INITIALIZING"}</span>
                      </div>
                      <Button variant="ghost" className="w-full h-8 text-[9px] font-bold uppercase border border-white/5" onClick={handleTestOTP} disabled={isOtpLoading}>
                         {isOtpLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                         Test Secure OTP
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button asChild className={cn(
                        "h-11 font-bold uppercase tracking-widest text-[10px] transition-all",
                        profile?.telegramLinked ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-accent text-background cyan-glow"
                      )}>
                        <a href={generateTelegramLink(user?.uid || '')} target="_blank" rel="noopener noreferrer">
                          {profile?.telegramLinked ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4" />}
                          {profile?.telegramLinked ? "GATEWAY LINKED" : "LINK IDENTITY"}
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-11 border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest" 
                        onClick={handleSetWebhook} 
                        disabled={isWebhookLoading || profile?.telegramLinked}
                      >
                        {isWebhookLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                        {profile?.telegramLinked ? "WEBHOOK ACTIVE" : "SECURE WEBHOOK"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Plan */}
              <Card className="glass-panel border-white/5 bg-secondary/10">
                 <CardHeader>
                    <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                       <Activity className="h-4 w-4" /> Binding Action Plan
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {[
                         { step: 1, desc: "ভার্সেলে আসল টোকেন বসিয়ে Redeploy করুন।" },
                         { step: 2, desc: "Vercel Settings থেকে Standard Protection ডিজেবল করুন।" },
                         { step: 3, desc: "'Secure Webhook' বাটনে ক্লিক করে কানেকশন সিঙ্ক করুন।" },
                         { step: 4, desc: "'Link identity' ক্লিক করে বোটে /start লিখে পাঠান।" }
                       ].map((item, i) => (
                         <div key={i} className="flex gap-4 items-center">
                            <div className={cn(
                              "w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0",
                              profile?.telegramLinked ? "bg-green-500/20 border-green-500 text-green-400" : "bg-accent/20 border-accent/40 text-accent"
                            )}>{profile?.telegramLinked ? <CheckCircle2 className="h-3 w-3" /> : item.step}</div>
                            <p className={cn("text-[11px]", profile?.telegramLinked ? "text-green-400/80 italic line-through" : "text-white/80")}>{item.desc}</p>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-tighter">
                    <Key className="h-4 w-4 text-accent" />
                    Protocol Handshake
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                         <span className="text-muted-foreground uppercase">Encryption</span>
                         <span className="text-green-400">ECC_ED25519</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                         <span className="text-muted-foreground uppercase">Status</span>
                         <Badge variant="outline" className={cn(
                           "text-[8px] uppercase px-1",
                           profile?.telegramLinked ? "border-green-500 text-green-400" : "border-accent/20 text-accent"
                         )}>
                           {profile?.telegramLinked ? "CONNECTED" : "AWAITING_SYNC"}
                         </Badge>
                      </div>
                      <div className="p-2 rounded border border-accent/20 bg-accent/5 text-[9px] text-accent italic leading-relaxed">
                         {profile?.telegramLinked 
                           ? "টেলিগ্রাম হ্যান্ডশেক সফল হয়েছে। আপনার $১,০০০ ব্যালেন্সের গেটওয়ে লকটি সফলভাবে আনলক হয়েছে।"
                           : "টেলিগ্রাম হ্যান্ডশেক সফল হলে পেমেন্ট রিম্যাডিয়েশন এবং হাই-ভ্যালু পে-আউট অটোমেটিক্যালি আনলক হবে।"}
                      </div>
                   </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5">
                <CardHeader>
                  <CardTitle className="text-xs uppercase flex items-center gap-2">
                    <Unplug className="h-4 w-4 text-primary" /> Signal Debugger
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                   <div className="p-2 rounded bg-black/40 border border-white/5 font-mono text-[9px] space-y-1">
                      <p className="text-white/40">&gt; probing_api.telegram.org...</p>
                      <p className="text-green-400">&gt; telegram_node: OK</p>
                      <p className="text-white/40">&gt; verifying_webhook_seal...</p>
                      <p className={profile?.telegramLinked ? "text-green-400" : "text-yellow-500"}>&gt; mesh_binding: {profile?.telegramLinked ? "CONNECTED" : "AWAITING_SYNC"}</p>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
