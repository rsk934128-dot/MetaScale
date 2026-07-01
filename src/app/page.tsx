
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
  Server,
  Wallet,
  CreditCard,
  Smartphone,
  BadgeCheck,
  CheckCircle2
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
    id: 'fusion',
    badge: 'ISO 20022 Certified Architecture',
    title: 'GLOBAL SMART',
    titleItalic: 'WALLET NODE',
    desc: 'FusionPay connects local payments like bKash/Nagad with global rails like PayPal, Stripe, and SWIFT in a single AI-native node.',
    color: 'text-accent',
    glow: 'bg-accent/20',
    image: placeholderData.placeholderImages.find(img => img.id === 'hero-bg')?.imageUrl || 'https://picsum.photos/seed/hero/1200/800',
    icon: Wallet
  },
  {
    id: 'payout',
    badge: 'Deterministic Payouts active',
    title: 'CROSS-BORDER',
    titleItalic: 'SETTLEMENT',
    desc: 'Automated T+0 liquidity dispatch via PayPal REST API and Priyo Pay. Direct disbursements to 190+ countries with Idempotency protection.',
    color: 'text-blue-400',
    glow: 'bg-blue-400/20',
    image: placeholderData.placeholderImages.find(img => img.id === 'ad-creative-4')?.imageUrl || 'https://picsum.photos/seed/payout/1200/800',
    icon: ArrowRight
  },
  {
    id: 'ai',
    badge: 'Genkit AI Decision Engine',
    title: 'AI POWERED',
    titleItalic: 'INTELLIGENCE',
    desc: 'Real-time fraud detection and predictive liquidity analysis. Get personalized financial insights for your team with our AI Analyst.',
    color: 'text-primary',
    glow: 'bg-primary/20',
    image: placeholderData.placeholderImages.find(img => img.id === 'ad-creative-2')?.imageUrl || 'https://picsum.photos/seed/ai/1200/800',
    icon: Cpu
  }
];

export default function LandingPage() {
  const { user } = useUser();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000); 
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
          <span className="font-headline font-bold text-2xl tracking-tighter uppercase italic text-white">FusionPay</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Wallet', 'Settlement', 'Merchant', 'Network'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
              {item}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild className="cyan-glow bg-accent text-background font-bold uppercase text-[10px] tracking-widest h-10 px-6">
              <Link href="/dashboard">Portal <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          ) : (
            <>
              <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-white hover:text-accent">Login</Link>
              <Button asChild className="cyan-glow bg-accent text-background font-bold uppercase text-[10px] tracking-widest h-10 px-6">
                <Link href="/login">Initialize Node</Link>
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
                data-ai-hint="futuristic fintech"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            {/* Content Container - Adjusted for Right Alignment */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center md:items-end text-center md:text-right">
              <Badge variant="outline" className={cn("mb-6 uppercase tracking-[0.3em] px-4 py-1 text-[10px] font-bold animate-fade-in border-current", slide.color)}>
                {slide.badge}
              </Badge>
              <h1 className="text-5xl md:text-8xl font-headline font-bold text-white leading-[0.9] tracking-tighter mb-8 animate-fade-in uppercase">
                {slide.title} <br />
                <span className={cn("italic transition-colors duration-1000", slide.color)}>{slide.titleItalic}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl animate-fade-in mb-12">
                {slide.desc}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 animate-fade-in">
                <Button asChild size="lg" className={cn("cyan-glow font-bold uppercase text-xs tracking-widest h-14 px-10 rounded-full transition-all duration-500", slide.color === 'text-accent' ? 'bg-accent text-background' : 'bg-white text-background')}>
                  <Link href={user ? "/dashboard" : "/login"}>
                    Access Smart Wallet
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-full text-xs font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all text-white">
                  Technical Docs
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
      </header>

      {/* Enterprise Trust Section */}
      <section className="relative z-10 py-24 bg-secondary/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="space-y-6">
              <Badge variant="outline" className="text-accent border-accent/20 uppercase tracking-widest text-[10px] font-bold">
                 Institutional Reliability
              </Badge>
              <h2 className="text-4xl font-headline font-bold text-white uppercase italic tracking-tighter">
                 THE GOLD STANDARD <br />
                 <span className="text-accent">OF FISCAL SECURITY</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                 FusionPay is designed for maximum fault tolerance. With <strong>99.99% SLA</strong> uptime and <strong>Idempotency Enforcement</strong>, we ensure your financial operations never miss a beat.
              </p>
              <div className="space-y-4 pt-4">
                 {[
                   { icon: BadgeCheck, title: "ISO 20022 Compliance", desc: "Global standard messaging for institutional interoperability." },
                   { icon: Lock, title: "Idempotency (T+0)", desc: "Prevent duplicate transactions with X-Idempotency-Key headers." },
                   { icon: Server, title: "Anycast Routing", desc: "Distributed across 42 nodes for sub-10ms global latency." }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4 items-start">
                      <div className="p-2 rounded bg-accent/10 text-accent"><item.icon className="h-5 w-5" /></div>
                      <div>
                         <h4 className="text-sm font-bold text-white uppercase">{item.title}</h4>
                         <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
              <Image src={placeholderData.placeholderImages.find(img => img.id === 'finance-preview')?.imageUrl || 'https://picsum.photos/seed/trust/800/450'} alt="Security Mesh" fill className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-background/80 backdrop-blur-xl border border-white/10 space-y-2 animate-fade-in">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-[10px] font-bold uppercase">Mesh Integrity: Optimal</span></div>
                 <p className="text-[9px] text-muted-foreground font-mono">LATENCY: 8.4ms | NODES: 42/42</p>
              </div>
           </div>
        </div>
      </section>

      {/* Feature Mesh Section */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-headline font-bold uppercase tracking-widest">Global <span className="text-accent italic">Liquidity</span> Nodes</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Our 42-node anycast distributed grid ensures sub-10ms latency for all settlement triggers.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Wallet, label: 'Wallet', title: 'Universal QR', desc: 'Scan any Fusion, Binance, or RedTop QR code for instant P2P transfers.', color: 'text-blue-400' },
            { icon: DollarSign, label: 'Payout', title: 'Cross-Border', desc: 'Real-time PayPal & Priyo Pay settlement with 99.9% deterministic finality.', color: 'text-green-400' },
            { icon: ShieldCheck, label: 'Security', title: 'Audit Oracle', desc: 'ISO 20022 compliant messaging with SHA-256 payload verification.', color: 'text-red-400' },
            { icon: Network, label: 'SaaS', title: 'Merchant Portal', desc: 'Full-stack infrastructure for businesses to build custom branded payment solutions.', color: 'text-accent' }
          ].map((f, i) => (
            <Card key={i} className="glass-panel group hover:border-accent/40 transition-all duration-500 overflow-hidden border-white/5 animate-fade-in" style={{ animationDelay: `${0.4 + (i * 0.1)}s` }}>
              <CardContent className="p-8 space-y-4">
                <div className={`p-3 rounded-xl bg-background border border-white/5 w-fit group-hover:scale-110 transition-transform ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{f.label}</p>
                  <h3 className="text-xl font-headline font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
         </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="font-headline font-bold text-xl uppercase italic text-white">FusionPay</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Global Smart Wallet & Settlement Node. Founded in London. ISO 20022 Certified Architecture.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Nodes</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/finance" className="hover:text-accent">Financial Node</Link></li>
              <li><Link href="/insights" className="hover:text-accent">Intelligence Hub</Link></li>
              <li><Link href="/compliance" className="hover:text-accent">Audit Oracle</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Merchant</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/api-docs" className="hover:text-accent">API Keys</Link></li>
              <li><Link href="/prospectus" className="hover:text-accent">Pitch Deck</Link></li>
              <li><Link href="/pricing" className="hover:text-accent">System Plans</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
            © 2024 FusionPay Global Node. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] uppercase font-bold text-green-500 tracking-tighter">ISO 20022 Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
