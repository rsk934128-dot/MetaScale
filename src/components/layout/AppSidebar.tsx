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
  Scale
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
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const civicNav = [
  { icon: Globe, label: "Control Plane", href: "/" },
  { icon: Waves, label: "Civic Intelligence", href: "/civic" },
  { icon: Milestone, label: "Roadmap", href: "/roadmap" },
];

const financialNav = [
  { icon: DollarSign, label: "Fiscal Command", href: "/finance" },
  { icon: Scale, label: "Eco Governance", href: "/economy" },
  { icon: Gavel, label: "Compliance & KYB", href: "/compliance" },
  { icon: Activity, label: "Revenue Ops", href: "/revenue" },
];

const securityNav = [
  { icon: ShieldAlert, label: "Security Intelligence", href: "/risk" },
  { icon: Lock, label: "Identity & Trust", href: "/network" },
  { icon: Terminal, label: "Sovereign Chat", href: "/intelligence" },
];

const infraNav = [
  { icon: Network, label: "42-Node Mesh", href: "/infrastructure" },
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

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (pathname === '/login') return null;

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center cyan-glow">
            <span className="font-headline font-bold text-accent-foreground">S</span>
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-white uppercase italic">Sovereign</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Civic Intelligence</SidebarGroupLabel>
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
          <SidebarGroupLabel>Financial Sovereign</SidebarGroupLabel>
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
          <SidebarGroupLabel>Security Intelligence</SidebarGroupLabel>
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
          <SidebarGroupLabel>Infrastructure Mesh</SidebarGroupLabel>
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
                <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest">
                  <UserIcon className="mr-2 h-3 w-3" /> Profile
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
