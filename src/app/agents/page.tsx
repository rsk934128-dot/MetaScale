
"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AgentControlCenter } from "@/components/agents/AgentControlCenter";
import { BrainCircuit, Play, ShieldCheck, Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";

export default function AgentsPage() {
  const [isInitializing, setIsInitializing] = useState(false);
  const { emitEvent } = useKernel();
  const { toast } = useToast();

  const handleInitializeAll = () => {
    setIsInitializing(true);
    
    // Emit kernel event for audit logging
    emitEvent('SECURITY', 'AGENTS_BULK_INITIALIZATION', 2, { 
      timestamp: Date.now(),
      scope: 'GLOBAL_AGENT_CLUSTER',
      mode: 'SAFE_EXECUTION'
    });

    // Simulate initialization sequence
    setTimeout(() => {
      setIsInitializing(false);
      toast({
        title: "Cluster Initialized",
        description: "All autonomous agents are now synced with Knowledge Node 01.",
      });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-accent" />
              Agent Console
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-400/20 text-green-400">
              <ShieldCheck className="mr-1 h-3 w-3" /> Safe Execution Mode
            </Badge>
            <Button 
              size="sm" 
              className="cyan-glow font-bold"
              onClick={handleInitializeAll}
              disabled={isInitializing}
            >
              {isInitializing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isInitializing ? "Initializing..." : "Initialize All Agents"}
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Autonomous Operations</h2>
              <p className="text-muted-foreground">
                Manage specialized AI agents designed to autonomously scale, optimize, and protect your marketing ecosystems.
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs font-bold uppercase text-muted-foreground">Global Efficiency</p>
              <p className="text-2xl font-headline font-bold text-accent">92.4%</p>
            </div>
          </div>
          
          <AgentControlCenter />
        </main>
      </SidebarInset>
    </div>
  );
}
