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
  { time: "00:00", volume: 1240, recycled: 520 },
  { time: "04:00", volume: 1580, recycled: 670 },
  { time: "08:00", volume: 2100, recycled: 890 },
  { time: "12:00", volume: 4500, recycled: 1900 },
  { time: "16:00", volume: 3800, recycled: 1600 },
  { time: "20:00", volume: 5200, recycled: 2200 },
  { time: "23:59", volume: 4800, recycled: 2040 },
];

const chartConfig = {
  volume: {
    label: "Total Volume ($)",
    color: "hsl(var(--accent))",
  },
  recycled: {
    label: "Recycled Yield ($)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function YieldFlow() {
  return (
    <div className="h-full w-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillRecycled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="hsl(var(--accent))"
              fillOpacity={1}
              fill="url(#fillVolume)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="recycled"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#fillRecycled)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}