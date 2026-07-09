
"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Download, 
  Search, 
  Music2, 
  Radio, 
  Volume2, 
  Settings,
  MoreVertical,
  Activity,
  Zap,
  Globe,
  Loader2,
  CheckCircle2,
  History,
  CloudLightning,
  ShieldCheck,
  Trophy,
  Unlock,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

const MOCK_TRACKS = [
  { id: '1', title: 'Sovereign Frequency', artist: 'Kernel Beats', duration: '3:45', thumb: 'https://picsum.photos/seed/music1/400/400' },
  { id: '2', title: 'Cybernetic Echoes', artist: 'DPE Unit', duration: '4:12', thumb: 'https://picsum.photos/seed/music2/400/400' },
  { id: '3', title: 'Grid Lockdown', artist: 'Security Plane', duration: '2:58', thumb: 'https://picsum.photos/seed/music3/400/400' },
  { id: '4', title: 'Digital Nomad', artist: 'Anycast Node', duration: '5:20', thumb: 'https://picsum.photos/seed/music4/400/400' },
];

export default function MediaIntelligencePage() {
  const [search, setSearch] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(MOCK_TRACKS[0]);
  const [extractingId, setExtractingId] = useState<string | null>(null);
  const [extractProgress, setExtractProgress] = useState(0);
  const { toast } = useToast();
  const { emitEvent, isToffeeUnlocked } = useKernel();

  const handlePlay = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    emitEvent('MEDIA', 'STREAM_INITIATED', 4, { trackId: track.id, source: 'MESH_CORRIDOR' });
  };

  const handleExtract = (track: any) => {
    setExtractingId(track.id);
    setExtractProgress(0);
    emitEvent('MEDIA', 'EXTRACTION_TRIGGERED', 3, { trackId: track.id, mode: 'OFFLINE_SYNC' });

    const interval = setInterval(() => {
      setExtractProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExtractingId(null);
          toast({
            title: "Asset Synchronized",
            description: `${track.title} is now available in your local mesh node.`,
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-primary">
              <Music2 className="h-5 w-5 text-primary" />
              Media Intelligence Mesh
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/20 text-primary font-mono text-[10px]">
              <Radio className="mr-1 h-3 w-3 animate-pulse" /> LIVE_ANYCAST
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-headline font-bold">Sonic Intelligence</h2>
              <p className="text-muted-foreground italic">"Processing deterministic audio corridors across the distributed grid."</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tracks, artists or PIS IDs..." 
                className="pl-10 bg-secondary/30 border-white/5 h-10 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              {/* Toffee Access Node */}
              <Card className={cn(
                "glass-panel border-l-4 overflow-hidden relative group transition-all",
                isToffeeUnlocked ? "border-l-green-500 bg-green-500/5" : "border-l-accent bg-accent/5"
              )}>
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant="outline" className={cn(
                    "text-[8px] uppercase tracking-widest font-bold",
                    isToffeeUnlocked ? "border-green-500 text-green-400" : "border-accent text-accent"
                  )}>
                    {isToffeeUnlocked ? "ACTIVE_NODE" : "LOCKED"}
                  </Badge>
                </div>
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-20 h-20 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                    {isToffeeUnlocked ? <Unlock className="h-10 w-10 text-green-400" /> : <Trophy className="h-10 w-10 text-accent" />}
                  </div>
                  <div className="flex-1 space-y-3 text-center md:text-left">
                    <h3 className="text-xl font-headline font-bold text-white uppercase italic">Toffee Live Corridor</h3>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      {isToffeeUnlocked 
                        ? "Sovereign handshake সফল হয়েছে। এখন আপনি সকল প্রিমিয়াম চ্যানেল এবং লাইভ স্পোর্টস হাব উপভোগ করতে পারবেন।"
                        : "টফি এক্সেস করতে এবং প্রিমিয়াম চ্যানেলগুলো আনলক করতে ফিফা হাব পোর্টালে লগইন সম্পন্ন করুন।"}
                    </p>
                    <Button asChild className={cn(
                      "h-10 font-bold uppercase tracking-widest text-[9px] px-8 transition-all",
                      isToffeeUnlocked ? "bg-green-500 text-white" : "bg-accent text-background cyan-glow"
                    )}>
                      <Link href="/fifa-hub">
                        {isToffeeUnlocked ? "Enter Live Hub" : "Unlock with Sovereign Identity"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-l-4 border-l-primary overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                      <Image 
                        src={currentTrack.thumb} 
                        alt="Track Art" 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        data-ai-hint="futuristic music art"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      {isPlaying && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
                          {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className="w-1 bg-primary animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-6 text-center md:text-left">
                      <div className="space-y-1">
                        <h3 className="text-3xl font-headline font-bold text-white">{currentTrack.title}</h3>
                        <p className="text-primary font-bold uppercase text-xs tracking-[0.2em]">{currentTrack.artist}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
                          <span>01:24</span>
                          <span>{currentTrack.duration}</span>
                        </div>
                        <Progress value={35} className="h-1 bg-primary/10 [&>div]:bg-primary" />
                      </div>

                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><SkipBack className="h-5 w-5" /></Button>
                        <Button 
                          size="icon" 
                          className="h-14 w-14 rounded-full blue-glow bg-primary text-primary-foreground transition-transform hover:scale-105"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><SkipForward className="h-5 w-5" /></Button>
                        <div className="w-px h-8 bg-white/5 mx-2" />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className={`h-10 w-10 rounded-full border-white/5 ${extractingId === currentTrack.id ? 'animate-pulse text-primary' : ''}`}
                          onClick={() => handleExtract(currentTrack)}
                          disabled={extractingId !== null}
                        >
                          {extractingId === currentTrack.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5">
                  <CardHeader className="p-4">
                    <CardTitle className="text-xs flex items-center gap-2 uppercase">
                      <Zap className="h-4 w-4 text-accent" />
                      Media Anycast
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                           <span className="text-muted-foreground">Streaming Mode</span>
                           <span className="text-green-400">P43_SECURE</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                           <span className="text-muted-foreground">Buffer</span>
                           <span className="text-white">OPTIMAL</span>
                        </div>
                        <div className="p-2 rounded border border-accent/20 bg-accent/5 text-[9px] text-accent italic leading-relaxed">
                           "Media corridors are currently routed through Node-04 for high-bandwidth Toffee stream delivery."
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="glass-panel border-white/5">
                  <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-xs uppercase tracking-tighter">Featured Traces</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                       <div className="p-2 space-y-1">
                          {MOCK_TRACKS.map((track) => (
                            <div 
                              key={track.id} 
                              className={`p-3 rounded-lg flex items-center justify-between group cursor-pointer transition-all hover:bg-primary/10 ${currentTrack.id === track.id ? 'bg-primary/5 border border-primary/10' : 'border border-transparent'}`}
                              onClick={() => handlePlay(track)}
                            >
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-md overflow-hidden relative border border-white/5">
                                     <Image src={track.thumb} alt="thumb" fill className="object-cover" />
                                  </div>
                                  <div>
                                     <p className="text-[11px] font-bold text-white uppercase truncate w-32">{track.title}</p>
                                     <p className="text-[9px] text-muted-foreground uppercase">{track.artist}</p>
                                  </div>
                               </div>
                               <Badge variant="ghost" className="text-[9px] font-mono opacity-50 group-hover:opacity-100">{track.duration}</Badge>
                            </div>
                          ))}
                       </div>
                    </ScrollArea>
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
