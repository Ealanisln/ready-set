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
  const userId = propUserId || session?.user?.id || "";

  console.log("User ID from props or session:", userId);

  // Custom hooks for user data and form management
  const { 
    loading, 
    fetchUser, 
    handleUploadSuccess,
    useUploadFileHook
  } = useUserData(userId || "", refreshTrigger, setRefreshTrigger);

  // Destructure methods object and custom properties from the updated hook
  const {
    methods, // The full methods object from useForm
    watchedValues,
    hasUnsavedChanges,
    onSubmit
  } = useUserForm(userId || "", fetchUser);

  // Destructure specific methods needed from the 'methods' object
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
  if (isUserLoading && !session) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <div className="flex items-center space-x-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
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
    <div className="w-full">
      {/* Pass the complete methods object from the hook */}
      <FormProvider {...methods}> 
        <div className="w-full">
          {/* Header - simplified for user profile */}
          <UserProfileHeader 
            handleDiscard={handleDiscard} 
            handleSubmit={handleSubmit} 
            onSubmit={onSubmit}
            hasUnsavedChanges={hasUnsavedChanges}
            loading={loading}
          />

          {/* Wrap UserHeader and main content grid */}
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-8"> 
            {/* User Header Section - remove className */}
            <UserHeader watchedValues={watchedValues} />

            {/* Main Content */}
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              {/* Left Column - Main Information */}
              <div className="col-span-2 space-y-8">
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
              <div>
                <UserDocumentsCard 
                  uploadHooks={uploadHooks}
                  userType={watchedValues.type ?? "client"}
                  setRefreshTrigger={setRefreshTrigger}
                  isUserProfile={true}
                />
              </div>
            </div>
          </div> {/* Close the wrapper div */}
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
  loading,
}: UserProfileHeaderProps) => (
  <div className="sticky top-0 z-40 border-b bg-white dark:bg-gray-800 shadow-sm">
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">My Profile</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges || loading}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Discard
          </Button>
          <Button
            size="default"
            onClick={handleSubmit(onSubmit)}
            disabled={!hasUnsavedChanges || loading}
            className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton for loading state
function ProfileSkeleton() {
  return (
    <div className="w-full">
      <div className="sticky top-0 z-40 border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <Skeleton className="h-8 w-36" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="col-span-2 space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
            
            <div>
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}