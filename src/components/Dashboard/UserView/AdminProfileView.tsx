// src/components/Dashboard/UserView/ModernUserProfile.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Save, XCircle, ChevronLeft, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfileTabs from "./UserProfileTabs";
import UserHeader from "./UserHeader";
import UserStatusCard from "./Sidebar/UserStatusCard";
import UserDocumentsCard from "./Sidebar/UserDocumentsCard";
import UserArchiveCard from "./Sidebar/UserArchiveCard";
import { useUserForm } from "./hooks/useUserForm";
import { useUserData } from "./hooks/useUserData";
import { UserFormValues } from "./types";

interface ModernUserProfileProps {
  userId: string;
  isUserProfile?: boolean;
}

export default function ModernUserProfile({ userId, isUserProfile = false }: ModernUserProfileProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();

  // Auth context
  const { session, isLoading: isUserLoading } = useUser();

  // Initialize user data hook first
  const { 
    loading, 
    isUpdatingStatus, 
    fetchUser, 
    handleStatusChange: baseHandleStatusChange, 
    handleRoleChange,
    handleUploadSuccess,
    useUploadFileHook
  } = useUserData(userId, refreshTrigger, setRefreshTrigger);

  // Then initialize form with the fetchUser function
  const {
    control,
    handleSubmit,
    watchedValues,
    hasUnsavedChanges,
    isDirty,
    reset,
    onSubmit,
    setValue
  } = useUserForm(userId, fetchUser);

  // Create a wrapped handleStatusChange that uses both the base function and setValue
  const handleStatusChange = async (newStatus: NonNullable<UserFormValues["status"]>) => {
    await baseHandleStatusChange(newStatus);
    setValue("status", newStatus, { shouldValidate: true, shouldDirty: true });
  };

  // Effect to fetch data when component mounts or dependencies change
  useEffect(() => {
    if (!isUserLoading) {
      fetchUser();
    }
  }, [fetchUser, refreshTrigger, isUserLoading]);

  const handleDiscard = () => {
    fetchUser();
    toast("Changes discarded", { icon: "🔄" });
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?"
      );
      if (confirmed) {
        router.push("/admin/users");
      }
    } else {
      router.push("/admin/users");
    }
  };

  // Upload hooks configuration
  const uploadHooks = {
    driver_photo: useUploadFileHook("driver_photo"),
    insurance_photo: useUploadFileHook("insurance_photo"),
    vehicle_photo: useUploadFileHook("vehicle_photo"),
    license_photo: useUploadFileHook("license_photo"),
    general_files: useUploadFileHook("general_files"),
  };

  // Loading states
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-semibold">
            Initializing authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthenticationRequired router={router} />;
  }

  if (loading && !isDirty) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="bg-muted/20 min-h-screen pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header with breadcrumbs */}
        <HeaderNavigation 
          handleBack={handleBack} 
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
              setActiveTab={setActiveTab}
              watchedValues={watchedValues}
              control={control}
              refreshTrigger={refreshTrigger}
              isUserProfile={isUserProfile}
            />
          </div>

          {/* Right Column - Status & User Management */}
          <div className="space-y-6">
            <UserStatusCard 
              watchedValues={watchedValues}
              control={control}
              isUpdatingStatus={isUpdatingStatus}
              loading={loading}
              handleStatusChange={handleStatusChange}
              handleRoleChange={handleRoleChange}
            />

            <UserDocumentsCard 
              uploadHooks={uploadHooks}
              userType={watchedValues.type ?? "client"}
              setRefreshTrigger={setRefreshTrigger}
            />

            <UserArchiveCard />
          </div>
        </div>
      </div>
    </div>
  );
}

// Authentication required component
const AuthenticationRequired = ({ router }: { router: any }) => (
  <div className="bg-muted/40 flex h-screen flex-col items-center justify-center space-y-4 p-4">
    <AlertOctagon className="text-destructive h-16 w-16" />
    <h2 className="text-2xl font-bold">Authentication Required</h2>
    <p className="text-muted-foreground">
      Please sign in to access this page
    </p>
    <Button onClick={() => router.push("/login")} className="mt-4">
      Sign In
    </Button>
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

// Header navigation component
interface HeaderNavigationProps {
  handleBack: () => void;
  handleDiscard: () => void;
  handleSubmit: any;
  onSubmit: (data: UserFormValues) => Promise<void>;
  hasUnsavedChanges: boolean;
  loading: boolean;
}

const HeaderNavigation = ({ 
  handleBack,
  handleDiscard,
  handleSubmit,
  onSubmit,
  hasUnsavedChanges,
  loading
}: HeaderNavigationProps) => (
  <div className="sticky top-0 z-10 bg-white py-4 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground h-9 w-9"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-muted-foreground text-sm">
          <Link
            href="/admin"
            className="hover:text-foreground hover:underline"
          >
            Dashboard
          </Link>
          {" / "}
          <Link
            href="/admin/users"
            className="hover:text-foreground hover:underline"
          >
            Users
          </Link>
          {" / "}
          <span className="text-foreground">Edit User</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDiscard}
          disabled={!hasUnsavedChanges || loading}
          className="h-9"
        >
          <XCircle className="mr-1.5 h-4 w-4" />
          Discard
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit(onSubmit)}
          disabled={!hasUnsavedChanges || loading}
          className="h-9 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          <Save className="mr-1.5 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  </div>
);