// src/app/(backend)/admin/catering-orders/page.tsx

import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CateringOrdersPage from "@/components/Orders/CateringOrders/CateringOrdersPage";
import { PageHeader } from "@/components/Dashboard/ui/PageHeader"; // Adjust import path if needed
import { serverLogger } from "@/utils/server-logger";

export const metadata: Metadata = {
  title: "Catering Orders | Admin Dashboard",
  description: "Manage and track all catering orders across the platform",
};

const Orders = async () => {
  const currentPath = '/admin/catering-orders';

  // Server-side authentication check to prevent unauthorized access
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Log the authentication failure and redirect
    serverLogger.warn(
      'Auth redirect: User not authenticated', 
      'auth',
      {
        path: currentPath,
        redirectTo: `/sign-in?returnTo=${currentPath}`
      }
    );
    
    // Redirect to login if not authenticated
    redirect("/sign-in?returnTo=/admin/catering-orders");
  }

  // Check user role to ensure they have admin privileges
  const { data: profile } = await supabase
    .from("profiles")
    .select("type")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "super_admin", "helpdesk"].includes(profile.type.toLowerCase())) {
    // Log the authorization failure
    serverLogger.warn(
      'Auth redirect: User not authorized', 
      'auth',
      {
        path: currentPath,
        redirectTo: '/',
        userId: user.id,
        userRole: profile?.type || 'unknown'
      }
    );
    
    // Redirect to appropriate page if not an admin or helpdesk
    redirect("/");
  }

  // Log successful access
  serverLogger.info(
    'Auth check successful: Catering Orders page accessed',
    'auth',
    {
      userId: user.id,
      userRole: profile.type,
      path: currentPath
    }
  );

  return (
    // This outer div might not be strictly necessary if the layout handles background
    // Keeping it simple here.
    <div className="flex w-full flex-col"> 
      {/* Wrapper for header, giving it specific padding */}
      <div className="p-6 pb-0"> 
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            // { label: "Orders", href: "/admin/orders" }, // Removed intermediate step if not needed
            { label: "Catering Orders", href: "/admin/catering-orders", active: true },
          ]}
        />
      </div>
      {/* Render the main page content component */}
      <CateringOrdersPage /> 
    </div>
  );
};

export default Orders;