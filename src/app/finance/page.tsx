"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, 
  ArrowUpRight, 
  Send, 
  Lock, 
  ShieldAlert, 
  Wallet, 
  RefreshCw, 
  Zap,
  Globe,
  Scale,
  Fingerprint,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle
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

export default function FinancialIntelligence() {
  const { mode, emitEvent } = useKernel();
  const { toast } = useToast();
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState<"PAYPAL" | "PRIYO_PAY">("PAYPAL");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationStep, setValidationProgress] = useState(0);
  const [lastPayout, setLastPayout] = useState<any>(null);

  const handlePayout = async () => {
    if (!recipient || !amount) return;
    
    setIsProcessing(true);
    setValidationProgress(10);
    emitEvent('FINANCE', 'PAYOUT_INITIATED', 3, { recipient, amount, gateway });

    // Simulate Anycast Validation Steps
    const steps = [
      { p: 30, msg: "Validating Anycast Route: Dhaka -> PayPal Cloud" },
      { p: 60, msg: "Verifying Identity Binding for UBO Farid Sheikh" },
      { p: 90, msg: "Executing Imperial Directive Clearance" }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800));
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
      emitEvent('FINANCE', 'PAYOUT_EXECUTED', 4, { batchId: result.batchId, status: result.status });
      
      toast({
        title: "Disbursement Complete",
        description: `Batch ${result.batchId} processed via ${gateway}.`,
      });
    } catch (error) {
      emitEvent('FINANCE', 'PAYOUT_FAILED', 1, { error: "API Failure" });
      toast({
        variant: "destructive",
        title: "Payout Failed",
        description: "Kernel intercept: Secure routing failure.",
      });
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setValidationProgress(0);
      }, 1000);
    }
  };

  const isThrottled = mode === 'LOCKDOWN' || mode === 'EMERGENCY';

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Fiscal Command & Trust Fabric
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`border-accent/20 text-accent font-mono ${isThrottled ? 'animate-pulse text-yellow-400' : ''}`}>
              MODE: {mode}
            </Badge>
            {isThrottled && (
              <Badge variant="destructive" className="text-[10px]">
                <AlertTriangle className="mr-1 h-3 w-3" /> Payouts Throttled
              </Badge>
            )}
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <Tabs defaultValue="disbursement">
                <TabsList className="bg-secondary/50 border border-white/5">
                  <TabsTrigger value="disbursement">Disbursement Engine</TabsTrigger>
                  <TabsTrigger value="treasury">Treasury Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="disbursement" className="mt-6">
                  <Card className="glass-panel border-l-4 border-l-accent">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-accent" />
                        Automated Payout (PayPal / Priyo Pay)
                      </CardTitle>
                      <CardDescription>
                        Programmatic disbursement logic with Anycast path validation and Imperial Directive overrides.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Select Gateway</Label>
                          <div className="flex gap-2">
                            <Button 
                              variant={gateway === 'PAYPAL' ? 'default' : 'outline'} 
                              size="sm" 
                              className="flex-1"
                              onClick={() => setGateway('PAYPAL')}
                              disabled={isProcessing}
                            >
                              PayPal Business
                            </Button>
                            <Button 
                              variant={gateway === 'PRIYO_PAY' ? 'default' : 'outline'} 
                              size="sm" 
                              className="flex-1"
                              onClick={() => setGateway('PRIYO_PAY')}
                              disabled={isProcessing}
                            >
                              Priyo Pay (Private)
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Input value="USD" disabled className="bg-secondary/30" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Recipient Email</Label>
                          <Input 
                            placeholder="user@example.com" 
                            className="bg-secondary/30"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Disbursement Amount</Label>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            className="bg-secondary/30"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {isProcessing && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] uppercase font-bold text-accent">
                              <span>Sovereign Path Validation</span>
                              <span>{validationStep}%</span>
                            </div>
                            <Progress value={validationStep} className="h-1 bg-accent/10 [&>div]:bg-accent" />
                          </div>
                        )}
                        
                        <Button 
                          className={`w-full cyan-glow font-bold ${isThrottled ? 'bg-secondary text-muted-foreground' : 'bg-accent text-background'}`}
                          onClick={handlePayout}
                          disabled={isProcessing || isThrottled}
                        >
                          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                          {isThrottled ? 'Kernel Throttling Active' : 'Execute Sovereign Batch Payout'}
                        </Button>
                      </div>

                      {lastPayout && (
                        <div className="p-4 rounded-lg bg-secondary/20 border border-accent/20 animate-fade-in">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase text-accent">Batch Success</span>
                              <Badge variant="outline" className="text-[8px] bg-accent/5">{lastPayout.directiveLevel}</Badge>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-mono">{lastPayout.routingToken}</Badge>
                          </div>
                          <div className="space-y-1">
                            {lastPayout.executionLog.map((log: string, i: number) => (
                              <p key={i} className="text-[10px] text-muted-foreground font-mono">
                                > {log}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    Secure Routing Mesh
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded bg-secondary/30 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground">Anycast Cluster</span>
                      <Badge variant="outline" className="text-[8px] text-green-400 border-green-400/20">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-accent">
                      <Globe className="h-3 w-3" /> Node: Knowledge-Node-01
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground italic">
                      "Imperial Directive Level: Alpha Enabled"
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span>Daily Limit Usage</span>
                      <span>12%</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '12%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-sm">Verified Wallets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   {[
                     { label: "Rubelpay Primary", addr: "0xaf3c...1207", type: "BNB", verified: true },
                     { label: "Partner Escrow", addr: "0x742d...444e", type: "ETH", verified: true }
                   ].map((w, i) => (
                     <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/20 border border-white/5">
                        <div className="flex flex-col">
                           <div className="flex items-center gap-1">
                             <span className="text-[10px] font-bold">{w.label}</span>
                             {w.verified && <CheckCircle2 className="h-2 w-2 text-green-400" />}
                           </div>
                           <span className="text-[8px] font-mono text-muted-foreground">{w.addr}</span>
                        </div>
                        <Badge variant="outline" className="text-[8px]">{w.type}</Badge>
                     </div>
                   ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
