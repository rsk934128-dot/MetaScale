
"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw,
  ShieldCheck,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BankSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: any) => void;
}

export function BankSandboxModal({ isOpen, onClose, onSuccess }: BankSandboxModalProps) {
  const [step, setStep] = useState<"SELECT" | "AUTH" | "SUCCESS">("SELECT");
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setAuth] = useState({ user: "", pass: "" });
  const { toast } = useToast();

  const handleSelectBank = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStep("AUTH");
      setIsLoading(false);
    }, 1000);
  };

  const handleAuth = () => {
    if (credentials.user === "user_good" && credentials.pass === "pass_good") {
      setIsLoading(true);
      setTimeout(() => {
        setStep("SUCCESS");
        setIsLoading(false);
      }, 1500);
    } else {
      toast({
        variant: "destructive",
        title: "Auth Failed",
        description: "Hint: Use user_good / pass_good for sandbox.",
      });
    }
  };

  const handleFinish = () => {
    onSuccess({
      id: `ACC_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      bankName: "Sandbox Bank (UK)",
      accountNumber: "**** 4421",
      balance: 5240.50,
      currency: "USD",
      status: "CONNECTED"
    });
    onClose();
    setStep("SELECT");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-panel border-accent/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Globe className="h-6 w-6 text-accent animate-pulse" />
          </div>
          <DialogTitle className="text-center font-headline tracking-tight uppercase italic">
            {step === "SELECT" ? "Connect to Fiscal Mesh" : step === "AUTH" ? "Identity Binding" : "Link Established"}
          </DialogTitle>
          <DialogDescription className="text-center text-xs uppercase tracking-widest font-bold opacity-60">
            Open Banking Sandbox Protocol
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 min-h-[200px] flex flex-col justify-center">
          {step === "SELECT" && (
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full h-16 justify-between border-white/5 bg-white/5 hover:bg-accent/10 hover:border-accent/40 group"
                onClick={handleSelectBank}
                disabled={isLoading}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Sandbox Bank (UK)</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Mock Institutional Node</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
              </Button>
              <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 flex gap-3">
                <Lock className="h-4 w-4 text-yellow-500 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  Note: This is a simulated environment. No real credentials or funds are required.
                </p>
              </div>
            </div>
          )}

          {step === "AUTH" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Sandbox User</Label>
                <Input 
                  placeholder="user_good" 
                  className="bg-background/50 border-white/10"
                  value={credentials.user}
                  onChange={(e) => setAuth({...credentials, user: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Sandbox Pass</Label>
                <Input 
                  type="password"
                  placeholder="pass_good" 
                  className="bg-background/50 border-white/10"
                  value={credentials.pass}
                  onChange={(e) => setAuth({...credentials, pass: e.target.value})}
                />
              </div>
              <Button 
                className="w-full cyan-glow bg-accent text-background font-bold h-12 mt-4"
                onClick={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                Binding Identity
              </Button>
            </div>
          )}

          {step === "SUCCESS" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto animate-fade-in">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Connection Successful</h3>
                <p className="text-xs text-muted-foreground italic">Your bank account is now synced with the Sovereign Finance Plane.</p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] space-y-1">
                 <p className="text-accent">&gt;&gt;&gt; STATUS: LINKED</p>
                 <p className="text-white/80">&gt;&gt;&gt; SCOPE: AIS, PIS</p>
                 <p className="text-white/80">&gt;&gt;&gt; PROVIDER: TRUELAYER_SANDBOX</p>
              </div>
              <Button 
                className="w-full bg-white text-background font-bold h-12"
                onClick={handleFinish}
              >
                Enter Control Plane
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
