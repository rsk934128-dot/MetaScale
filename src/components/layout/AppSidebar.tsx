
"use client";

import {
  Globe,
  Waves,
  ShieldAlert,
  DollarSign,
  Activity,
  Cpu,
  Network,
  Terminal,
  Database,
  Lock,
  Zap,
  Radio,
  Gavel,
  Settings,
  Milestone,
  LogOut,
  User as UserIcon,
  Mail,
  Scale,
  Code2,
  UserCircle,
  Music2,
  ShieldCheck,
  Gem,
  TrendingUp,
  Search,
  CreditCard,
  ShoppingBag,
  Unplug,
  Sparkles,
  Braces,
  BrainCircuit,
  FileSearch,
  Smartphone,
  MessageSquare,
  ArrowRightLeft,
  Trophy
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useAuth, useFirestore, useDoc } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "./NotificationBell";
import { Logo } from "@/components/ui/logo";
import { doc } from "firebase/firestore";
import { useMemo } from "react";

const civicNav = [
  { icon: Globe, label: "Mission Control", href: "/dashboard" },
  { icon: TrendingUp, label: "Insights Hub", href: "/insights" },
  { icon: Waves, label: "Civic Intelligence", href: "/civic" },
  { icon: Music2, label: "Media Intelligence", href: "/media" },
  { icon: Trophy, label: "FIFA Live Hub", href: "/fifa-hub" },
];

const financialNav = [
  { icon: DollarSign, label: "Fiscal Command", href: "/finance" },
  { icon: ArrowRightLeft, label: "Remit Corridor", href: "/corridor" },
  { icon: Scale, label: "P45: Eco Governance", href: "/economy" },
  { icon: Activity, label: "Revenue Ops", href: "/revenue" },
];

const projectNav = [
  { icon: Milestone, label: "System Roadmap", href: "/roadmap" },
  { icon: ShieldCheck, label: "Verification Center", href: "/profile" },
  { icon: ShieldCheck, label: "Shurukkha Standard", href: "/shurukkha-standard" },
  { icon: Braces, label: "P43: Syntax Architect", href: "/syntax" },
];

const securityNav = [
  { icon: ShieldAlert, label: "Security Intelligence", href: "/risk" },
  { icon: FileSearch, label: "SAM Reader", href: "/sam-reader" },
  { icon: Lock, label: "Identity & Trust", href: "/network" },
  { icon: BrainCircuit, label: "Sovereign Chat", href: "/intelligence" },
];

const infraNav = [
  { icon: Network, label: "42-Node Mesh", href: "/infrastructure" },
  { icon: Unplug, label: "UBIL Mainframe", href: "/ubil" },
  { icon: Smartphone, label: "SMS Reader", href: "/sms-reader" },
  { icon: Cpu, label: "AI Council", href: "/agents" },
  { icon: Database, label: "Knowledge Bank", href: "/library" },
  { icon: Mail, label: "Communication Plane", href: "/communications" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const userRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc<any>(userRef);
  const isAdmin = profile?.role === 'ADMIN';

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const isDashboardRoute = pathname !== '/' && pathname !== '/login';

  if (!isDashboardRoute) return null;

  return (
    <Sidebar className="border-r border-border/50 shadow-2xl">
      <SidebarHeader className="p-6 flex flex-row items-center justify-between border-b border-white/5 bg-background/50">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo size="sm" className="transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-xl tracking-tight text-white uppercase italic">Sovereign</span>
        </Link>
        <NotificationBell />
      </SidebarHeader>
      <SidebarContent>
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-accent uppercase tracking-widest text-[10px] font-bold">Admin Command</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === '/admin/compliance'} tooltip="Compliance Center">
                    <Link 
                      href="/admin/compliance" 
                      className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-accent"
                      onClick={handleLinkClick}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Admin Compliance</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary uppercase tracking-widest text-[10px] font-bold">Successive Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectNav.map((item) => (
                <SidebarMenuItem key={item.label + item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link 
                      href={item.href} 
                      className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary/80"
                      onClick={handleLinkClick}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-widest text-[10px] font-bold opacity-50">Financial Sovereign</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financialNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link 
                      href={item.href} 
                      className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
                      onClick={handleLinkClick}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-widest text-[10px] font-bold opacity-50">Civic Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {civicNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link 
                      href={item.href} 
                      className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
                      onClick={handleLinkClick}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-widest text-[10px] font-bold opacity-50">Security Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {securityNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link 
                      href={item.href} 
                      className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
                      onClick={handleLinkClick}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-widest text-[10px] font-bold opacity-50">Infrastructure Mesh</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infraNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link 
                      href={item.href} 
                      className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
                      onClick={handleLinkClick}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/5 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/pricing'} tooltip="System Plans">
              <Link 
                href="/pricing" 
                className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-accent"
                onClick={handleLinkClick}
              >
                <Gem className="h-4 w-4" />
                <span>System Plans</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/api-docs'} tooltip="API Docs">
              <Link 
                href="/api-docs" 
                className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
                onClick={handleLinkClick}
              >
                <Code2 className="h-4 w-4" />
                <span>API Documentation</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/settings'} tooltip="Global Settings">
              <Link 
                href="/settings" 
                className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
                onClick={handleLinkClick}
              >
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/legal'} tooltip="Legal Bound">
              <Link 
                href="/legal" 
                className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
                onClick={handleLinkClick}
              >
                <Gavel className="h-4 w-4" />
                <span>Legal Bound</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full flex items-center gap-3">
                  <Avatar className="h-6 w-6 border border-accent/20">
                    <AvatarImage src={user?.photoURL || ''} />
                    <AvatarFallback className="bg-accent/10 text-[10px] text-accent font-bold uppercase">
                      {user?.displayName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start truncate overflow-hidden">
                    <span className="text-[10px] font-bold text-white truncate w-full">{user?.displayName || 'User'}</span>
                    <span className="text-[8px] text-muted-foreground uppercase tracking-tighter truncate w-full">{user?.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-48 glass-panel border-white/5">
                <DropdownMenuItem asChild className="text-[10px] font-bold uppercase tracking-widest">
                  <Link href="/profile" className="flex items-center w-full">
                    <UserCircle className="mr-2 h-3 w-3" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[10px] font-bold uppercase tracking-widest text-red-400 focus:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-3 w-3" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
