
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SettingsContainer } from "@/components/settings/SettingsContainer";
import { PWAInstaller } from "@/components/settings/PWAInstaller";
import { Settings as SettingsIcon, ShieldCheck, Zap, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-accent" />
              System Settings
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-accent/20 text-accent">
              <Zap className="mr-1 h-3 w-3" /> Kernel v1.2.0-stable
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-8">
          <div className="mb-8">
            <h2 className="text-3xl font-headline font-bold mb-2 uppercase tracking-tighter italic">OS <span className="text-accent">Configuration</span></h2>
            <p className="text-muted-foreground">
              Manage deterministic execution policies, global thresholds, and sovereign security protocols.
            </p>
          </div>
          
          <Tabs defaultValue="config" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1">
              <TabsTrigger value="config" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">System Parameters</TabsTrigger>
              <TabsTrigger value="install" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full flex gap-2">
                <Download className="h-3 w-3" /> Install App
              </Badge>
            </TabsList>

            <TabsContent value="config">
              <SettingsContainer />
            </TabsContent>

            <TabsContent value="install" className="animate-fade-in">
              <PWAInstaller />
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </div>
  );
}
