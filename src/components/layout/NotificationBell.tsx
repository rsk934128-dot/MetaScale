
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
      case 'CRITICAL': return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'WARNING': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'DIRECTIVE': return <Mail className="h-4 w-4 text-accent" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
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
      <DropdownMenuContent align="end" className="w-80 glass-panel border-white/5 p-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <DropdownMenuLabel className="p-0 text-xs font-bold uppercase tracking-widest text-accent">
            Citizen Directives
          </DropdownMenuLabel>
          <Badge variant="outline" className="text-[8px] font-mono border-white/10 opacity-50">
            MESH_SYNC_ACTIVE
          </Badge>
        </div>
        <ScrollArea className="h-[350px]">
          <div className="p-1">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "p-3 mb-1 rounded-lg border border-transparent hover:border-white/5 transition-all group relative",
                    !notif.read ? "bg-accent/5" : "bg-transparent opacity-60"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-1">
                      {getTypeIcon(notif.type)}
                    </div>
                    <div className="space-y-1 pr-8">
                      <p className="text-[11px] font-bold text-white uppercase tracking-tight line-clamp-1">{notif.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{notif.message}</p>
                      <p className="text-[8px] font-mono text-muted-foreground/50">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 text-accent hover:bg-accent/10"
                        onClick={() => markAsRead(notif.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 text-red-400 hover:bg-red-400/10"
                      onClick={() => deleteNotification(notif.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 opacity-30">
                <Bell className="h-10 w-10 mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest">No Active Directives</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <DropdownMenuSeparator className="bg-white/5" />
        <div className="p-2">
          <Button variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest hover:text-accent">
            View All Logs
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
