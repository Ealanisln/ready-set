// src/components/Dashboard/Sidebar/app-sidebar.tsx

"use client";

import React, { useState, useEffect } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const { user } = useUser();

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = await createClient();
        setSupabase(client);
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
        toast.error("Connection error. Please try again later.");
      }
    };

    initSupabase();
  }, []);

  const handleSignOut = async () => {
    if (!supabase) {
      toast.error("Unable to connect to authentication service");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Successfully signed out");
      router.push("/sign-in");
      router.refresh(); // Refresh to update auth state across the app
    } catch (err: any) {
      console.error("Sign out error:", err);
      toast.error(err.message || "An unexpected error occurred while signing out");
    } finally {
      setIsLoading(false);
    }
  };

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
      isActive: pathname?.includes("/admin/catering-orders") ?? false,
    },
    {
      title: "On-demand Orders",
      href: "/admin/on-demand-orders",
      icon: Zap,
      isActive: pathname?.includes("/admin/on-demand-orders") ?? false,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      isActive: pathname?.includes("/admin/users") ?? false,
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <SidebarMenu className="mb-0">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-0 h-auto">
              <Link href="/admin" className="flex justify-center items-center w-full py-2">
                <Image
                  src="/images/logo/logo-white.png"
                  alt="Ready Set Logo"
                  width={240}
                  height={80}
                  className="w-[240px] h-auto max-w-full"
                  priority
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-1">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                    className="py-1.5"
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
            <SidebarGroupLabel asChild className="px-3 py-1">
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
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing out..." : "Sign out"}
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
