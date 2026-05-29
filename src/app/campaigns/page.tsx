
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { CampaignHierarchy } from "@/components/campaigns/CampaignHierarchy";
import { Layers, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CampaignsPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-accent" />
              Campaign Manager
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button size="sm" className="cyan-glow font-bold">
              <Plus className="mr-2 h-4 w-4" /> New Campaign
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-headline font-bold mb-2">Hierarchical Control</h2>
            <p className="text-muted-foreground">
              Monitor and scale your Campaigns, Ad Sets, and individual Ads in a unified view.
            </p>
          </div>
          <CampaignHierarchy />
        </main>
      </SidebarInset>
    </div>
  );
}
