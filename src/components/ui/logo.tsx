
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

export function Logo({ className, size = "md", animated = true }: LogoProps) {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-20 h-20",
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeMap[size], className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "w-full h-full drop-shadow-[0_0_10px_hsl(var(--accent)/0.5)]",
          animated && "animate-logo-spin"
        )}
      >
        {/* Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="10 5"
          className="text-accent/30"
        />
        
        {/* Hexagonal Core */}
        <path
          d="M50 10L84.641 30V70L50 90L15.359 70V30L50 10Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
          className="text-accent"
        />
        
        {/* Stylized S Curve */}
        <path
          d="M35 40C35 35 40 30 50 30C60 30 65 35 65 40C65 45 60 48 50 50C40 52 35 55 35 60C35 65 40 70 50 70C60 70 65 65 65 60"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="text-white drop-shadow-[0_0_5px_white]"
        />
        
        {/* Inner Tech Bits */}
        <circle cx="50" cy="50" r="3" fill="currentColor" className="text-accent animate-pulse" />
      </svg>
    </div>
  );
}
