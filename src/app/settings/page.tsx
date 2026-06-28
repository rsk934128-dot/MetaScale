
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SettingsContainer } from "@/components/settings/SettingsContainer";
import { Settings as SettingsIcon, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-headline font-bold mb-2">OS Configuration</h2>
            <p className="text-muted-foreground">
              Manage deterministic execution policies, global thresholds, and sovereign security protocols.
            </p>
          </div>
          
          <SettingsContainer />
        </main>
      </SidebarInset>
    </div>
  );
}
