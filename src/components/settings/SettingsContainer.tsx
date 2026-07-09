
"use client";

import { useState } from "react";
import { 
  Shield, 
  Cpu, 
  Globe, 
  BrainCircuit, 
  Save, 
  RefreshCw,
  Lock,
  Activity,
  Bell,
  Fingerprint,
  Smartphone,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";

export function SettingsContainer() {
  const [isSaving, setIsSaving] = useState(false);
  const { emitEvent } = useKernel();
  const { toast } = useToast();

  const handleSave = () => {
    setIsSaving(true);
    emitEvent('SECURITY', 'SYSTEM_SETTINGS_UPDATED', 2, { timestamp: Date.now() });
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Kernel parameters have been successfully reconciled.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-secondary/50 border border-white/5 w-full justify-start md:w-auto overflow-x-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="infra">Infrastructure</TabsTrigger>
          <TabsTrigger value="ai">AI Governance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-accent" />
                System Identity
              </CardTitle>
              <CardDescription>Global identifiers for this Sovereign OS instance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>OS Hostname</Label>
                  <Input defaultValue="SHURUKKHA-CORE-01" className="bg-secondary/30" />
                </div>
                <div className="space-y-2">
                  <Label>Primary Jurisdiction</Label>
                  <Select defaultValue="BD">
                    <SelectTrigger className="bg-secondary/30">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BD">Bangladesh (HQ)</SelectItem>
                      <SelectItem value="UK">United Kingdom (EU Node)</SelectItem>
                      <SelectItem value="US">United States (Global Hub)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" />
                Notification Relay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Critical Event Alerts</p>
                  <p className="text-xs text-muted-foreground">Notify high-clearance emails on SECURITY plane anomalies.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Payout Confirmations</p>
                  <p className="text-xs text-muted-foreground">Required for disbursements exceeding $1,000.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" />
                Deterministic Policy Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Minimum Trust Threshold (0-100)</Label>
                <div className="flex items-center gap-4">
                  <Slider defaultValue={[75]} max={100} step={1} className="flex-1" />
                  <span className="text-xs font-mono font-bold text-accent">75%</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  Entities below this score will be auto-throttled in the Finance Plane.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-red-400">Strict Lockdown Mode</p>
                  <p className="text-xs text-muted-foreground">Immediately isolate all unverified external API nodes on any security trigger.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-accent" />
                KYB/KYC Enforcement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Continuous Monitoring</p>
                  <p className="text-xs text-muted-foreground">Re-verify entity identities every 24 hours.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infra" className="space-y-6">
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Mesh Anycast Config
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                 <Label>Node Sync Interval</Label>
                 <Select defaultValue="5s">
                   <SelectTrigger className="bg-secondary/30">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="1s">High Frequency (1s)</SelectItem>
                     <SelectItem value="5s">Balanced (5s)</SelectItem>
                     <SelectItem value="30s">Low Power (30s)</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               
               <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-accent" />
                    <p className="text-sm font-bold">Persistence Protocol</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Keep the background node active even when the device is idle.</p>
                </div>
                <Switch defaultChecked />
              </div>

               <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Self-Healing Grid</p>
                  <p className="text-xs text-muted-foreground">Automatically reroute traffic if latency exceeds 50ms.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-accent" />
                Autonomous Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label>Autonomous Budget Cap</Label>
                  <Input type="number" defaultValue="2000" className="bg-secondary/30" />
                  <p className="text-[10px] text-muted-foreground">Maximum daily spend an agent can authorize without human approval.</p>
               </div>
               <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Reasoning Validation</p>
                  <p className="text-xs text-muted-foreground">Force agents to provide JSON logic traces for every action.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
        <Button variant="ghost" disabled={isSaving}>Cancel</Button>
        <Button 
          className="cyan-glow font-bold bg-accent text-background" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Reconciling..." : "Save System Changes"}
        </Button>
      </div>
    </div>
  );
}
