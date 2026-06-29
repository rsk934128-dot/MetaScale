
"use client";

import { Bell, Zap, ShieldAlert, Info, Mail, Check, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { user } = useUser();
  const firestore = useFirestore();

  const notificationsQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'users', user.uid, 'notifications'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
  }, [firestore, user?.uid]);

  const { data: notifications } = useCollection<any>(notificationsQuery);
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const markAsRead = (id: string) => {
    if (!firestore || !user?.uid) return;
    const ref = doc(firestore, 'users', user.uid, 'notifications', id);
    updateDoc(ref, { read: true });
  };

  const deleteNotification = (id: string) => {
    if (!firestore || !user?.uid) return;
    const ref = doc(firestore, 'users', user.uid, 'notifications', id);
    deleteDoc(ref);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL': return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'WARNING': return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'DIRECTIVE': return <Mail className="h-5 w-5 text-accent" />;
      default: return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/5 transition-all group">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-1 flex items-center justify-center bg-accent text-background font-bold text-[8px] animate-pulse border-2 border-background">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[420px] glass-panel border-white/5 p-0 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
          <DropdownMenuLabel className="p-0 text-sm font-headline font-bold uppercase tracking-widest text-accent">
            Sovereign Mesh Directives
          </DropdownMenuLabel>
          <Badge variant="outline" className="text-[9px] font-mono border-accent/30 text-accent uppercase">
            {unreadCount} New Signals
          </Badge>
        </div>
        <ScrollArea className="h-[450px]">
          <div className="p-2">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "p-4 mb-2 rounded-xl border transition-all group relative flex gap-4",
                    !notif.read ? "bg-accent/10 border-accent/20 shadow-[0_0_15px_rgba(0,242,255,0.05)]" : "bg-transparent border-white/5 opacity-50"
                  )}
                >
                  <div className="shrink-0 mt-0.5">
                    <div className={cn(
                      "p-2 rounded-lg bg-black/40 border border-white/5",
                      !notif.read && "border-accent/20"
                    )}>
                      {getTypeIcon(notif.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1.5 pr-8">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-white uppercase tracking-tight leading-none">{notif.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-3">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] font-mono text-muted-foreground/60 uppercase">
                        Seal: {notif.id.substring(0, 14)}...
                      </span>
                      <span className="text-[9px] font-bold text-accent/50">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8 rounded-lg bg-accent/20 border-accent/30 text-accent hover:bg-accent hover:text-background"
                        onClick={() => markAsRead(notif.id)}
                        title="Authorize Sync"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 rounded-lg bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                      onClick={() => deleteNotification(notif.id)}
                      title="Isolate Log"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[350px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="p-4 rounded-full bg-secondary/30 border border-white/5">
                  <Bell className="h-10 w-10 text-muted-foreground/20" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">No Active Directives</p>
                  <p className="text-[10px] text-muted-foreground/40 italic">Global Mesh monitoring optimal...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DropdownMenuSeparator className="bg-white/5 m-0" />
        <div className="p-3 bg-white/5">
          <Button variant="ghost" className="w-full h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:bg-accent/10">
            Open Global Audit Trail
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
