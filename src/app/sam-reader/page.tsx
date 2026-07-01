
"use client";

import { useState, useEffect, useMemo } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FileSearch, 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Search, 
  Filter, 
  RefreshCw,
  Fingerprint,
  Lock,
  Globe,
  Database,
  Cpu,
  ChevronRight,
  ShieldCheck,
  Radar,
  Eye,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";

const MOCK_AUDIT_LOGS = [
  { id: "AUD-01", type: "CRITICAL", node: "NODE-04", msg: "HMAC Signature mismatch on PIS rail.", timestamp: Date.now() - 5000, plane: "SECURITY" },
  { id: "AUD-02", type: "INFO", node: "NODE-22", msg: "Anycast sync successful with L0 Ledger.", timestamp: Date.now() - 15000, plane: "INFRA" },
  { id: "AUD-03", type: "WARNING", node: "NODE-01", msg: "Latency threshold exceeded (85ms).", timestamp: Date.now() - 45000, plane: "INFRA" },
  { id: "AUD-04", type: "CRITICAL", node: "NODE-04", msg: "Unidentified IP attempt on Root Auth.", timestamp: Date.now() - 120000, plane: "SECURITY" },
  { id: "AUD-05", type: "INFO", node: "NODE-12", msg: "Yield recycling policy applied successfully.", timestamp: Date.now() - 300000, plane: "FINANCE" },
];

export default function SAMReaderPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "WARNING" | "INFO">("ALL");
  const [logs, setLogs] = useState(MOCK_AUDIT_LOGS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  
  const { emitEvent } = useKernel();
  const { toast } = useToast();

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.msg.toLowerCase().includes(search.toLowerCase()) || log.id.includes(search);
      const matchesFilter = filter === "ALL" || log.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [logs, search, filter]);

  const handleSync = () => {
    setIsSyncing(true);
    emitEvent('SECURITY', 'SAM_MESH_SCAN_INITIATED', 3, { mode: 'FORENSIC' });
    
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Audit Mesh Synced",
        description: "Latest security traces from all 42 nodes have been reconciled.",
      });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <FileSearch className="h-5 w-5 text-accent" />
              SAM Reader <span className="text-muted-foreground/50 font-normal">| Security Audit Mesh</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
                TRACING_NODE: NODE-04-UK
             </Badge>
             <Button size="sm" onClick={handleSync} disabled={isSyncing} className="cyan-glow bg-accent text-background font-bold text-[10px] h-8 px-4">
                {isSyncing ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Radar className="h-3.5 w-3.5 mr-1.5" />}
                Scan Mesh
             </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold tracking-tighter uppercase italic">Forensic <span className="text-accent">Audit Logs</span></h2>
              <p className="text-muted-foreground text-sm italic max-w-2xl">
                "Reading deterministic security traces and identity bindings across the global anycast grid."
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
               <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search logs/hashes..." 
                    className="pl-10 bg-secondary/30 border-white/5 h-10 text-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <div className="flex bg-secondary/50 p-1 rounded-lg border border-white/5">
                  {(["ALL", "CRITICAL", "WARNING", "INFO"] as const).map((f) => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "px-3 h-8 rounded-md text-[10px] font-bold uppercase transition-all",
                        filter === f ? "bg-accent text-background" : "text-muted-foreground hover:text-white"
                      )}
                    >
                      {f}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Audit Feed */}
            <div className="xl:col-span-8">
               <Card className="glass-panel border-white/5 flex flex-col h-[650px] overflow-hidden">
                  <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                     <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-accent" />
                        Live Trace Terminal
                     </CardTitle>
                     <Badge variant="outline" className="text-[8px] font-mono border-green-500/30 text-green-400 animate-pulse">LISTENING...</Badge>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 flex flex-col">
                     <ScrollArea className="flex-1">
                        <div className="divide-y divide-white/5">
                           {filteredLogs.length === 0 ? (
                             <div className="p-20 text-center text-muted-foreground italic text-xs uppercase tracking-widest opacity-30">
                                No audit traces found for this scope.
                             </div>
                           ) : filteredLogs.map((log) => (
                             <div 
                               key={log.id} 
                               className={cn(
                                 "p-4 cursor-pointer transition-all hover:bg-white/5 group flex items-start gap-4",
                                 selectedLog?.id === log.id ? "bg-accent/5 border-l-4 border-l-accent" : "border-l-4 border-l-transparent"
                               )}
                               onClick={() => setSelectedLog(log)}
                             >
                                <div className={cn(
                                  "p-2 rounded-lg bg-black/40 border border-white/5 shrink-0",
                                  log.type === 'CRITICAL' ? "text-red-500 border-red-500/20" : 
                                  log.type === 'WARNING' ? "text-yellow-500 border-yellow-500/20" : 
                                  "text-blue-400 border-blue-400/20"
                                )}>
                                   {log.type === 'CRITICAL' ? <ShieldAlert className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                   <div className="flex justify-between items-center">
                                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{log.id} • {log.node}</span>
                                      <span className="text-[9px] font-mono text-muted-foreground/50">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                   </div>
                                   <p className={cn(
                                     "text-sm font-bold truncate",
                                     log.type === 'CRITICAL' ? 'text-red-400' : 'text-white'
                                   )}>{log.msg}</p>
                                   <div className="flex items-center gap-2">
                                      <Badge variant="ghost" className="text-[7px] p-0 font-mono uppercase opacity-50">{log.plane} PLANE</Badge>
                                      <span className="text-[7px] text-muted-foreground/30">•</span>
                                      <span className="text-[7px] text-muted-foreground/50 uppercase italic font-bold">Trace Secure (P42)</span>
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </ScrollArea>
                  </CardContent>
               </Card>
            </div>

            {/* Inspector Panel */}
            <div className="xl:col-span-4 space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5 shadow-2xl h-fit">
                  <CardHeader className="p-6 border-b border-white/10">
                     <div className="flex items-center justify-between">
                        <CardTitle className="text-sm uppercase tracking-[0.2em] flex items-center gap-2 text-accent">
                           <Fingerprint className="h-4 w-4" />
                           Audit Inspector
                        </CardTitle>
                        {selectedLog && (
                          <Badge className={cn(
                            "text-[8px] font-bold",
                            selectedLog.type === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-accent text-background'
                          )}>{selectedLog.type}</Badge>
                        )}
                     </div>
                  </CardHeader>
                  <CardContent className="p-6">
                     {selectedLog ? (
                       <div className="space-y-6 animate-fade-in">
                          <div className="space-y-1">
                             <p className="text-[9px] uppercase font-bold text-muted-foreground">Detailed Directive</p>
                             <p className="text-lg font-headline font-bold text-white italic leading-tight">
                                "{selectedLog.msg}"
                             </p>
                          </div>

                          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4 font-mono text-[10px] leading-relaxed">
                             <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-muted-foreground uppercase">Trace ID</span>
                                <span className="text-accent">{selectedLog.id}</span>
                             </div>
                             <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-muted-foreground uppercase">Source Node</span>
                                <span className="text-white">{selectedLog.node} (UK_CORRIDOR)</span>
                             </div>
                             <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-muted-foreground uppercase">Security Seal</span>
                                <span className="text-green-400">VALID_SHA256</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground uppercase">Kernel Priority</span>
                                <span className={cn(selectedLog.type === 'CRITICAL' ? 'text-red-400' : 'text-accent')}>LEVEL_0{selectedLog.type === 'CRITICAL' ? 1 : 2}</span>
                             </div>
                          </div>

                          <div className="space-y-3">
                             <Button className="w-full h-10 bg-accent text-background font-bold text-[10px] uppercase tracking-widest cyan-glow">
                                <Lock className="mr-2 h-3 w-3" /> Authorize Forensic Trace
                             </Button>
                             <Button variant="ghost" className="w-full h-10 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5">
                                <Eye className="mr-2 h-3 w-3" /> View Source Metadata
                             </Button>
                          </div>
                       </div>
                     ) : (
                       <div className="h-60 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                          <Activity className="h-12 w-12 text-accent animate-logo-spin" />
                          <p className="text-xs uppercase font-bold tracking-[0.3em]">Awaiting Selection...</p>
                       </div>
                     )}
                  </CardContent>
               </Card>

               <Card className="glass-panel border-white/5">
                  <CardHeader className="p-4 border-b border-white/5 bg-white/5">
                     <CardTitle className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                        <Radar className="h-3.5 w-3.5 text-accent" />
                        Grid Health Indices
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                     {[
                       { label: "Signature Guard", status: "Optimal", color: "text-green-400" },
                       { label: "NoorNexus Pulse", status: "Active", color: "text-primary" },
                       { label: "P43 Logic Compliance", status: "100%", color: "text-accent" }
                     ].map((idx, i) => (
                       <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-black/20 border border-white/5">
                          <span className="text-[9px] font-bold uppercase text-muted-foreground">{idx.label}</span>
                          <span className={cn("text-[10px] font-bold uppercase font-mono", idx.color)}>{idx.status}</span>
                       </div>
                     ))}
                  </CardContent>
               </Card>

               <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 text-center shadow-inner group cursor-pointer hover:bg-primary/10 transition-all">
                  <Cpu className="h-8 w-8 text-primary mx-auto mb-2 opacity-50 group-hover:animate-logo-spin" />
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                     System is autonomously archiving forensic snapshots every 60s.
                  </p>
               </div>
            </div>
          </div>
        </main>

        <footer className="p-6 border-t border-white/5 text-center">
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              NoorNexus SAM Reader v1.2.0-stable • Institutional Guard
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}
