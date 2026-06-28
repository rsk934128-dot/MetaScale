
"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Globe, 
  ShieldCheck, 
  Zap, 
  Network, 
  Waves, 
  DollarSign, 
  ArrowRight,
  Fingerprint,
  Activity,
  Cpu,
  Lock,
  ChevronRight,
  Gavel,
  Scale,
  ShieldAlert,
  Terminal,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import placeholderData from "@/app/lib/placeholder-images.json";
import { Logo } from "@/components/ui/logo";

const HERO_SLIDES = [
  {
    id: 'sovereign',
    badge: 'Next-Gen Deterministic Infrastructure',
    title: 'THE KERNEL OF',
    titleItalic: 'SOVEREIGNTY',
    desc: 'Mission-critical operating system for the next generation of digital civilizations. Built with deterministic AI logic and cryptographic security.',
    color: 'text-accent',
    glow: 'bg-accent/20',
    image: placeholderData.placeholderImages.find(img => img.id === 'hero-bg')?.imageUrl || 'https://picsum.photos/seed/hero/1200/800',
    icon: Zap
  },
  {
    id: 'civic',
    badge: 'Civilization Resilience Active',
    title: 'REAL-TIME',
    titleItalic: 'INTELLIGENCE',
    desc: 'Monitoring critical environmentals and river health via geo-distributed sensors. Automated SOS dispatch protocols for rapid response.',
    color: 'text-blue-400',
    glow: 'bg-blue-400/20',
    image: placeholderData.placeholderImages.find(img => img.id === 'ad-creative-4')?.imageUrl || 'https://picsum.photos/seed/civic/1200/800',
    icon: Waves
  },
  {
    id: 'finance',
    badge: 'Global Fiscal Surface v1.2',
    title: 'A GLOBAL FINANCIAL',
    titleItalic: 'CONTROL SURFACE',
    desc: 'Integrate directly with banking rails through the Sovereign Mesh. Multi-rail settlement system with integrated AI risk analysis.',
    color: 'text-green-400',
    glow: 'bg-green-400/20',
    image: placeholderData.placeholderImages.find(img => img.id === 'ad-creative-1')?.imageUrl || 'https://picsum.photos/seed/finance/1200/800',
    icon: DollarSign
  },
  {
    id: 'security',
    badge: 'Zero-Trust Security Mesh',
    title: 'CONTINUOUS',
    titleItalic: 'THREAT VECTOR',
    desc: 'Biometric identity binding and autonomous containment. All interactions with the Mesh are cryptographically signed and logged.',
    color: 'text-red-400',
    glow: 'bg-red-400/20',
    image: placeholderData.placeholderImages.find(img => img.id === 'ad-creative-2')?.imageUrl || 'https://picsum.photos/seed/security/1200/800',
    icon: ShieldAlert
  }
];

export default function LandingPage() {
  const { user } = useUser();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-background overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-1000">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className={cn("absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 opacity-30", HERO_SLIDES[activeSlide].glow)} />
        <div className={cn("absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 opacity-30", HERO_SLIDES[activeSlide].glow)} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <Logo size="md" className="transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-2xl tracking-tighter uppercase italic text-white">Sovereign OS</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Civic', 'Finance', 'Security', 'Infra'].map(item => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
              {item}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild className="cyan-glow bg-accent text-background font-bold uppercase text-[10px] tracking-widest h-10 px-6">
              <Link href="/dashboard">Control Plane <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          ) : (
            <>
              <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-white hover:text-accent">Login</Link>
              <Button asChild className="cyan-glow bg-accent text-background font-bold uppercase text-[10px] tracking-widest h-10 px-6">
                <Link href="/login">Establish Link</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Main Banner Carousel */}
      <header className="relative z-10 w-full h-[85vh] overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out transform",
              activeSlide === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
            )}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <Image 
                src={slide.image} 
                alt={slide.title} 
                fill 
                className="object-cover opacity-20"
                priority={index === 0}
                data-ai-hint="futuristic technology"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center text-center">
              <Badge variant="outline" className={cn("mb-6 uppercase tracking-[0.3em] px-4 py-1 text-[10px] font-bold animate-fade-in border-current", slide.color)}>
                {slide.badge}
              </Badge>
              <h1 className="text-5xl md:text-8xl font-headline font-bold text-white leading-[0.9] tracking-tighter mb-8 animate-fade-in">
                {slide.title} <br />
                <span className={cn("italic transition-colors duration-1000", slide.color)}>{slide.titleItalic}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in">
                {slide.desc}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
                <Button asChild size="lg" className={cn("cyan-glow font-bold uppercase text-xs tracking-widest h-14 px-10 rounded-full transition-all duration-500", slide.color === 'text-accent' ? 'bg-accent text-background' : 'bg-white text-background')}>
                  <Link href={user ? "/dashboard" : "/login"}>
                    Launch Control Plane
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-full text-xs font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all text-white">
                  Read Whitepaper
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                activeSlide === idx ? "w-12 bg-accent" : "w-3 bg-white/20"
              )}
            />
          ))}
        </div>

        {/* Side Controls (Optional) */}
        <div className="absolute inset-y-0 left-4 z-20 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
            onClick={() => setActiveSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          >
            <ChevronRight className="rotate-180 h-6 w-6" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-4 z-20 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
            onClick={() => setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length)}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Feature Mesh Section */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Waves, label: 'Civic', title: 'Intelligence Hub', desc: 'Real-time river health, flood risk analysis, and automated SOS dispatch protocols.', color: 'text-blue-400' },
          { icon: DollarSign, label: 'Finance', title: 'Fiscal Command', desc: 'Multi-rail settlement system with integrated AI for global economic governance.', color: 'text-green-400' },
          { icon: ShieldCheck, label: 'Security', title: 'Zero-Trust Mesh', desc: 'Continuous identity binding and threat vector analysis across a distributed grid.', color: 'text-red-400' },
          { icon: Network, label: 'Infra', title: '42-Node Anycast', desc: 'Self-healing infrastructure mesh with petahash compute power and anycast routing.', color: 'text-accent' }
        ].map((f, i) => (
          <Card key={i} className="glass-panel group hover:border-accent/40 transition-all duration-500 overflow-hidden border-white/5 animate-fade-in" style={{ animationDelay: `${0.4 + (i * 0.1)}s` }}>
            <CardContent className="p-8 space-y-4">
              <div className={`p-3 rounded-xl bg-background border border-white/5 w-fit group-hover:scale-110 transition-transform ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{f.label} Plane</p>
                <h3 className="text-xl font-headline font-bold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="font-headline font-bold text-xl uppercase italic text-white">Sovereign</span>
            </div>
            <p className="text-sm text-muted-foreground max-sm">
              SHURUKKHA-OS: The deterministic operating system for the next digital economic civilization. Distributed via 42 anycast nodes globally.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Operational Planes</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/civic" className="hover:text-accent">Civic Intelligence</Link></li>
              <li><Link href="/finance" className="hover:text-accent">Financial Sovereign</Link></li>
              <li><Link href="/risk" className="hover:text-accent">Security Intelligence</Link></li>
              <li><Link href="/infrastructure" className="hover:text-accent">Infrastructure Mesh</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">System</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/login" className="hover:text-accent">Identity Link</Link></li>
              <li><Link href="/legal" className="hover:text-accent">Legal Bound</Link></li>
              <li><Link href="/settings" className="hover:text-accent">System Settings</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
            © 2024 SOVEREIGN KERNEL ORCHESTRATION. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] uppercase font-bold text-green-500 tracking-tighter">System Nominal: 42 Nodes Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
