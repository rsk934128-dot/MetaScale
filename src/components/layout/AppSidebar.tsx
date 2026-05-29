"use client";

import {
  LayoutDashboard,
  Layers,
  Sparkles,
  Target,
  Settings,
  BarChart3,
  BrainCircuit,
  Bell,
  Users,
  Terminal,
  Database,
  Rocket,
  ShieldAlert,
  DollarSign,
  TrendingUp,
  Briefcase
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

const mainNav = [
  { icon: LayoutDashboard, label: "Global Command", href: "/" },
  { icon: BarChart3, label: "Revenue Ops", href: "/revenue" },
  { icon: Users, label: "Customer 360", href: "/customers" },
];

const aiNav = [
  { icon: Rocket, label: "Agent Hub", href: "/agents" },
  { icon: Terminal, label: "Intelligence Chat", href: "/intelligence" },
  { icon: Sparkles, label: "Creative Studio", href: "/ai-tools/copywriter" },
  { icon: BrainCircuit, label: "Strategy Engine", href: "/ai-tools/optimization" },
  { icon: Target, label: "Market Intelligence", href: "/ai-tools/targeting" },
];

const strategyNav = [
  { icon: Briefcase, label: "Board Objectives", href: "/strategy" },
  { icon: Database, label: "Knowledge Assets", href: "/library" },
  { icon: Layers, label: "Campaign Hub", href: "/campaigns" },
  { icon: ShieldAlert, label: "War Room Alerts", href: "/notifications" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center blue-glow">
            <span className="font-headline font-bold text-primary-foreground">E</span>
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-white">EGIOS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Enterprise Growth</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
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
          <SidebarGroupLabel>Autonomous Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
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
          <SidebarGroupLabel>Governance & Ops</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {strategyNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
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
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className="h-4 w-4" />
              <span>System Config</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
