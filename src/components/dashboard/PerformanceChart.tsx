
"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { date: "May 1", reach: 4500, conversions: 120 },
  { date: "May 5", reach: 5200, conversions: 150 },
  { date: "May 10", reach: 4800, conversions: 110 },
  { date: "May 15", reach: 6100, conversions: 210 },
  { date: "May 20", reach: 5900, conversions: 180 },
  { date: "May 25", reach: 7200, conversions: 250 },
  { date: "May 30", reach: 8100, conversions: 310 },
];

const chartConfig = {
  reach: {
    label: "Reach",
    color: "hsl(var(--primary))",
  },
  conversions: {
    label: "Conversions",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function PerformanceChart() {
  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillReach" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-reach)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-reach)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillConversions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-conversions)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-conversions)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="reach"
              stroke="var(--color-reach)"
              fillOpacity={1}
              fill="url(#fillReach)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="conversions"
              stroke="var(--color-conversions)"
              fillOpacity={1}
              fill="url(#fillConversions)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
