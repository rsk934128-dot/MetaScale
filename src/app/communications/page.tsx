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
  Activity,
  Terminal,
  Wifi,
  HelpCircle,
  FileCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { analyzeCommunication } from "@/ai/flows/communication-intelligence";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { generateTelegramLink, setTelegramWebhook, testToken } from "@/lib/telegram";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function CommunicationPlanePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isWebhookLoading, setIsWebhookLoading] = useState(false);
  const [isTestingToken, setIsTestingToken] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'IDLE' | 'ACTIVE' | 'FAILED'>('IDLE');
  const [botInfo, setBotInfo] = useState<any>(null);
  const [tgLink, setTgLink] = useState("");
  
  const { toast } = useToast();
  const { emitEvent } = useKernel();

  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  useEffect(() => {
    if (user?.uid) {
      generateTelegramLink(user.uid).then(setTgLink);
    }
  }, [user?.uid]);

  const handleTestConnection = async () => {
    setIsTestingToken(true);
    try {
      const res = await testToken();
      if (res.ok) {
        setTokenStatus('ACTIVE');
        setBotInfo(res.result);
        toast({ title: "Gateway Alive", description: `Bot @${res.result.username} is responding.` });
        emitEvent('SECURITY', 'TELEGRAM_TOKEN_VALIDATED', 3, { bot: res.result.username });
      } else {
        setTokenStatus('FAILED');
        toast({ variant: "destructive", title: "Gateway Dead", description: res.description || "টোকেনটি অবৈধ বা এনভায়রনমেন্টে পাওয়া যায়নি।" });
        emitEvent('SECURITY', 'TELEGRAM_TOKEN_INVALID', 1, { error: res.description });
      }
    } catch (err) {
      setTokenStatus('FAILED');
    } finally {
      setIsTestingToken(false);
    }
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
      toast({ variant: "destructive", title: "Connection Error", description: "প্রোটোকল হ্যান্ডশেক রিজেক্ট করা হয়েছে।" });
    } finally {
      setIsWebhookLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
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
          <div className="flex items-center gap-3">
             <Badge variant="outline" className={cn(
               "font-mono text-[10px] uppercase",
               tokenStatus === 'ACTIVE' ? "border-green-500 text-green-400" : "border-red-500 text-red-400"
             )}>
                GATEWAY: {tokenStatus}
             </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* Configuration Status Card */}
              <Card className="glass-panel border-l-4 border-l-primary bg-primary/5 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-headline italic uppercase tracking-tighter flex items-center gap-3 text-white">
                    <Server className="h-6 w-6 text-primary" />
                    Infrastructure Diagnostics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Environment Check</span>
                        {tokenStatus === 'ACTIVE' ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white uppercase tracking-widest">Variable Name</p>
                        <code className="text-[10px] font-mono text-accent bg-accent/5 px-2 py-1 rounded border border-accent/20">TELEGRAM_BOT_TOKEN</code>
                      </div>
                      <Button 
                        onClick={handleTestConnection} 
                        disabled={isTestingToken}
                        className="w-full h-10 bg-secondary/50 hover:bg-secondary border border-white/10 text-[10px] font-bold uppercase"
                      >
                        {isTestingToken ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Wifi className="h-3 w-3 mr-2" />}
                        Run Live Handshake
                      </Button>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bot Identity</span>
                        <Bot className="h-4 w-4 text-accent" />
                      </div>
                      {botInfo ? (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white uppercase">{botInfo.first_name}</p>
                          <p className="text-[10px] font-mono text-accent">@{botInfo.username}</p>
                        </div>
                      ) : (
                        <div className="space-y-1 opacity-30 italic">
                          <p className="text-xs text-white uppercase tracking-tighter">Awaiting Discovery</p>
                          <p className="text-[10px]">No info available</p>
                        </div>
                      )}
                      <Button asChild className="w-full h-10 bg-accent text-background font-bold text-[10px] uppercase">
                        <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer">
                          Get Token from BotFather
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Troubleshooting Manual */}
              <Card className="glass-panel border-white/5 bg-secondary/10 overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5">
                   <CardTitle className="text-xs uppercase flex items-center gap-2 text-white/70 tracking-widest">
                      <HelpCircle className="h-4 w-4 text-accent" />
                      Troubleshooting Manual (নির্দেশিকা)
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <div className="flex items-start gap-4">
                            <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs shrink-0">1</div>
                            <div className="space-y-1">
                               <p className="text-xs font-bold text-white uppercase">Name Mismatch Check</p>
                               <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                  আপনার হোস্টিং ড্যাশবোর্ড-এ (Vercel/Firebase) ভেরিয়েবল-এর নাম অবশ্যই <b>TELEGRAM_BOT_TOKEN</b> হতে হবে। কোনো অতিরিক্ত অক্ষর বা সংখ্যা থাকা যাবে না।
                               </p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs shrink-0">2</div>
                            <div className="space-y-1">
                               <p className="text-xs font-bold text-white uppercase">Redeploy Requirement</p>
                               <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                  ভেরিয়েবল সেট করার পর অবশ্যই প্রজেক্টটি একবার <b>Redeploy</b> করতে হবে। রি-ডেপ্লয় না করলে সার্ভার নতুন টোকেনটি চিনতে পারবে না।
                               </p>
                            </div>
                         </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
                         <div className="flex items-center gap-2 text-red-400">
                            <ShieldAlert className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Critical Security Alert</span>
                         </div>
                         <p className="text-[11px] text-white/80 italic leading-relaxed">
                            "আপনার বটের সিক্রেট টোকেনটি প্রোটেক্টেড রাখুন। এটি আপনার কার্নেলের মেইন চাবিকাঠি।"
                         </p>
                         <div className="pt-2">
                            <Badge variant="outline" className="border-red-500/30 text-red-400 text-[8px] uppercase">Always Keep Tokens Private</Badge>
                         </div>
                      </div>
                   </div>
                </CardContent>
              </Card>

              {/* Telegram Gateway Section */}
              <Card className="glass-panel border-l-4 border-l-accent bg-accent/5 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-headline italic uppercase tracking-tighter flex items-center gap-3 text-white">
                    <MessageSquare className="h-6 w-6 text-accent" />
                    Gateway Handshake
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    টোকেন ভ্যালিডেশন সফল হলে "Secure Webhook" বাটনে ক্লিক করুন। এটি আপনার সার্ভারকে সরাসরি বটের সাথে কানেক্ট করবে।
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="flex-1 h-14 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow"
                      onClick={handleSetWebhook}
                      disabled={isWebhookLoading || tokenStatus !== 'ACTIVE'}
                    >
                      {isWebhookLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                      Establish Secure Webhook
                    </Button>
                    <Button asChild variant="outline" className="flex-1 h-14 border-white/10 font-bold uppercase tracking-widest text-[10px]">
                      <a href={tgLink} target="_blank" rel="noopener noreferrer">
                        <Zap className="mr-2 h-4 w-4 text-accent" />
                        Link Identity to Bot
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Card className="glass-panel border-white/5">
                <CardHeader className="p-4 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest text-white">
                    <Terminal className="h-4 w-4 text-accent" />
                    Handshake Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                   <div className="space-y-3 font-mono text-[9px] md:text-[10px] text-white/60">
                      <p>&gt; Initializing pre-flight check...</p>
                      <p className={cn(tokenStatus === 'ACTIVE' ? "text-green-400" : "text-yellow-500")}>
                        &gt; BOT_TOKEN status: {tokenStatus === 'ACTIVE' ? "VALIDATED" : "AWAITING_TEST"}
                      </p>
                      <p>&gt; Checking Webhook tunnel...</p>
                      <p className={cn(profile?.telegramLinked ? "text-green-400" : "text-white/40")}>
                        &gt; Identity Bound: {profile?.telegramLinked ? "YES" : "NO"}
                      </p>
                      <div className="p-3 rounded border border-accent/20 bg-accent/5 text-accent italic leading-relaxed mt-4">
                         "মনে রাখবেন: ভেরিয়েবল সেভ করার পর অবশ্যই একবার <b>REDEPLOY</b> বাটনে ক্লিক করতে হবে।"
                      </div>
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
