
"use client";

import { useState, useMemo, useRef } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Image as ImageIcon, 
  MoreVertical, 
  Download, 
  ExternalLink, 
  RefreshCw,
  Loader2,
  Trash2,
  Cloud
} from "lucide-react";
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
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function CreativeLibrary() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [search, setSearch] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch personal assets from Firestore
  const assetsQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'users', user.uid, 'assets'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user?.uid]);

  const { data: myAssets, loading } = useCollection<any>(assetsQuery);

  const handleLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !firestore || !user?.uid) return;

    // Prototypes often use small files. Document size limit in Firestore is 1MB.
    if (file.size > 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Prototype limit is 1MB for mesh persistence."
      });
      return;
    }

    setIsSyncing(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const dataUrl = event.target?.result as string;
        const assetId = `LOCAL_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        
        const assetData = {
          id: assetId,
          name: file.name,
          url: dataUrl,
          thumbnail: dataUrl,
          mimeType: file.type,
          source: 'LOCAL_UPLOAD',
          createdAt: Date.now()
        };

        const assetRef = doc(firestore, 'users', user.uid, 'assets', assetId);
        await setDoc(assetRef, assetData);

        emitEvent('INFRA', 'LOCAL_ASSET_UPLOADED', 4, { fileName: file.name });
        toast({
          title: "Asset Uploaded",
          description: `"${file.name}" has been bound to your mesh node.`,
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "Kernel rejected local file persistence.",
        });
      } finally {
        setIsSyncing(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      toast({ variant: "destructive", title: "Read Error", description: "Failed to read local file." });
      setIsSyncing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDriveFiles = async (files: any[]) => {
    if (!firestore || !user?.uid) return;

    setIsSyncing(true);
    try {
      for (const file of files) {
        const assetId = `ASSET_${file.id}`;
        const assetData = {
          id: assetId,
          driveId: file.id,
          name: file.name,
          url: file.url,
          thumbnail: file.thumbnails?.[0]?.url || file.iconUrl,
          mimeType: file.mimeType,
          source: 'GOOGLE_DRIVE',
          createdAt: Date.now()
        };

        const assetRef = doc(firestore, 'users', user.uid, 'assets', assetId);
        await setDoc(assetRef, assetData).catch(err => {
           errorEmitter.emit('permission-error', new FirestorePermissionError({
             path: assetRef.path,
             operation: 'create',
             requestResourceData: assetData
           }));
        });
      }

      emitEvent('INFRA', 'DRIVE_ASSETS_IMPORTED', 4, { count: files.length });
      toast({
        title: "Integration Successful",
        description: `${files.length} assets have been bound to your Mesh library.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "Failed to persist assets to the Sovereign Mesh.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!firestore || !user?.uid) return;
    try {
      await deleteDoc(doc(firestore, 'users', user.uid, 'assets', assetId));
      toast({ title: "Asset Removed", description: "Node has been isolated from the library." });
    } catch (err) {
      toast({ variant: "destructive", title: "Action Failed", description: "Kernel rejected deletion." });
    }
  };

  const filteredMyAssets = myAssets?.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search your mesh library..." 
            className="pl-10 bg-secondary/30 border-white/5"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <GoogleDrivePicker onFilesSelected={handleDriveFiles} />
          
          <Button 
            size="sm" 
            className="cyan-glow bg-accent text-background font-bold h-9"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSyncing}
          >
            {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Upload Local
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,video/*" 
            onChange={handleLocalUpload} 
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
           <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
             <Cloud className="h-4 w-4 text-accent" />
             Personal Mesh Assets
           </h3>
           <Badge variant="outline" className="text-[10px] font-mono border-accent/20 text-accent">
             {filteredMyAssets.length} SYNCED
           </Badge>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
             <Loader2 className="h-8 w-8 animate-spin" />
             <p className="text-[10px] mt-4 font-bold uppercase tracking-widest">Accessing Mesh Node...</p>
          </div>
        ) : filteredMyAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-secondary/10 text-center">
             <div className="p-4 rounded-full bg-accent/5 border border-accent/10 mb-4">
                <Cloud className="h-10 w-10 text-accent opacity-20" />
             </div>
             <p className="text-xs text-muted-foreground italic max-w-xs">
                আপনার লাইব্রেরি বর্তমানে ফাঁকা। ড্রাইভ থেকে বা লোকাল থেকে ফাইল ইমপোর্ট করুন সরাসরি আপনার ড্যাশবোর্ডে।
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMyAssets.map((asset) => (
              <Card key={asset.id} className="group glass-panel overflow-hidden border-white/5 hover:border-accent/30 transition-all shadow-xl">
                <div className="relative aspect-video overflow-hidden bg-black/40">
                  {asset.thumbnail ? (
                    <Image
                      src={asset.thumbnail}
                      alt={asset.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <ImageIcon className="h-10 w-10 text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" asChild>
                       <a href={asset.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                       </a>
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-8 w-8 rounded-full bg-red-500/80 hover:bg-red-500"
                      onClick={() => handleDeleteAsset(asset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate w-full">{asset.name}</h4>
                      <p className="text-[9px] text-muted-foreground font-mono uppercase">{asset.mimeType?.split('/')[1] || 'FILE'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="outline" className="text-[8px] py-0 border-accent/20 text-accent font-bold uppercase tracking-tighter">
                       {asset.source === 'LOCAL_UPLOAD' ? <Plus className="mr-1 h-2 w-2" /> : <Cloud className="mr-1 h-2 w-2" />}
                       {asset.source.replace('_', ' ')}
                     </Badge>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-[8px] text-muted-foreground font-mono">
                  TS: {new Date(asset.createdAt).toLocaleDateString()}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stock/Recommended Section */}
      <div className="pt-12 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
           <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground opacity-60">System Recommended</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           {PlaceHolderImages.slice(0, 6).map((asset) => (
             <div key={asset.id} className="group relative aspect-square rounded-lg overflow-hidden border border-white/5">
                <Image src={asset.imageUrl} alt="stock" fill className="object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                   <Button size="icon" variant="ghost" className="h-8 w-8 text-accent"><Plus className="h-4 w-4" /></Button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
