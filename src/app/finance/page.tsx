
"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, 
  Send, 
  Lock, 
  Wallet, 
  RefreshCw, 
  Zap,
  Globe,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Euro,
  ExternalLink,
  Terminal,
  FileCode,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKernel } from "@/components/kernel/KernelProvider";
import { orchestratePayout } from "@/ai/flows/payout-orchestrator";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useSearchParams, useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FinancialIntelligence() {
  const { mode, emitEvent } = useKernel();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState<"PAYPAL" | "PRIYO_PAY" | "PAYONEER">("PAYPAL");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationStep, setValidationProgress] = useState(0);
  const [lastPayout, setLastPayout] = useState<any>(null);
  const [scaPending, setScaPending] = useState(false);

  useEffect(() => {
    const scaStatus = searchParams.get('sca_status');
    if (scaStatus === 'success') {
      toast({
        title: "SCA Verified",
        description: "Payoneer PIS consent granted. Executing settlement...",
      });
      // Try to recover amount/recipient from local storage or keep it in state if possible
      // For simulation, we just trigger again
      if (gateway === 'PAYONEER') {
        handlePayout();
      }
      router.replace('/finance');
    }
  }, [searchParams, router]);

  const handlePayout = async () => {
    if (!recipient || !amount) {
       toast({
         variant: "destructive",
         title: "Validation Error",
         description: "Please provide recipient identity and amount.",
       });
       return;
    }
    
    // Simulate SCA Redirect for Payoneer (EU PIS Rails)
    if (gateway === 'PAYONEER' && !scaPending && searchParams.get('sca_status') !== 'success') {
      setScaPending(true);
      emitEvent('SECURITY', 'SCA_REDIRECT_INITIATED', 2, { provider: 'Payoneer EU', rail: 'PIS' });
      toast({
        title: "SCA Required",
        description: "Redirecting to Institutional Auth Portal...",
      });
      setTimeout(() => {
        window.location.href = `${window.location.pathname}?sca_status=success&gateway=PAYONEER&amount=${amount}&recipient=${recipient}`;
      }, 1500);
      return;
    }

    setIsProcessing(true);
    setValidationProgress(10);
    setLastPayout(null);
    emitEvent('FINANCE', 'PAYOUT_INITIATED', 3, { recipient, amount, gateway });

    const steps = [
      { p: 30, msg: "Anycast Route Validation" },
      { p: 60, msg: "Sovereign Mesh Handshake" },
      { p: 90, msg: "Clearing House Handshake" }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600));
      setValidationProgress(step.p);
    }

    try {
      const result = await orchestratePayout({
        gateway,
        recipientEmail: recipient,
        amount: parseFloat(amount),
      });
      
      setLastPayout(result);
      setValidationProgress(100);
      emitEvent('FINANCE', 'PAYOUT_EXECUTED', 4, { batchId: result.batchId, status: result.status, routing: result.routingToken });
      
      toast({
        title: "Settlement Success",
        description: `Batch ${result.batchId} processed via ${gateway}.`,
      });
    } catch (error) {
      emitEvent('FINANCE', 'PAYOUT_FAILED', 1, { error: "Anycast Timeout / Kernel Intercept" });
      toast({
        variant: "destructive",
        title: "Kernel Execution Blocked",
        description: "Disbursement rejected by priority resolver.",
      });
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setValidationProgress(0);
        setScaPending(false);
      }, 1000);
    }
  };

  const isThrottled = mode === 'LOCKDOWN' || mode === 'EMERGENCY';

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 md:gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
              <span className="truncate">Fiscal Command Console</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-[9px] md:text-xs border-accent/20 text-accent font-mono shrink-0 ${isThrottled ? 'animate-pulse' : ''}`}>
              KERNEL_{mode}
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-panel border-l-4 border-l-accent overflow-hidden">
                <CardHeader className="p-4 md:p-6 bg-accent/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <Send className="h-4 w-4 text-accent" />
                        Multi-Rail Settlement System
                      </CardTitle>
                      <CardDescription className="text-[10px] uppercase font-bold tracking-widest mt-1">Bank Integration Testbed</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-[8px] bg-background">v1.2 Stable</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">1. Select Disbursement Rail</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button 
                        variant={gateway === 'PAYPAL' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setGateway('PAYPAL')}
                        disabled={isProcessing}
                        className={gateway === 'PAYPAL' ? 'bg-accent text-background' : 'text-[10px] h-9'}
                      >
                        PayPal REST v1
                      </Button>
                      <Button 
                        variant={gateway === 'PRIYO_PAY' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setGateway('PRIYO_PAY')}
                        disabled={isProcessing}
                        className={gateway === 'PRIYO_PAY' ? 'bg-accent text-background' : 'text-[10px] h-9'}
                      >
                        Priyo Pay Direct
                      </Button>
                      <Button 
                        variant={gateway === 'PAYONEER' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setGateway('PAYONEER')}
                        disabled={isProcessing}
                        className={gateway === 'PAYONEER' ? 'bg-accent text-background' : 'text-[10px] h-9'}
                      >
                        Payoneer (EU PIS)
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">2. Recipient Identity</Label>
                      <Input 
                        placeholder="Email or SSFN-ITP ID" 
                        className="h-10 text-xs bg-secondary/30 border-white/5 focus:border-accent/50"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">3. Amount (USD Equivalent)</Label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        className="h-10 text-xs bg-secondary/30 border-white/5 focus:border-accent/50"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isProcessing && (
                      <div className="space-y-2 animate-pulse">
                        <div className="flex justify-between text-[9px] font-bold text-accent uppercase tracking-widest">
                          <span>Executing Kernel Pulse...</span>
                          <span>{validationStep}%</span>
                        </div>
                        <Progress value={validationStep} className="h-1 bg-accent/10 [&>div]:bg-accent" />
                      </div>
                    )}
                    
                    <Button 
                      className={`w-full text-xs font-bold h-10 transition-all ${isThrottled ? 'bg-secondary' : 'bg-accent text-background cyan-glow'}`}
                      onClick={handlePayout}
                      disabled={isProcessing || isThrottled}
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                      {isThrottled ? 'Kernel Throttled' : `Initiate ${gateway} Test`}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {lastPayout && (
                <Card className="glass-panel border-white/10 animate-fade-in">
                  <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-accent" />
                      Technical Execution Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-60 bg-black/40 p-4">
                      <div className="space-y-1 font-mono text-[10px]">
                        {lastPayout.executionLog.map((log: string, i: number) => (
                          <div key={i} className="flex gap-2">
                            <span className="text-accent opacity-50">[{i+1}]</span>
                            <span className="text-white/80">{log}</span>
                          </div>
                        ))}
                        <div className="pt-2 text-green-400 font-bold">
                          >>> SETTLEMENT SEAL: {lastPayout.routingToken}
                        </div>
                        <div className="text-accent font-bold">
                          >>> DIRECTIVE LEVEL: {lastPayout.directiveLevel}
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-tighter">
                    <Building2 className="h-4 w-4 text-accent" />
                    Institutional Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  {lastPayout?.institutionalMetadata ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded bg-secondary/30 border border-white/5 space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                          <span className="text-muted-foreground">Gateway ID</span>
                          <span className="text-white">{lastPayout.institutionalMetadata.id}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                          <span className="text-muted-foreground">BIC / SWIFT</span>
                          <span className="text-accent">{lastPayout.institutionalMetadata.bic || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                          <span className="text-muted-foreground">Compliance</span>
                          <span className="text-green-400">{lastPayout.institutionalMetadata.compliance || 'VERIFIED'}</span>
                        </div>
                      </div>
                      <div className="p-2 rounded border border-accent/20 bg-accent/10 flex items-center gap-2 text-[10px] font-bold text-accent">
                        <ShieldCheck className="h-3 w-3" /> PSD2 / SCA ENFORCED
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 opacity-40">
                      <Globe className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-[10px] uppercase font-bold">Awaiting Execution</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-panel border-yellow-500/20">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-tighter">
                    <ShieldAlert className="h-4 w-4 text-yellow-500" />
                    Priority Resolver
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-muted-foreground font-bold">Policy</span>
                    <Badge variant="outline" className="text-[9px] border-yellow-500/30 text-yellow-500">Deterministic</Badge>
                  </div>
                  <p className="text-[9px] text-muted-foreground italic mt-2">
                    Large disbursements (&gt;$1,000) trigger automatic Imperial Directive seals and require high-clearance kernel handshake.
                  </p>
                  {parseFloat(amount) >= 1000 && (
                    <div className="mt-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/30 text-[9px] text-yellow-500 font-bold animate-pulse">
                      >>> ALERT: HIGH-VALUE DISBURSEMENT DETECTED
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}

