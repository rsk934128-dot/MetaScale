
"use client";

import { useState } from "react";
import { Search, Plus, Filter, Image as ImageIcon, MoreVertical, Download, ExternalLink, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { GoogleDrivePicker } from "./GoogleDrivePicker";

export function CreativeLibrary() {
  const [search, setSearch] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const images = PlaceHolderImages.filter(img => img.id.startsWith('ad-creative'));

  const handleDriveFiles = (files: any[]) => {
    console.log("Files imported from Drive:", files);
    // In a real implementation, we would save these to Firestore collection /assets
    // and sync the metadata.
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search assets..." 
            className="pl-10 bg-secondary/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="ghost" size="sm" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <GoogleDrivePicker onFilesSelected={handleDriveFiles} />
          <Button size="sm" className="cyan-glow bg-accent hover:bg-accent/90 font-bold">
            <Plus className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((asset) => (
          <Card key={asset.id} className="group glass-panel overflow-hidden border-white/5 hover:border-accent/30 transition-all">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={asset.imageUrl}
                alt={asset.description}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={asset.imageHint}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-white line-clamp-1">{asset.description}</h4>
                  <p className="text-[10px] text-muted-foreground font-mono">ID: {asset.id}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Use in Ad Set</DropdownMenuItem>
                    <DropdownMenuItem>View in Drive</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete Asset</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                 <Badge variant="secondary" className="text-[10px] py-0">1080x1080</Badge>
                 <Badge variant="outline" className="text-[10px] py-0 border-accent/20 text-accent">Drive Synced</Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-[10px] text-muted-foreground">
              Last synced: Today
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
