
"use client";

import { useState, useEffect, useRef } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * StandardsQuickButton
 * A dedicated floating button to access the Shurukkha Standard portal from anywhere.
 * Enhanced with Draggable and Auto-hide functionality.
 */
export function StandardsQuickButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: -24 }); // Centered relative to bottom
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const isHidden = pathname === '/shurukkha-standard' || pathname.startsWith('/checkout/');

  // Auto-hide logic
  useEffect(() => {
    const handleActivity = () => {
      setIsVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!isDragging) setIsVisible(false);
      }, 5000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    handleActivity();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDragging]);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX - position.x, y: clientY - position.y };
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setPosition({
        x: clientX - dragStart.current.x,
        y: clientY - dragStart.current.y
      });
    };

    const handleUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging]);

  if (isHidden) return null;

  return (
    <div 
      className={cn(
        "fixed z-[100] transition-opacity duration-500 hidden md:block",
        isVisible ? "opacity-100" : "opacity-20 hover:opacity-100",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{ 
        left: position.x === 0 ? '50%' : `${position.x}px`,
        transform: position.x === 0 ? 'translateX(-50%)' : 'none',
        bottom: `${Math.abs(position.y)}px`,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      <Button 
        asChild
        className="h-12 px-6 rounded-full bg-background/80 backdrop-blur-md border border-accent/30 text-accent shadow-2xl cyan-glow hover:bg-accent hover:text-background transition-all group font-bold uppercase text-[10px] tracking-widest animate-fade-in pointer-events-auto"
        onClick={(e) => isDragging && e.preventDefault()}
      >
        <Link href="/shurukkha-standard">
          <ShieldCheck className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          Standards Portal
        </Link>
      </Button>
    </div>
  );
}
