
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
  Settings
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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const civicNav = [
  { icon: Globe, label: "Control Plane", href: "/" },
  { icon: Waves, label: "Civic Intelligence", href: "/civic" },
  { icon: Zap, label: "SOS Dispatcher", href: "/civic/sos" },
];

const financialNav = [
  { icon: DollarSign, label: "Fiscal Command", href: "/finance" },
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
  { icon: Radio, label: "Anycast Routing", href: "/infrastructure/routing" },
  { icon: Cpu, label: "AI Council", href: "/agents" },
  { icon: Database, label: "Knowledge Bank", href: "/library" },
];

export function AppSidebar() {
  const pathname = usePathname();

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
                    <Link href={item.href} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
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
                    <Link href={item.href} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
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
                    <Link href={item.href} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
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
                    <Link href={item.href} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
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
      <SidebarFooter className="p-4 border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Global Settings">
              <Settings className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">System Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
