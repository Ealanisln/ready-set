// src/app/(backend)/admin/users/[id]/page.tsx

"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import PageHeader from "@/components/Header/PageHeader";
import ProfileCard from "@/components/Dashboard/ProfileCard";
import AddressCard from "@/components/Dashboard/AddressCard";
import VendorClientDetailsCard from "@/components/Dashboard/VendorClientDetailsCard";
import UserStatusCard from "@/components/Dashboard/UserStatusCard";
import toast from "react-hot-toast";
import { UnsavedChangesAlert } from "@/components/Dashboard/UnsavedChangesAlert";
import UserFilesDisplay from "@/components/User/user-files-display";
import { useUploadFile } from "@/hooks/use-upload-file";
import UserProfileUploads from "@/components/Uploader/user-profile-uploads";
import { FileWithPath } from "react-dropzone";
import { useUser } from "@/contexts/UserContext";

interface User {
  id: string;
  name?: string | null;
  contact_name?: string | null;
  email: string | null;
  contact_number: string | null;
  type: "driver" | "vendor" | "client" | "helpdesk" | "admin" | "super_admin";
  company_name?: string | null;
  website?: string | null;
  street1?: string | null;
  street2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  location_number?: string | null;
  parking_loading?: string | null;
  countiesServed?: string[];
  counties?: string | null;
  timeNeeded?: string[];
  time_needed?: string | null;
  cateringBrokerage?: string[];
  catering_brokerage?: string | null;
  frequency?: string | null;
  provisions?: string[];
  provide?: string | null;
  head_count?: string | null;
  status?: "active" | "pending" | "deleted";
}

interface UserFormValues extends User {
  displayName: string;
}

export default function EditUser(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();
  
  // Use the shared user context
  const { session, userRole, isLoading: isUserLoading } = useUser();

  const userId = params.id;

  // Helper function to convert comma-separated string to array of values
  const stringToValueArray = useCallback((str: string | undefined | null): string[] => {
    if (!str) return [];
    return str.split(',').map((item: string) => item.trim());
  }, []);

  // Form setup with default values ensuring no null values
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    defaultValues: {
      id: "",
      displayName: "",
      email: "",
      contact_number: "",
      type: "client" as const,
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      company_name: "",
      website: "",
      location_number: "",
      parking_loading: "",
      countiesServed: [] as string[],
      counties: "",
      timeNeeded: [] as string[],
      time_needed: "",
      cateringBrokerage: [] as string[],
      catering_brokerage: "",
      frequency: "",
      provisions: [] as string[],
      provide: "",
      head_count: "",
      status: "pending" as const,
    },
  });

  // Important: Watch all form values
  const watchedValues = watch();

  // Fetch user data
  const fetchUser = useCallback(async () => {
    if (!userId || isUserLoading) return;

    try {
      setLoading(true);
      // Add a timestamp and request id to prevent caching
      const cacheKey = Date.now().toString() + Math.random().toString(36).substring(7);
      const response = await fetch(`/api/users/${userId}?t=${cacheKey}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "x-request-source": "EditUserComponent",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      console.log("Raw API data:", data);

      // Apply safer null handling by setting each field individually
      // This is more reliable than using reset() with a composite object
      setValue("id", data.id || "");
      setValue("displayName", data.displayName || data.contact_name || data.name || "");
      setValue("name", data.name || "");
      setValue("email", data.email || "");
      setValue("contact_number", data.contact_number || "");
      setValue("company_name", data.company_name || "");
      setValue("contact_name", data.contact_name || "");
      setValue("website", data.website || "");
      setValue("street1", data.street1 || "");
      setValue("street2", data.street2 || "");
      setValue("city", data.city || "");
      setValue("state", data.state || "");
      setValue("zip", data.zip || "");
      setValue("location_number", data.location_number || "");
      setValue("parking_loading", data.parking_loading || "");
      setValue("type", data.type);
      setValue("status", data.status || "pending");
      setValue("frequency", data.frequency || "");
      setValue("head_count", data.head_count || "");

      // Transform string values to arrays
      setValue("countiesServed", data.countiesServed || stringToValueArray(data.counties));
      setValue("timeNeeded", data.timeNeeded || stringToValueArray(data.time_needed));
      setValue("cateringBrokerage", data.cateringBrokerage || stringToValueArray(data.catering_brokerage));
      setValue("provisions", data.provisions || stringToValueArray(data.provide));

      // Keep the original string values for reference
      setValue("counties", data.counties || "");
      setValue("time_needed", data.time_needed || "");
      setValue("catering_brokerage", data.catering_brokerage || "");
      setValue("provide", data.provide || "");

      // Debug log to see if values are being set
      console.log("Form values set", {
        name: data.name,
        contact_name: data.contact_name,
        email: data.email,
        type: data.type
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }, [userId, setValue, stringToValueArray, isUserLoading]);

  // Initial fetch and refresh handling - wait for user context to initialize
  useEffect(() => {
    if (!isUserLoading) {
      fetchUser();
    }
  }, [fetchUser, refreshTrigger, isUserLoading]);

  // Watch for form changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const handleUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    try {
      // Create a clean submission object
      const { displayName, countiesServed, timeNeeded, cateringBrokerage, provisions, ...baseSubmitData } = data;
      const submitData: any = { ...baseSubmitData };

      // Transform arrays back to comma-separated strings
      if (countiesServed && Array.isArray(countiesServed)) {
        submitData.counties = countiesServed.join(',');
      }
      
      if (timeNeeded && Array.isArray(timeNeeded)) {
        submitData.time_needed = timeNeeded.join(',');
      }
      
      if (cateringBrokerage && Array.isArray(cateringBrokerage)) {
        submitData.catering_brokerage = cateringBrokerage.join(',');
      }
      
      if (provisions && Array.isArray(provisions)) {
        submitData.provide = provisions.join(',');
      }

      // Set the display name based on user type
      if (data.type === "driver" || data.type === "helpdesk") {
        submitData.name = displayName;
      } else if (data.type === "vendor" || data.type === "client") {
        submitData.contact_name = displayName;
      }

      if (data.type === "client") {
        submitData.head_count = data.head_count;
      }

      console.log("Submitting data:", submitData);

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "x-request-source": "EditUserComponent-Submit",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      console.log("Updated user response:", updatedUser);

      // After successful update, refresh the form data
      fetchUser();
      toast.success("User saved successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to save user. Please try again.");
    }
  };

  const handleStatusChange = async (newStatus: User["status"]) => {
    if (isUpdatingStatus || !newStatus) return;

    setIsUpdatingStatus(true);

    try {
      const response = await fetch("/api/users/updateUserStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "x-request-source": "EditUserComponent-StatusChange",
        },
        body: JSON.stringify({
          userId: params.id,
          newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error(
              `Invalid request: ${data.error}${data.details ? ` - ${JSON.stringify(data.details)}` : ""}`,
            );
          case 404:
            throw new Error("User not found");
          default:
            throw new Error(data.error || "Failed to update user status");
        }
      }

      setValue("status", newStatus);
      toast.success(data.message || "User status updated successfully");
      setRefreshTrigger((prev) => prev + 1);
      router.refresh();
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user status",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    try {
      const response = await fetch(`/api/users/${params.id}/change-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "x-request-source": "EditUserComponent-RoleChange",
        },
        body: JSON.stringify({ newRole }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update user role: ${response.status} ${response.statusText}`,
        );
      }

      await response.json();
      setValue("type", newRole as User["type"]);
      toast.success("User role updated successfully!");
      setRefreshTrigger((prev) => prev + 1);
      router.refresh();
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const handleDiscard = () => {
    fetchUser();
    toast("Changes discarded", { icon: "🔄" });
    router.push("/admin/users");
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      handleDiscardWithConfirmation();
    } else {
      router.push("/admin/users");
    }
  };

  const handleDiscardWithConfirmation = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?",
      );
      if (confirmed) {
        handleDiscard();
      }
    } else {
      handleDiscard();
    }
  };
  
  const useUploadFileHook = (category: string) => {
    // For debugging - log params to ensure we have the correct values
    console.log("useUploadFileHook called with:", { category, userId: params?.id });
    
    const uploadHook = useUploadFile({
      defaultUploadedFiles: [],
      userId: session?.user?.id ?? "", // Use actual authenticated user ID
      maxFileCount: 1,
      maxFileSize: 3 * 1024 * 1024,
      allowedFileTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ],
      category: category,
      entityType: "user",
      entityId: params.id, // The ID of the user being edited
    });
  
    const onUpload = async (files: FileWithPath[]): Promise<void> => {
      console.log("Starting upload for user:", params.id, "with category:", category);
      try {
        await uploadHook.onUpload(files);
        console.log("Upload completed successfully");
        handleUploadSuccess();
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("File upload failed. Please try again.");
      }
    };
  
    return {
      onUpload,
      progresses: uploadHook.progresses,
      isUploading: uploadHook.isUploading,
      category,
      entityType: "user",
      entityId: params.id,
    };
  };
  
  // Upload hooks
  const uploadHooks = {
    driver_photo: useUploadFileHook("driver_photo"),
    insurance_photo: useUploadFileHook("insurance_photo"),
    vehicle_photo: useUploadFileHook("vehicle_photo"),
    license_photo: useUploadFileHook("license_photo"),
    general_files: useUploadFileHook("general_files"),
  } as const;

  const breadcrumbs = [
    { href: "/admin/", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
  ];

  const currentPageTitle = loading
    ? "Loading..."
    : `Editing ${watchedValues.displayName || "User"}`;

  // Check if user is still loading
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Initializing auth...</p>
      </div>
    );
  }

  // Check if user is authenticated
  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">Please sign in to access this page</p>
        <Button className="ml-4" onClick={() => router.push('/login')}>
          Sign In
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <PageHeader
          breadcrumbs={breadcrumbs}
          loading={loading}
          currentPageTitle={currentPageTitle}
        />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleBack}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Type of account
                </h1>
                <Badge variant="outline" className="ml-auto sm:ml-0">
                  {watchedValues.type}
                </Badge>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <UnsavedChangesAlert
                    onConfirm={handleDiscardWithConfirmation}
                    triggerButton={
                      <Button variant="outline" size="sm">
                        Discard
                      </Button>
                    }
                  />
                  <Button size="sm" type="submit">
                    Save User
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <ProfileCard control={control} errors={errors} />
                  <AddressCard control={control} errors={errors} />
                  {(watchedValues.type === "vendor" ||
                    watchedValues.type === "client") && (
                    <VendorClientDetailsCard
                      control={control}
                      errors={errors}
                      userType={watchedValues.type}
                      watchedValues={watchedValues}
                    />
                  )}
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Uploaded Files</CardTitle>
                      <CardDescription>
                        View your documents here
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="py-2">
                        {userId ? (
                          <UserFilesDisplay
                            userId={userId}
                            refreshTrigger={refreshTrigger}
                          />
                        ) : (
                          <p>Loading user information...</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <UserStatusCard
                    user={{
                      id: params.id,
                      status: watchedValues.status,
                      type: watchedValues.type,
                    }}
                    onStatusChange={handleStatusChange}
                    onRoleChange={handleRoleChange}
                    currentUserRole={userRole || "client"}
                  />
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>User Docs</CardTitle>
                      <CardDescription>Add your documents here</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UserProfileUploads
                        uploadHooks={uploadHooks}
                        userType={watchedValues.type}
                        onUploadSuccess={() =>
                          setRefreshTrigger((prev) => prev + 1)
                        }
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Archive User</CardTitle>
                      <CardDescription>
                        Lipsum dolor sit amet, consectetur adipiscing elit.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div></div>
                      <Button size="sm" variant="secondary">
                        Archive User
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:hidden">
                <UnsavedChangesAlert
                  onConfirm={handleDiscardWithConfirmation}
                  triggerButton={
                    <Button variant="outline" size="sm">
                      Discard
                    </Button>
                  }
                />
                <Button size="sm" type="submit">
                  Save User
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}