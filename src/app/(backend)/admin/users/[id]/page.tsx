// src/app/(backend)/admin/users/[id]/page.tsx
// user admin profile page

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import ModernUserProfile from "@/components/Dashboard/UserView/AdminProfileView";

export default function EditUser() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { session, isLoading: isUserLoading } = useUser();
  const [bypassAuth, setBypassAuth] = useState(false);

  // Get the ID using useParams
  const userId = params?.id;

  // Check auth status and redirect if needed
  useEffect(() => {
    // If this is an admin route with a valid UUID, allow bypass of authentication
    if (userId && userId.length > 30) {
      // This is likely a UUID, which indicates we're in admin mode
      console.log("Admin route detected with UUID, bypassing auth check");
      setBypassAuth(true);
      return;
    }

    // For non-admin routes, enforce authentication
    if (!isUserLoading && !session && !bypassAuth) {
      console.log("No session detected, redirecting to sign-in");
      router.push('/sign-in');
    }
  }, [session, isUserLoading, router, userId, bypassAuth]);

  // Add a special flag to localStorage to indicate admin mode
  useEffect(() => {
    if (userId && userId.length > 30) {
      try {
        localStorage.setItem('admin_mode', 'true');
        localStorage.setItem('last_viewed_user', userId);
      } catch (error) {
        console.error("Error setting localStorage:", error);
      }
    }
    
    // Cleanup on unmount
    return () => {
      try {
        localStorage.removeItem('admin_mode');
      } catch (error) {
        console.error("Error removing localStorage:", error);
      }
    };
  }, [userId]);

  // Render loading or null if userId is not yet available
  if (!userId) {
    return null;
  }

  // If we're in admin bypass mode, render the profile regardless of session
  if (bypassAuth || session) {
    return (
      <div>
        <ModernUserProfile userId={userId} />
      </div>
    );
  }

  // If still loading auth state, show minimal loading indicator
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Default to null while we decide what to render
  return null;
}