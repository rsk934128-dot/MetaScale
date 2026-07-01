
"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * StandardsQuickButton
 * A dedicated floating button to access the Shurukkha Standard portal from anywhere.
 */
export function StandardsQuickButton() {
  const pathname = usePathname();
  
  // Hide the button if we are already on the standards page or the checkout page
  const isHidden = pathname === '/shurukkha-standard' || pathname.startsWith('/checkout/');
  if (isHidden) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] hidden md:block">
      <Button 
        asChild
        className="h-12 px-6 rounded-full bg-background/80 backdrop-blur-md border border-accent/30 text-accent shadow-2xl cyan-glow hover:bg-accent hover:text-background transition-all group font-bold uppercase text-[10px] tracking-widest animate-fade-in"
      >
        <Link href="/shurukkha-standard">
          <ShieldCheck className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          Standards Portal
        </Link>
      </Button>
    </div>
  );
}
