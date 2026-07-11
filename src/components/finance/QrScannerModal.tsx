"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QrScannerModal({ onScanSuccess, onClose }: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mountId = "qr-camera-feed";

  useEffect(() => {
    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(mountId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 15, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            scanner.stop().then(() => {
              onScanSuccess(decodedText);
            });
          },
          () => {} // Silent failures for frames
        );
      } catch (err) {
        console.error("Camera failed to start:", err);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-between items-center px-2">
           <div className="space-y-1">
              <h3 className="text-xl font-headline font-bold text-white uppercase italic tracking-tighter flex items-center gap-2">
                <Camera className="h-5 w-5 text-accent" />
                Scan Signal
              </h3>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Awaiting QR Identity...</p>
           </div>
           <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5">
              <X className="h-6 w-6 text-muted-foreground" />
           </Button>
        </div>

        <div className="relative aspect-square w-full rounded-3xl overflow-hidden border-2 border-accent/20 bg-black/40 shadow-2xl">
          <div id={mountId} className="w-full h-full" />
          
          {/* Scanning Overlay UI */}
          <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
             <div className="w-full h-full border-2 border-accent/50 rounded-xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-lg" />
                
                {/* Scanning Animation Line */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-accent/50 shadow-[0_0_15px_hsl(var(--accent))] animate-[scan_2s_linear_infinite]" />
             </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 flex gap-4 items-center">
           <div className="p-2 rounded-lg bg-accent/10">
              <ShieldCheck className="h-5 w-5 text-accent" />
           </div>
           <p className="text-[10px] text-white/80 leading-relaxed italic pr-4">
              "কিউআর কোডটি ফ্রেমের মাঝখানে রাখুন। এটি সরাসরি আপনার সোভারেন লেজারে প্রাপকের ওয়ালেট এড্রেস শনাক্ত করবে।"
           </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(250px); }
        }
        #qr-camera-feed video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
}