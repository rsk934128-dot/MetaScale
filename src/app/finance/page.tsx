
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
  ExternalLink
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
      setGateway('PAYONEER');
      handlePayout();
      router.replace('/finance');
    }
  }, [searchParams, router]);

  const handlePayout = async () => {
    if (!recipient || !amount) return;
    
    if (gateway === 'PAYONEER' && !scaPending && searchParams.get('sca_status') !== 'success') {
      setScaPending(true);
      emitEvent('SECURITY', 'SCA_REDIRECT_INITIATED', 2, { provider: 'Payoneer EU' });
      toast({
        title: "SCA Required",
        description: "Redirecting...",
      });
      setTimeout(() => {
        window.location.href = `${window.location.pathname}?sca_status=success`;
      }, 1500);
      return;
    }

    setIsProcessing(true);
    setValidationProgress(10);
    emitEvent('FINANCE', 'PAYOUT_INITIATED', 3, { recipient, amount, gateway });

    const steps = [
      { p: 30, msg: "Route Validation" },
      { p: 60, msg: "Handshake" },
      { p: 90, msg: "Clearance" }
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
      emitEvent('FINANCE', 'PAYOUT_EXECUTED', 4, { batchId: result.batchId, status: result.status });
      
      toast({
        title: "Success",
        description: `Batch ${result.batchId} processed.`,
      });
    } catch (error) {
      emitEvent('FINANCE', 'PAYOUT_FAILED', 1, { error: "Anycast Timeout" });
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Kernel intercept.",
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
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0" />
              <span className="truncate">Fiscal Command</span>
            </h1>
          </div>
          <Badge variant="outline" className={`text-[9px] md:text-xs border-accent/20 text-accent font-mono shrink-0 ${isThrottled ? 'animate-pulse' : ''}`}>
            {mode}
          </Badge>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="disbursement">
                <TabsList className="bg-secondary/50 border border-white/5 w-full justify-start overflow-x-auto">
                  <TabsTrigger value="disbursement" className="text-xs">Disbursement</TabsTrigger>
                  <TabsTrigger value="treasury" className="text-xs">Treasury</TabsTrigger>
                </TabsList>

                <TabsContent value="disbursement" className="mt-4">
                  <Card className="glass-panel border-l-4 border-l-accent">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <Send className="h-4 w-4 text-accent" />
                        Multi-Rail Settlement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs">Select Rail</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <Button 
                            variant={gateway === 'PAYPAL' ? 'default' : 'outline'} 
                            size="sm" 
                            onClick={() => setGateway('PAYPAL')}
                            disabled={isProcessing}
                            className="text-[10px] h-8"
                          >
                            PayPal
                          </Button>
                          <Button 
                            variant={gateway === 'PRIYO_PAY' ? 'default' : 'outline'} 
                            size="sm" 
                            onClick={() => setGateway('PRIYO_PAY')}
                            disabled={isProcessing}
                            className="text-[10px] h-8"
                          >
                            Priyo
                          </Button>
                          <Button 
                            variant={gateway === 'PAYONEER' ? 'default' : 'outline'} 
                            size="sm" 
                            onClick={() => setGateway('PAYONEER')}
                            disabled={isProcessing}
                            className="text-[10px] h-8"
                          >
                            Payoneer
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Recipient</Label>
                          <Input 
                            placeholder="Email / IBAN" 
                            className="h-9 text-xs bg-secondary/30"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Amount</Label>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            className="h-9 text-xs bg-secondary/30"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {isProcessing && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-bold text-accent">
                              <span>Validating...</span>
                              <span>{validationStep}%</span>
                            </div>
                            <Progress value={validationStep} className="h-1 bg-accent/10" />
                          </div>
                        )}
                        
                        <Button 
                          className={`w-full text-xs font-bold h-9 ${isThrottled ? 'bg-secondary' : 'bg-accent text-background'}`}
                          onClick={handlePayout}
                          disabled={isProcessing || isThrottled}
                        >
                          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                          {isThrottled ? 'Throttled' : 'Execute Batch'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-accent" />
                    Institutional
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  <div className="p-3 rounded bg-secondary/30 border border-white/5 space-y-2">
                    <p className="text-[9px] uppercase font-bold text-accent">Cluster: Global-Proxy-01</p>
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span>Usage</span>
                      <span>12.4%</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '12.4%' }} />
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
