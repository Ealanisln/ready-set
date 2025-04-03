// src/app/(site)/profile/page.tsx
"use client";

import UserProfile from "@/components/User/UserProfile/ModernUserProfile";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { session, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!isLoading && !session) {
      router.push('/sign-in');
    }
  }, [isLoading, session, router]);

  // Always show loading state while auth is loading
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-semibold">Loading user session...</p>
        </div>
      </div>
    );
  }

  // Session loading is complete but no session was found
  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center pt-32">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // We have a valid session
  return <UserProfile userId={session.user.id} />;
}