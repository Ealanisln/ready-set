// src/components/User/UserProfile/ModernUserProfile.tsx
// For the user-facing version

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Save, XCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FormProvider } from "react-hook-form";

import UserProfileTabs from "./UserProfileTabs";
import { useUserData } from "./hooks/useUserData";
import { useUserForm } from "./hooks/useUserForm";
import UserHeader from "./UserHeader";
import UserDocumentsCard from "./Sidebar/UserDocumentsCard";
import { UserFormValues } from "./types";

interface UserProfileProps {
  userId?: string; // Make it optional to maintain backward compatibility
  isUserProfile?: boolean;
}

export default function UserProfile({
  userId: propUserId,
  isUserProfile = true
}: UserProfileProps = {}) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const fetchInProgressRef = useRef(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

// Auth context - get the current user ID if not provided as prop
const { session, isLoading: isUserLoading } = useUser();
const userId = propUserId || session?.user?.id;

console.log("User ID from props or session:", userId);

  // Custom hooks for user data and form management
  const { 
    loading, 
    fetchUser, 
    handleUploadSuccess,
    useUploadFileHook
  } = useUserData(userId || "", refreshTrigger, setRefreshTrigger);

  const {
    methods,
    watchedValues,
    hasUnsavedChanges,
    onSubmit
  } = useUserForm(userId || "", fetchUser);

  const { control, handleSubmit, reset, formState: { isDirty } } = methods;

  // Add this state to track last refresh time
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

  // Memoize setActiveTab
  const memoizedSetActivetab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Effect to fetch data when component mounts or dependencies change
useEffect(() => {
  // Skip if already loading to prevent cascading API calls
  if (loading || fetchInProgressRef.current) return;
  
  // Prevent refreshes that are too close together (minimum 5 seconds between refreshes)
  const now = Date.now();
  if ((now - lastRefreshTime) < 5000 && lastRefreshTime !== 0) {
    console.log("Skipping refresh - too soon since last refresh");
    return;
  }
  
  console.log("Profile component mount. Session status:", { 
    isUserLoading, 
    userId, 
    sessionExists: !!session
  });
  
  if (!isUserLoading && userId) {
    // Cancel any existing timer
    const timeoutId = setTimeout(() => {
      // Set the ref to true to indicate fetch is in progress
      fetchInProgressRef.current = true;
      console.log("About to fetch user data for ID:", userId);
      
      // Update last refresh time
      setLastRefreshTime(Date.now());
      
      fetchUser()
        .then(result => {
          console.log("Fetch user result:", result ? "Data received" : "No data");
          fetchInProgressRef.current = false;
          if (isInitialLoad) setIsInitialLoad(false);
        })
        .catch(err => {
          console.error("Error in fetchUser:", err);
          fetchInProgressRef.current = false;
          if (isInitialLoad) setIsInitialLoad(false);
        });
    }, 500); // Longer 500ms debounce
    
    return () => clearTimeout(timeoutId);
  } else if (!isUserLoading && !userId) {
    console.error("No userId available after session loaded");
  }
}, [fetchUser, refreshTrigger, isUserLoading, userId, loading, lastRefreshTime, session, isInitialLoad]);

  const handleDiscard = async () => {
    const userData = await fetchUser();
    if (userData) {
      reset(userData);
    }
    toast("Changes discarded", { icon: "🔄" });
  };

  // Upload hooks configuration
  const uploadHooks = {
    driver_photo: useUploadFileHook("driver_photo"),
    insurance_photo: useUploadFileHook("insurance_photo"),
    vehicle_photo: useUploadFileHook("vehicle_photo"),
    license_photo: useUploadFileHook("license_photo"),
    general_files: useUploadFileHook("general_files"),
  } as const;

  // Loading states
  if (isUserLoading || !userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-semibold">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (loading && !isDirty && isInitialLoad) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="bg-muted/20 min-h-screen pb-10 pt-32">
      <FormProvider {...methods}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header - simplified for user profile */}
          <UserProfileHeader 
            handleDiscard={handleDiscard} 
            handleSubmit={handleSubmit} 
            onSubmit={onSubmit}
            hasUnsavedChanges={hasUnsavedChanges}
            loading={loading}
          />

          {/* User Header Section */}
          <UserHeader watchedValues={watchedValues} />

          {/* Main Content */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Information */}
            <div className="col-span-2 space-y-6">
              <UserProfileTabs
                userId={userId}
                activeTab={activeTab}
                setActiveTab={memoizedSetActivetab}
                watchedValues={watchedValues}
                control={control}
                refreshTrigger={refreshTrigger}
                isUserProfile={true} // New prop to disable admin-specific features
              />
            </div>

            {/* Right Column - Files & Documents only, no status management */}
            <div className="space-y-6">
              <UserDocumentsCard 
                uploadHooks={uploadHooks}
                userType={watchedValues.type ?? "client"}
                setRefreshTrigger={setRefreshTrigger}
                isUserProfile={true} // New prop to disable admin-specific features
              />
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}

// Simplified header for user profile
interface UserProfileHeaderProps {
  handleDiscard: () => void;
  handleSubmit: any;
  onSubmit: (data: UserFormValues) => Promise<void>;
  hasUnsavedChanges: boolean;
  loading: boolean;
}

const UserProfileHeader = ({ 
  handleDiscard,
  handleSubmit,
  onSubmit,
  hasUnsavedChanges,
  loading
}: UserProfileHeaderProps) => (
  <div className="bg-white">
    <div className="border-b">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="default"
              onClick={handleDiscard}
              disabled={!hasUnsavedChanges || loading}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Discard
            </Button>
            <Button
              size="default"
              onClick={handleSubmit(onSubmit)}
              disabled={!hasUnsavedChanges || loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Loading skeleton component
const ProfileSkeleton = () => (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" disabled className="h-9 w-9">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
  
        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );