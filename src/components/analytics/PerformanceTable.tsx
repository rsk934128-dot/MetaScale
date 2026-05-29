
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const DATA = [
  {
    name: "Summer Launch 2024",
    type: "Campaign",
    spend: 12450.5,
    impressions: 450200,
    clicks: 12400,
    ctr: "2.75%",
    roas: "4.2x",
    trend: "up",
  },
  {
    name: "LAL Audience 1% - UK",
    type: "Ad Set",
    spend: 3200.0,
    impressions: 89000,
    clicks: 3100,
    ctr: "3.48%",
    roas: "3.8x",
    trend: "up",
  },
  {
    name: "Video Creative V2",
    type: "Ad",
    spend: 1100.2,
    impressions: 45000,
    clicks: 980,
    ctr: "2.17%",
    roas: "2.5x",
    trend: "down",
  },
  {
    name: "Interest: Tech Lovers",
    type: "Ad Set",
    spend: 4500.0,
    impressions: 120000,
    clicks: 4200,
    ctr: "3.50%",
    roas: "5.1x",
    trend: "up",
  },
];

export function PerformanceTable() {
  return (
    <div className="rounded-lg border glass-panel overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow>
            <TableHead className="font-bold">Entity Name</TableHead>
            <TableHead className="font-bold">Type</TableHead>
            <TableHead className="text-right font-bold">Spend</TableHead>
            <TableHead className="text-right font-bold">Impressions</TableHead>
            <TableHead className="text-right font-bold">CTR</TableHead>
            <TableHead className="text-right font-bold">ROAS</TableHead>
            <TableHead className="text-right font-bold">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DATA.map((row, i) => (
            <TableRow key={i} className="hover:bg-white/5 border-white/5">
              <TableCell className="font-medium text-white">{row.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight">
                  {row.type}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">${row.spend.toLocaleString()}</TableCell>
              <TableCell className="text-right font-mono">{row.impressions.toLocaleString()}</TableCell>
              <TableCell className="text-right">{row.ctr}</TableCell>
              <TableCell className="text-right">
                <span className="text-accent font-bold">{row.roas}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  {row.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-primary" />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
