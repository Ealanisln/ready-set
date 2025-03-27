// src/components/Dashboard/Sidebar/app-sidebar.tsx

"use client";

import React from "react";
import {
  ArchiveIcon,
  Gauge,
  Home,
  Settings,
  Truck,
  Users,
  Zap,
  ChevronDown,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useUser } from "@/contexts/UserContext";

type SidebarNavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  isActive?: boolean;
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  // Main navigation items
  const mainNavItems: SidebarNavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Home,
      isActive: pathname === "/admin",
    },
    {
      title: "Catering Orders",
      href: "/admin/catering-orders",
      icon: Truck,
      isActive: pathname.includes("/admin/catering-orders"),
    },
    {
      title: "On-demand Orders",
      href: "/admin/on-demand-orders",
      icon: Zap,
      isActive: pathname.includes("/admin/on-demand-orders"),
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      isActive: pathname.includes("/admin/users"),
    },
    {
      title: "Legacy Data",
      href: "/admin/legacy",
      icon: ArchiveIcon,
      isActive: pathname.includes("/admin/legacy"),
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin">
                <Gauge className="h-5 w-5" />
                <span>Ready Set</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Quick Actions
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <SidebarGroupAction>
              <Plus /> <span className="sr-only">Add Action</span>
            </SidebarGroupAction>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/catering-orders/new">
                        <Truck className="h-5 w-5" />
                        <span>New Order</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/users/new-user">
                        <Users className="h-5 w-5" />
                        <span>New User</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    {/* FIX: Access avatarUrl from user_metadata */}
                    <AvatarImage src={user?.user_metadata?.avatarUrl} />
                    {/* FIX: Access name from user_metadata for fallback */}
                    <AvatarFallback>
                      {user?.user_metadata?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* FIX: Access name from user_metadata for display */}
                  <span>{user?.user_metadata?.name || "User"}</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => console.log("Sign out clicked")}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
