
"use client";

import {
  LayoutDashboard,
  Layers,
  Sparkles,
  Target,
  Settings,
  BarChart3,
  BrainCircuit,
  Users,
  Terminal,
  Database,
  Rocket,
  ShieldAlert,
  DollarSign,
  TrendingUp,
  Briefcase,
  Activity,
  ShieldCheck,
  Cpu,
  FileBadge,
  Network,
  Globe,
  Wallet,
  Coins
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
  { icon: LayoutDashboard, label: "Digital Boardroom", href: "/" },
  { icon: Coins, label: "Trust Economy", href: "/economy" },
  { icon: DollarSign, label: "Finance Intel", href: "/finance" },
  { icon: Activity, label: "Operational Twin", href: "/operations" },
];

const executiveNav = [
  { icon: Cpu, label: "AI Council", href: "/agents" },
  { icon: Network, label: "Trust Network", href: "/network" },
  { icon: Terminal, label: "Sovereign Chat", href: "/intelligence" },
  { icon: ShieldAlert, label: "Risk Observatory", href: "/risk" },
];

const growthNav = [
  { icon: FileBadge, label: "Compliance & Legal", href: "/compliance" },
  { icon: BarChart3, label: "Revenue Ops", href: "/revenue" },
  { icon: Users, label: "Customer 360", href: "/customers" },
  { icon: Database, label: "Knowledge Bank", href: "/library" },
];

const toolsNav = [
  { icon: Sparkles, label: "Creative Studio", href: "/ai-tools/copywriter" },
  { icon: BrainCircuit, label: "Strategy Engine", href: "/ai-tools/optimization" },
  { icon: Target, label: "Market Intel", href: "/ai-tools/targeting" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center blue-glow">
            <span className="font-headline font-bold text-primary-foreground">S</span>
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-white">SEIP</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sovereign Core</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
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
          <SidebarGroupLabel>Executive Council</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {executiveNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
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
          <SidebarGroupLabel>Growth & Ops</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {growthNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
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
          <SidebarGroupLabel>Intelligence Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
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
              <span>Sovereign Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
