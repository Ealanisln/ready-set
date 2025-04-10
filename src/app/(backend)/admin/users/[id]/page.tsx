// src/app/(backend)/admin/users/[id]/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import ModernUserProfile from "@/components/Dashboard/UserView/AdminProfileView";

export default function EditUser() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { session, isLoading: isUserLoading } = useUser();

  // Get the ID using useParams
  const userId = params?.id;

  // Check auth status and redirect if needed
  useEffect(() => {
    if (!isUserLoading && !session) {
      router.push('/sign-in');
    }
  }, [session, isUserLoading, router]);

  // Render loading or null if userId is not yet available
  if (!userId || isUserLoading) {
    // You can replace null with a loading spinner component if you prefer
    return null;
  }

  // Simple wrapper that passes the user ID to the component
  return <ModernUserProfile userId={userId} />;
}