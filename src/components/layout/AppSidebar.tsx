
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
  ShieldAlert
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
  { icon: LayoutDashboard, label: "Mission Control", href: "/" },
  { icon: Layers, label: "Operations Hub", href: "/campaigns" },
  { icon: BarChart3, label: "Predictive Analytics", href: "/analytics" },
];

const aiNav = [
  { icon: Rocket, label: "Agent Console", href: "/agents" },
  { icon: Terminal, label: "Command Chat (RAG)", href: "/intelligence" },
  { icon: Sparkles, label: "AI Creative Studio", href: "/ai-tools/copywriter" },
  { icon: BrainCircuit, label: "Optimization Engine", href: "/ai-tools/optimization" },
  { icon: Target, label: "Targeting Intelligence", href: "/ai-tools/targeting" },
];

const knowledgeNav = [
  { icon: Database, label: "Knowledge Assets", href: "/library" },
  { icon: Users, label: "Agency Clients", href: "/clients" },
  { icon: ShieldAlert, label: "War Room Alerts", href: "/notifications" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center blue-glow">
            <span className="font-headline font-bold text-primary-foreground">A</span>
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-white">AMOS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core Mission</SidebarGroupLabel>
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
          <SidebarGroupLabel>Knowledge & Governance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {knowledgeNav.map((item) => (
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
              <span>System Configuration</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
