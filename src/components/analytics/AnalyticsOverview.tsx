
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: "Mon", roi: 2.4 },
  { name: "Tue", roi: 3.1 },
  { name: "Wed", roi: 2.8 },
  { name: "Thu", roi: 4.2 },
  { name: "Fri", roi: 3.8 },
  { name: "Sat", roi: 4.5 },
  { name: "Sun", roi: 5.1 },
];

export function AnalyticsOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="glass-panel lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Daily ROI Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ChartContainer config={{ roi: { label: "ROI", color: "hsl(var(--accent))" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="roi" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.roi > 3.5 ? "hsl(var(--accent))" : "hsl(var(--primary))"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Efficiency Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-headline font-bold text-accent">84/100</div>
            <p className="text-xs text-muted-foreground mt-2">
              Your conversion efficiency is 12% higher than last week.
            </p>
            <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: '84%' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Top Interest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">Digital Nomads</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">CTR: 4.2%</span>
              <span className="text-xs text-green-400 font-bold">+0.8%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
