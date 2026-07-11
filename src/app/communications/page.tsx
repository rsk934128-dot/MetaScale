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
  Wifi
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
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isTestingToken, setIsTestingToken] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'IDLE' | 'ACTIVE' | 'FAILED'>('IDLE');
  const [botInfo, setBotInfo] = useState<any>(null);
  
  const { toast } = useToast();
  const { emitEvent } = useKernel();

  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  const handleTestConnection = async () => {
    setIsTestingToken(true);
    try {
      const res = await testToken();
      if (res.ok) {
        setTokenStatus('ACTIVE');
        setBotInfo(res.result);
        toast({ title: "Gateway Alive", description: `Bot @${res.result.username} is responding.` });
      } else {
        setTokenStatus('FAILED');
        toast({ variant: "destructive", title: "Gateway Dead", description: res.description });
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
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
                        <p className="text-xs font-bold text-white uppercase">TELEGRAM_BOT_TOKEN</p>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          {tokenStatus === 'ACTIVE' ? "0xValid_Auth_Node" : "MISSING_OR_INVALID"}
                        </p>
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

                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-4 items-start shadow-xl">
                     <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-white uppercase">Critical Setup (Vercel/Hosting)</p>
                        <p className="text-[10px] text-red-400 italic leading-relaxed">
                          "নিশ্চিত করুন আপনার হোস্টিং ড্যাশবোর্ডে <b>TELEGRAM_BOT_TOKEN</b> সঠিকভাবে যোগ করা হয়েছে। টোকেন আপডেট করার পর প্রজেক্টটি একবার <b>Redeploy</b> করতে ভুলবেন না।"
                        </p>
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
                    টোকেন ভ্যালিডেশন সফল হলে নিচের "Secure Webhook" বাটনে ক্লিক করুন। এটি আপনার সার্ভারকে টেলিগ্রাম সার্ভারের সাথে সরাসরি সংযুক্ত করবে।
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
                      <a href={generateTelegramLink(user?.uid || '')} target="_blank" rel="noopener noreferrer">
                        <Zap className="mr-2 h-4 w-4 text-accent" />
                        Link Identity to Bot
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
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
                      <div className="p-2 rounded border border-accent/20 bg-accent/5 text-accent italic leading-relaxed mt-4">
                         "টেলিগ্রাম হ্যান্ডশেক সফল হলে আপনার $১,০০০ ব্যালেন্সের গেটওয়ে লকটি স্বয়ংক্রিয়ভাবে আনলক হবে।"
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
