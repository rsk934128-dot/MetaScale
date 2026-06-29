
"use client";

import { useState } from "react";
import { 
  BrainCircuit, 
  Settings, 
  Zap, 
  History, 
  Shield, 
  Pause, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  BarChart2,
  Rocket,
  Activity,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const INITIAL_AGENTS = [
  {
    id: "ag-1",
    name: "Campaign Scaler",
    role: "Automation Agent",
    description: "Autonomously detects high-ROAS pockets and adjusts platform budgets within ±15% of daily limits.",
    status: "Active",
    efficiency: 98,
    lastAction: "Increased Meta Summer LAL budget by $200",
    actions: 142,
  },
  {
    id: "ag-2",
    name: "Creative Auditor",
    role: "Content Agent",
    description: "Scans CTR and hook rates every hour. Flags creative fatigue and suggests new hook rotations from the library.",
    status: "Paused",
    efficiency: 84,
    lastAction: "Flagged 'Summer V2' for fatigue in US market",
    actions: 89,
  },
  {
    id: "ag-3",
    name: "Market Intelligence",
    role: "Research Agent",
    description: "Monitors competitor ad spend patterns and Google Trends to discover new high-intent keyword opportunities.",
    status: "Active",
    efficiency: 91,
    lastAction: "Detected 300% surge in 'eco-sneaker' search volume",
    actions: 256,
  },
  {
    id: "ag-4",
    name: "ROAS Guardian",
    role: "Analytics Agent",
    description: "Real-time anomaly detection. Immediately pauses campaigns if CPA exceeds 2x target for more than 4 hours.",
    status: "Active",
    efficiency: 100,
    lastAction: "System-wide audit: All ROAS metrics stable",
    actions: 1210,
  }
];

export function AgentControlCenter() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [isUpdatingGovernance, setIsUpdatingGovernance] = useState(false);
  const { emitEvent } = useKernel();
  const { toast } = useToast();
  const router = useRouter();

  const handleToggleAgent = (agentId: string) => {
    const agentToToggle = agents.find(a => a.id === agentId);
    if (!agentToToggle) return;

    const isCurrentlyActive = agentToToggle.status === 'Active';
    const nextStatus = isCurrentlyActive ? 'Paused' : 'Active';

    // 1. Perform side effects outside the state updater
    emitEvent('SECURITY', isCurrentlyActive ? 'AGENT_HALTED' : 'AGENT_RESUMED', 2, { 
      agentId, 
      agentName: agentToToggle.name,
      priority: 'CRITICAL',
      timestamp: Date.now()
    });

    toast({
      title: isCurrentlyActive ? "Agent Paused" : "Agent Resumed",
      description: `${agentToToggle.name} is now ${nextStatus.toLowerCase()}.`,
      variant: isCurrentlyActive ? "destructive" : "default",
    });

    // 2. Pure state update
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, status: nextStatus } : agent
    ));
  };

  const handleViewLogs = (agentName: string) => {
    toast({
      title: "Opening Knowledge Stream",
      description: `Accessing decentralized logs for ${agentName}...`,
    });
    
    const logsSection = document.getElementById('execution-logs');
    if (logsSection) {
      logsSection.scrollIntoView({ behavior: 'smooth' });
    }

    emitEvent('SECURITY', 'LOG_ACCESS_INITIATED', 4, { agentName });
  };

  const handleUpdateGovernance = () => {
    setIsUpdatingGovernance(true);
    
    emitEvent('SECURITY', 'GOVERNANCE_PROTOCOL_UPDATED', 1, {
      timestamp: Date.now(),
      mode: 'SEMI_AUTONOMOUS',
      threshold: 2000
    });

    setTimeout(() => {
      setIsUpdatingGovernance(false);
      toast({
        title: "Governance Updated",
        description: "New operational thresholds have been pushed to the cluster.",
      });
    }, 1500);
  };

  const handleViewAnalytics = () => {
    emitEvent('SECURITY', 'ANALYTICS_DASHBOARD_ACCESS', 4, { source: 'AGENT_CONTROL_CENTER' });
    router.push('/analytics');
  };

  const handleHaltAll = () => {
    // Side effects first
    emitEvent('SECURITY', 'CLUSTER_EMERGENCY_HALT', 1, { 
      reason: 'MANUAL_OVERRIDE',
      timestamp: Date.now(),
      scope: 'GLOBAL'
    });

    toast({
      variant: "destructive",
      title: "EMERGENCY HALT EXECUTED",
      description: "All cluster agents have been forcefully paused by direct directive.",
    });

    // Then update state
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'Paused' })));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id} className="glass-panel group hover:border-accent/30 transition-all overflow-hidden border-white/5">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                    <BrainCircuit className="h-5 w-5 text-accent" />
                  </div>
                  <Badge variant={agent.status === 'Active' ? 'default' : 'secondary'} className="text-[10px]">
                    {agent.status}
                  </Badge>
                </div>
                <CardTitle className="mt-4 flex items-center gap-2">
                  {agent.name}
                  <Settings className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" />
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                    <span>Performance Rating</span>
                    <span>{agent.efficiency}%</span>
                  </div>
                  <Progress value={agent.efficiency} className="h-1 bg-accent/10" />
                </div>
                
                <div className="p-2 rounded bg-secondary/30 border border-white/5 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-accent">Latest Directive Pulse</span>
                  <p className="text-[10px] text-white/80 italic">"{agent.lastAction}"</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-[10px] font-bold h-9"
                    onClick={() => handleViewLogs(agent.name)}
                  >
                    View Logs
                  </Button>
                  <Button 
                    size="sm" 
                    className={`flex-1 text-[10px] font-bold h-9 transition-all ${agent.status === 'Active' ? 'bg-secondary hover:bg-secondary/80' : 'bg-accent text-background cyan-glow'}`}
                    onClick={() => handleToggleAgent(agent.id)}
                  >
                    {agent.status === 'Active' ? <Pause className="mr-1 h-3 w-3" /> : <Play className="mr-1 h-3 w-3" />}
                    {agent.status === 'Active' ? 'Pause Agent' : 'Resume'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-panel" id="execution-logs">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="h-4 w-4 text-accent" />
              Global Execution Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[
                  { time: "10:42 AM", agent: "Campaign Scaler", action: "Budget Adjustment", status: "success", msg: "Reallocated $500 from low-performing UK Interest group to high-performing LAL audience." },
                  { time: "09:15 AM", agent: "ROAS Guardian", action: "System Audit", status: "success", msg: "Verified all CPA thresholds across 4 platforms. No anomalies detected." },
                  { time: "08:30 AM", agent: "Creative Auditor", action: "Content Flag", status: "warning", msg: "Hook rate for 'V2_Short' dropped below 15% in German market. Replacement suggested." },
                  { time: "07:00 AM", agent: "Market Intelligence", action: "Trend Analysis", status: "info", msg: "Detected 40% increase in competitor ad volume for 'Sustainable Fashion' keywords." }
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-lg border border-white/5 bg-secondary/20 items-start">
                    <div className="text-[10px] font-mono text-muted-foreground whitespace-nowrap pt-1">{log.time}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white">{log.agent}</span>
                        <div className="flex items-center gap-1">
                          {log.status === 'success' && <CheckCircle2 className="h-3 w-3 text-green-400" />}
                          {log.status === 'warning' && <AlertCircle className="h-3 w-3 text-yellow-400" />}
                          {log.status === 'info' && <Activity className="h-3 w-3 text-accent" />}
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{log.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="glass-panel border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              Autonomous Governance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Execution Threshold</span>
                <span className="font-bold">$2,000 / Day</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Operational Mode</span>
                <Badge variant="outline" className="text-[9px] text-accent border-accent/20">Semi-Autonomous</Badge>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Agents require human confirmation for budget changes exceeding 15% or structural campaign deletion.
            </p>
            <Button 
              className="w-full text-xs font-bold cyan-glow bg-accent text-background h-9"
              onClick={handleUpdateGovernance}
              disabled={isUpdatingGovernance}
            >
              {isUpdatingGovernance ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isUpdatingGovernance ? "Updating..." : "Update Governance"}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              Impact Projection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Predicted Lift", value: "+$12.4k", desc: "If budget reallocated to LAL" },
              { label: "Est. Savings", value: "$2.1k", desc: "By pausing low-CTR units" },
            ].map((forecast, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">{forecast.label}</span>
                  <span className="text-sm font-bold text-primary">{forecast.value}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{forecast.desc}</p>
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full text-[10px] h-8 text-muted-foreground hover:text-white"
              onClick={handleViewAnalytics}
            >
              View Analytics <BarChart2 className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-sm text-red-400">Emergency Protocol</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full text-xs font-bold opacity-80 hover:opacity-100 h-9"
              onClick={handleHaltAll}
            >
              Halt All Cluster Agents
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
