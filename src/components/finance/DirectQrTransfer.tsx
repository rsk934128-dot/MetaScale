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
  DollarSign,
  UserCheck,
  Building2,
  RefreshCw,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useFirestore } from "@/firebase";
import { verifyMeshAccount } from "@/services/payment-service";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Dynamic import for the scanner to avoid SSR issues
const QrScannerModal = dynamic(() => import("./QrScannerModal"), { ssr: false });

export function DirectQrTransfer() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress(true);
  const firestore = useFirestore();
  const { emitEvent } = useKernel();
  const { toast } = useToast();

  const [showScanner, setShowScanner] = useState(false);
  const [sendAmount, setSendAmount] = useState("1.0");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [recipient, setRecipient] = useState<any>(null);

  const handleScanSuccess = async (scannedData: string) => {
    setShowScanner(false); // Auto-close camera instantly
    
    if (!firestore) return;

    setIsVerifying(true);
    setRecipient(null);

    try {
      // Step 1: Account Verification from Mesh
      const meshRes = await verifyMeshAccount(firestore, scannedData);
      
      if (meshRes.success) {
        setRecipient({
          ...meshRes,
          address: scannedData
        });
        toast({ title: "Identity Verified", description: `${meshRes.displayName} found in Sovereign Mesh.` });
      } else {
        // If not in mesh, check if it's a raw TON address (Basic validation)
        if (scannedData.startsWith('EQ') || scannedData.startsWith('UQ')) {
           setRecipient({
             success: true,
             displayName: "External Node",
             address: scannedData,
             verificationStatus: 'EXTERNAL'
           });
        } else {
           toast({ variant: "destructive", title: "Invalid Signal", description: "This QR does not point to an authorized node." });
        }
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Verification Timeout" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmTransfer = async () => {
    if (!recipient || !userAddress) return;

    setIsProcessing(true);
    emitEvent('FINANCE', 'QR_TRANSFER_INITIATED', 2, { 
      target: recipient.address, 
      recipientName: recipient.displayName,
      amount: sendAmount 
    });

    try {
      // Conversion: 1 GRAM = 10^9 nanograms
      const amountInNanograms = (parseFloat(sendAmount) * 1e9).toString();

      const transactionPayload = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: recipient.address,
            amount: amountInNanograms,
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transactionPayload);
      
      emitEvent('FINANCE', 'QR_TRANSFER_SUCCESS', 1, { boc: result.boc, amount: sendAmount });
      
      toast({ 
        title: "Settlement Finalized", 
        description: `অভিনন্দন! ${sendAmount} GRAM সফলভাবে পাঠানো হয়েছে। (T+0 Finality)`,
      });
      
      // Reset state on success
      setRecipient(null);
      setSendAmount("1.0");
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
    <Card className="glass-panel border-accent/20 bg-accent/5 overflow-hidden shadow-2xl max-w-xl mx-auto relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-accent animate-pulse" />
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-widest text-accent italic">
          <QrCode className="h-5 w-5 text-accent" />
          Secure QR Settlement
        </CardTitle>
        <CardDescription className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
          Autonomous Node Discovery & Finality
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!recipient ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Disbursement Amount (GRAM)</Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                <Input 
                  type="number" 
                  placeholder="1.0" 
                  className="bg-secondary/30 border-white/5 h-16 pl-12 text-3xl font-headline font-bold"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>

            <Button 
              className="w-full h-16 bg-accent text-background font-bold uppercase tracking-widest text-[11px] cyan-glow transition-all active:scale-95"
              onClick={() => setShowScanner(true)}
              disabled={isProcessing || !userAddress || isVerifying}
            >
              {isVerifying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Smartphone className="mr-2 h-5 w-5" />}
              {userAddress ? "Verify & Scan QR" : "Connect Wallet First"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in py-2">
            <div className="p-6 rounded-3xl bg-secondary/40 border border-white/10 space-y-4">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-accent">
                      <AvatarImage src={recipient.photoURL} />
                      <AvatarFallback className="bg-accent/10 text-accent font-bold">{recipient.displayName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                       <p className="text-lg font-headline font-bold text-white uppercase">{recipient.displayName}</p>
                       <div className="flex items-center gap-2">
                         <Badge variant="outline" className="text-[7px] border-accent/20 text-accent uppercase font-bold px-1.5">
                           {recipient.verificationStatus} TIER
                         </Badge>
                         {recipient.trustScore && (
                           <span className="text-[8px] font-bold text-green-400">Score: {recipient.trustScore}%</span>
                         )}
                       </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={() => setRecipient(null)}>
                    <X className="h-5 w-5" />
                  </Button>
               </div>

               <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Recipient Hash</p>
                  <p className="text-[10px] font-mono text-white/60 truncate">{recipient.address}</p>
               </div>

               <div className="flex justify-between items-end border-t border-white/5 pt-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Transfer Total</p>
                  <p className="text-2xl font-headline font-bold text-accent">{sendAmount} <span className="text-sm">GRAM</span></p>
               </div>
            </div>

            <Button 
              className="w-full h-16 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-[11px] shadow-2xl transition-all"
              onClick={handleConfirmTransfer}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
              Authorize Disbursement
            </Button>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex gap-4 items-start">
           <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
           <div className="space-y-1">
              <p className="text-xs font-bold text-white uppercase tracking-tight">Security Protocol v1.2</p>
              <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                 "স্ক্যান করার সাথে সাথে প্রাপকের আইডেন্টিটি নোড চেক করা হবে। ভেরিফিকেশন পজিটিভ হলে আপনার গেটওয়ে অটো-সক্রিয় হবে।"
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
