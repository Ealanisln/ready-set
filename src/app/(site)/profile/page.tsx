// src/app/(site)/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "@/components/ui/skeleton";
import ModernUserProfile from "@/components/User/UserProfile/ModernUserProfile";

export default function ProfilePage() {
  const router = useRouter();
  const { session, isLoading: isUserLoading, user } = useUser();

  useEffect(() => {
    if (!isUserLoading && !session) {
      router.push('/sign-in');
    }
  }, [session, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const userId = user.id;

  if (!userId) {
    console.error("User ID not found in context despite user object existing.");
    return <div className="p-4 text-red-600">Error: Could not load user profile. Please try again later.</div>;
  }

  return <ModernUserProfile userId={userId} isUserProfile />;
}