// src/app/(site)/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "@/components/ui/skeleton";
import ModernUserProfile from "@/components/User/UserProfile/ModernUserProfile";
import { BackButton } from "@/components/Common/BackButton";

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <Skeleton className="h-12 w-1/3 mb-6" />
            <div className="space-y-6">
              <Skeleton className="h-32 w-full rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userId = user.id;

  if (!userId) {
    console.error("User ID not found in context despite user object existing.");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="p-4 text-red-600 flex items-center justify-center">
              <p>Error: Could not load user profile. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <BackButton className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <ModernUserProfile userId={userId} isUserProfile />
        </div>
      </div>
    </div>
  );
}