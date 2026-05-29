
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { CampaignHierarchy } from "@/components/campaigns/CampaignHierarchy";
import { 
  ArrowUpRight, 
  Users, 
  Target, 
  Zap, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="cyan-glow text-xs font-bold bg-accent hover:bg-accent/90">
              <Zap className="mr-1 h-3 w-3" /> Sync API
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto w-full">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Reach", value: "2.4M", trend: "+12.5%", icon: Users },
              { label: "Ad Spend", value: "$45,290", trend: "+3.2%", icon: Target },
              { label: "Avg ROAS", value: "3.2x", trend: "+0.8x", icon: ArrowUpRight, isGood: true },
              { label: "Conversions", value: "12,402", trend: "+18.4%", icon: Zap, isGood: true },
            ].map((stat, i) => (
              <Card key={i} className="glass-panel">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-headline font-bold">{stat.value}</h3>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1">
                    <span className={`text-xs font-medium ${stat.isGood ? 'text-green-400' : 'text-primary'}`}>
                      {stat.trend}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Chart */}
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Real-time campaign scaling insights</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View Reports <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>

          {/* Campaign Manager Snippet */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold">Recent Campaigns</h2>
              <Link href="/campaigns">
                <Button variant="link" className="text-accent">
                  Full Campaign Manager <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CampaignHierarchy />
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
