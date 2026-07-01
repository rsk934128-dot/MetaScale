
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
  Key
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

const MOCK_EMAILS = [
  { id: '1', sender: 'alerts@infra.gov', subject: 'Sector 7 Node Latency Spike', body: 'Immediate attention required. Latency has exceeded 200ms in the anycast mesh.' },
  { id: '2', sender: 'treasury@finance.gov', subject: 'Fiscal Disbursement Approval', body: 'Batch FALLBACK_P180_X92 requires imperial directive seal for amounts > $5000.' },
  { id: '3', sender: 'public@civic.gov', subject: 'River Level Alert', body: 'Sensors in Sector 2 reporting 0.5m rise in last 30 minutes.' },
];

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
        toast({ title: "Webhook Secured", description: "Telegram bot is now inter-linked with the Sovereign Kernel." });
      } else {
        toast({ variant: "destructive", title: "Webhook Failed", description: res?.description || "Could not establish secure callback." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Connection Error" });
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
              {/* Telegram Gateway Section */}
              <Card className="glass-panel border-l-4 border-l-accent bg-accent/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant={profile?.telegramLinked ? "default" : "outline"} className={profile?.telegramLinked ? "bg-green-500/20 text-green-400" : "animate-pulse"}>
                    {profile?.telegramLinked ? "GATEWAY_ACTIVE" : "AWAITING_LINK"}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-headline italic uppercase tracking-tighter flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-accent" />
                    Telegram Alert Gateway
                  </CardTitle>
                  <CardDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground">@Coolrubelbank2bot • Security Sync</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    "সরাসরি আপনার টেলিগ্রামে কার্নেল অ্যালার্ট, ওটিপি এবং সিকিউরিটি নোটিফিকেশন পেতে আপনার সোভারেন আইডি লিঙ্ক করুন।"
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase">
                        <ShieldCheck className="h-3.5 w-3.5" /> Identity Status
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Mesh Binding</span>
                        <span className={profile?.telegramLinked ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{profile?.telegramLinked ? "BOUND" : "UNLINKED"}</span>
                      </div>
                      <Button variant="ghost" className="w-full h-8 text-[9px] font-bold uppercase border border-white/5" onClick={handleTestOTP} disabled={isOtpLoading}>
                         {isOtpLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                         Test Secure OTP
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button asChild className="h-11 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow">
                        <a href={generateTelegramLink(user?.uid || '')} target="_blank" rel="noopener noreferrer">
                          <Zap className="mr-2 h-4 w-4" /> Initialize Gateway
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-11 border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest" 
                        onClick={handleSetWebhook} 
                        disabled={isWebhookLoading}
                      >
                        {isWebhookLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                        Secure Webhook
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Alerts History / Keyboards simulation info */}
              <Card className="glass-panel border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest">
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                    Interactive Security Directives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 space-y-4">
                     <p className="text-xs text-white/70 italic">"টেলিগ্রামে পাঠানো হাই-ভ্যালু অ্যালার্টগুলোতে এখন সরাসরি এপ্রুভাল বাটন থাকবে।"</p>
                     <div className="flex gap-2">
                        <div className="px-3 py-2 rounded-lg bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/30">APPROVE</div>
                        <div className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">REJECT</div>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-tighter">
                    <Key className="h-4 w-4 text-accent" />
                    OTP Control Protocol
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                         <span className="text-muted-foreground uppercase">TTL Threshold</span>
                         <span className="text-white">5 Minutes</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                         <span className="text-muted-foreground uppercase">Encryption</span>
                         <span className="text-green-400">ECC_ED25519</span>
                      </div>
                      <div className="p-2 rounded border border-accent/20 bg-accent/5 text-[9px] text-accent italic leading-relaxed">
                         "ওটিপি ভেরিফিকেশন এখন পেমেন্ট রিম্যাডিয়েশন এবং হাই-ভ্যালু পে-আউটের জন্য বাধ্যতামূলক।"
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
