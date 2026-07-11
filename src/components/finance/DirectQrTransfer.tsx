"use client";

import { useState } from "react";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { 
  Zap, 
  Smartphone, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  ShieldCheck,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import dynamic from "next/dynamic";

// Dynamic import for the scanner to avoid SSR issues
const QrScannerModal = dynamic(() => import("./QrScannerModal"), { ssr: false });

export function DirectQrTransfer() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress(true);
  const { emitEvent } = useKernel();
  const { toast } = useToast();

  const [showScanner, setShowScanner] = useState(false);
  const [sendAmount, setSendAmount] = useState("1.0");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScanSuccess = async (scannedAddress: string) => {
    setShowScanner(false);
    
    if (!userAddress) {
      toast({ 
        variant: "destructive", 
        title: "Handshake Missing", 
        description: "দয়া করে প্রথমে আপনার টেলিগ্রাম ওয়ালেট কানেক্ট করুন।" 
      });
      return;
    }

    setIsProcessing(true);
    emitEvent('FINANCE', 'QR_TRANSFER_INITIATED', 2, { target: scannedAddress, amount: sendAmount });

    try {
      // Conversion: 1 GRAM = 10^9 nanograms
      const amountInNanograms = (parseFloat(sendAmount) * 1e9).toString();

      const transactionPayload = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minute security timeout
        messages: [
          {
            address: scannedAddress,
            amount: amountInNanograms,
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transactionPayload);
      
      emitEvent('FINANCE', 'QR_TRANSFER_SUCCESS', 1, { boc: result.boc, amount: sendAmount });
      
      toast({ 
        title: "Transfer Authorized", 
        description: `অভিনন্দন! ${sendAmount} GRAM সফলভাবে পাঠানো হয়েছে। (T+0 Finality)`,
      });
    } catch (error: any) {
      console.error("Payment dispatch failed:", error);
      emitEvent('SECURITY', 'QR_TRANSFER_FAILED', 1, { error: error.message });
      toast({ 
        variant: "destructive", 
        title: "Transfer Rejected", 
        description: "ট্রানজ্যাকশনটি সিগন্যাল ফেইলরের কারণে সম্পন্ন করা যায়নি।" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="glass-panel border-accent/20 bg-accent/5 overflow-hidden shadow-2xl max-w-xl mx-auto">
      <div className="absolute top-0 left-0 w-full h-1 bg-accent animate-pulse" />
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-widest text-accent italic">
          <QrCode className="h-5 w-5 text-accent" />
          Direct QR Transfer
        </CardTitle>
        <CardDescription className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
          Instant GRAM_MAINNET Settlement
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Disbursement Amount (GRAM)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
              <Input 
                type="number" 
                placeholder="1.0" 
                className="bg-secondary/30 border-white/5 h-14 pl-10 text-2xl font-headline font-bold"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <p className="text-[9px] text-muted-foreground italic">1 GRAM = 10^9 Nanograms</p>
          </div>

          <Button 
            className="w-full h-16 bg-accent text-background font-bold uppercase tracking-widest text-[11px] cyan-glow transition-all active:scale-95"
            onClick={() => setShowScanner(true)}
            disabled={isProcessing || !userAddress}
          >
            {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Smartphone className="mr-2 h-5 w-5" />}
            {userAddress ? "Scan QR & Release Funds" : "Connect Wallet First"}
          </Button>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex gap-4 items-start">
           <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
           <div className="space-y-1">
              <p className="text-xs font-bold text-white uppercase tracking-tight">Security Handshake: Active</p>
              <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                 "ক্যামেরা স্ক্যানারটি প্রাপকের এড্রেস ডিক্রিপ্ট করার সাথে সাথে ৫ মিনিটের একটি ভ্যালিডিটি উইন্ডো তৈরি করবে।"
              </p>
           </div>
        </div>
      </CardContent>

      {showScanner && (
        <QrScannerModal 
          onScanSuccess={handleScanSuccess} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </Card>
  );
}