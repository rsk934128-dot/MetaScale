
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { OptimizationEngine } from "@/components/ai/OptimizationEngine";
import { BrainCircuit } from "lucide-react";

export default function OptimizationPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-accent" />
              Optimization Engine
            </h1>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-headline font-bold mb-2">Campaign Intelligence</h2>
            <p className="text-muted-foreground">
              Leverage autonomous reasoning to discover performance pockets and eliminate wasteful ad spend.
            </p>
          </div>
          <OptimizationEngine />
        </main>
      </SidebarInset>
    </div>
  );
}
