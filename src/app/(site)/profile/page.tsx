// src/app/(site)/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/Common/BackButton";
import AdminProfileView from "@/components/Dashboard/UserView/AdminProfileView";

export default function ProfilePage() {
  const router = useRouter();
  const { session, isLoading: isUserLoading, user } = useUser();
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !session) {
      router.push('/sign-in');
    } else if (!isUserLoading && session && user) {
      setUserReady(true);
    }
  }, [session, isUserLoading, router, user]);

  // Add a special flag to localStorage to indicate user mode (not admin mode)
  useEffect(() => {
    if (user?.id) {
      try {
        // Remove admin_mode flag if it exists to ensure normal user mode
        localStorage.removeItem('admin_mode');
      } catch (error) {
        console.error("Error managing localStorage:", error);
      }
    }
  }, [user]);

  if (isUserLoading || !userReady) {
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

  // If we get this far, userReady is true, which means user is guaranteed to exist
  // But TypeScript still needs explicit check
  const userId = user?.id;

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
          {/* Use the AdminProfileView component with isUserProfile=true to show only user-relevant features */}
          <AdminProfileView userId={userId} isUserProfile={true} />
        </div>
      </div>
    </div>
  );
}