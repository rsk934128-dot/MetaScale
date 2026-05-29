
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { PerformanceTable } from "@/components/analytics/PerformanceTable";
import { BarChart3, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Advanced Analytics
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full space-y-8">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-2">Performance Intelligence</h2>
            <p className="text-muted-foreground">
              Deep dive into ROI, conversion paths, and creative effectiveness.
            </p>
          </div>

          <AnalyticsOverview />
          
          <div className="space-y-4">
            <h3 className="text-xl font-headline font-bold">Entity Breakdown</h3>
            <PerformanceTable />
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
