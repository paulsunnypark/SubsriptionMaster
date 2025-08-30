"use client";

import { 
  LayoutDashboard, 
  CreditCard, 
  Upload, 
  Bell, 
  PiggyBank, 
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
  { title: "Upload Data", url: "/ingest", icon: Upload },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Savings", url: "/savings", icon: PiggyBank },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    const active = isActive(path);
    return active 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent text-muted-foreground hover:text-foreground";
  };

  return (
    <Sidebar className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex-shrink-0" style={{ 
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 40
    }}>
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SM</span>
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">SubscriptionMaster</h2>
            <p className="text-xs text-muted-foreground">Smart Savings</p>
          </div>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.url} 
                      className={getNavClassName(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
