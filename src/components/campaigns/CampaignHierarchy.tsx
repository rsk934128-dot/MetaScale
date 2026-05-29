
"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, MoreHorizontal, Circle, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type AdItem = {
  id: string;
  name: string;
  status: "active" | "paused";
  spend: number;
  roas: number;
};

type AdSetItem = {
  id: string;
  name: string;
  status: "active" | "paused";
  budget: number;
  ads: AdItem[];
};

type CampaignItem = {
  id: string;
  name: string;
  status: "active" | "paused";
  objective: string;
  adSets: AdSetItem[];
};

const MOCK_DATA: CampaignItem[] = [
  {
    id: "c1",
    name: "Summer Launch Campaign",
    status: "active",
    objective: "Conversions",
    adSets: [
      {
        id: "as1",
        name: "Lookalike Audience 1%",
        status: "active",
        budget: 500,
        ads: [
          { id: "ad1", name: "Video Creative A", status: "active", spend: 120, roas: 3.4 },
          { id: "ad2", name: "Static Image B", status: "paused", spend: 45, roas: 1.2 },
        ],
      },
      {
        id: "as2",
        name: "Interest Retargeting",
        status: "active",
        budget: 300,
        ads: [
          { id: "ad3", name: "Carousel Ad", status: "active", spend: 89, roas: 2.8 },
        ],
      },
    ],
  },
  {
    id: "c2",
    name: "Brand Awareness Q2",
    status: "paused",
    objective: "Reach",
    adSets: [
      {
        id: "as3",
        name: "Broad USA",
        status: "paused",
        budget: 1000,
        ads: [
          { id: "ad4", name: "Awareness Video", status: "paused", spend: 0, roas: 0 },
        ],
      },
    ],
  },
];

export function CampaignHierarchy() {
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set(["c1"]));
  const [expandedAdSets, setExpandedAdSets] = useState<Set<string>>(new Set(["as1"]));

  const toggleCampaign = (id: string) => {
    const next = new Set(expandedCampaigns);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedCampaigns(next);
  };

  const toggleAdSet = (id: string) => {
    const next = new Set(expandedAdSets);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedAdSets(next);
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <div className="col-span-5">Structure</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Budget/Spend</div>
        <div className="col-span-2">ROAS</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      <div className="space-y-2">
        {MOCK_DATA.map((campaign) => (
          <div key={campaign.id} className="space-y-1">
            <div className="group grid grid-cols-12 gap-4 items-center p-3 rounded-lg glass-panel hover:bg-card/80 transition-all">
              <div className="col-span-5 flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => toggleCampaign(campaign.id)}
                >
                  {expandedCampaigns.has(campaign.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-white">{campaign.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{campaign.objective}</span>
                </div>
              </div>
              <div className="col-span-2">
                <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="text-[10px]">
                  {campaign.status}
                </Badge>
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">—</div>
              <div className="col-span-2 text-sm text-muted-foreground">—</div>
              <div className="col-span-1 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {expandedCampaigns.has(campaign.id) && (
              <div className="pl-8 space-y-1">
                {campaign.adSets.map((adSet) => (
                  <div key={adSet.id} className="space-y-1">
                    <div className="group grid grid-cols-12 gap-4 items-center p-2 rounded-lg bg-secondary/30 border border-white/5 hover:bg-secondary/50 transition-all">
                      <div className="col-span-5 flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => toggleAdSet(adSet.id)}
                        >
                          {expandedAdSets.has(adSet.id) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                        <span className="text-sm text-white/90">{adSet.name}</span>
                      </div>
                      <div className="col-span-2">
                         <div className="flex items-center gap-1.5">
                            <Circle className={cn("h-2 w-2", adSet.status === "active" ? "fill-primary text-primary" : "fill-muted text-muted")} />
                            <span className="text-xs">{adSet.status}</span>
                         </div>
                      </div>
                      <div className="col-span-2 text-sm">${adSet.budget}</div>
                      <div className="col-span-2 text-sm text-muted-foreground">—</div>
                      <div className="col-span-1 text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <BarChart2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {expandedAdSets.has(adSet.id) && (
                      <div className="pl-8 space-y-1">
                        {adSet.ads.map((ad) => (
                          <div key={ad.id} className="grid grid-cols-12 gap-4 items-center p-2 rounded-lg bg-accent/5 border border-white/5 text-sm">
                            <div className="col-span-5 flex items-center gap-4 pl-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-border" />
                              <span className="text-white/70">{ad.name}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-[10px] uppercase opacity-60 font-bold">{ad.status}</span>
                            </div>
                            <div className="col-span-2">${ad.spend}</div>
                            <div className="col-span-2">
                              <Badge variant="outline" className="border-accent/30 text-accent text-[10px]">
                                {ad.roas}x ROAS
                              </Badge>
                            </div>
                            <div className="col-span-1 text-right">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <BarChart2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
