"use client";

import { useState, useEffect, useCallback, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { UserType } from "@/components/Auth/SignUp/FormSchemas";

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  email: string;
  contact_number: string;
  type: "driver" | "vendor" | "client" | "helpdesk" | "admin" | "super_admin";
  company_name?: string;
  website?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  parking_loading?: string;
  countiesServed?: string[];
  timeNeeded?: string[];
  cateringBrokerage?: string[];
  frequency?: string;
  provisions?: string[];
  head_count?: string;
  status?: "active" | "pending" | "deleted";
}

interface UserFormValues extends User {
  displayName: string;
  head_count?: string;
}

export default function EditUser(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const userId = params.id;

  // Form setup with default values
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    defaultValues: {
      countiesServed: [],
      timeNeeded: [],
      cateringBrokerage: [],
      frequency: "",
      provisions: [],
      displayName: "",
      head_count: "",
    },
  });

  // Important: Watch all form values
  const watchedValues = watch();

  // Memoize the default form values
  const defaultFormValues = useMemo(
    () => ({
      id: "",
      displayName: "",
      email: "",
      contact_number: "",
      type: "client" as const,
      street1: "",
      city: "",
      state: "",
      zip: "",
      company_name: "",
      website: "",
      street2: "",
      parking_loading: "",
      countiesServed: [] as string[],
      timeNeeded: [] as string[],
      cateringBrokerage: [] as string[],
      frequency: "",
      provisions: [] as string[],
      head_count: "",
      status: "pending" as const,
    }),
    [],
  );

  // Fetch user data
  const fetchUser = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();

      const formData = {
        ...defaultFormValues,
        ...data,
        displayName: data.displayName || data.contact_name || data.name || "",
        provisions: data.provide ? data.provide.split(", ") : [],
        // Ensure other fields aren't null
        company_name: data.company_name || "",
        website: data.website || "",
        street2: data.street2 || "",
        parking_loading: data.parking_loading || "",
      };

      reset(formData);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }, [userId, reset, defaultFormValues]);

  // Initial fetch and refresh handling
  useEffect(() => {
    fetchUser();
  }, [fetchUser, refreshTrigger]);

  // Watch for form changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const handleUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    try {
      // Use destructuring to properly remove displayName
      const { displayName, ...finalSubmitData } = data;

      // Type-safe submission data
      const submitData: User = finalSubmitData;

      if (data.type === "driver" || data.type === "helpdesk") {
        submitData.name = displayName;
        delete submitData.contact_name;
        delete submitData.company_name;
      } else if (data.type === "vendor" || data.type === "client") {
        submitData.contact_name = displayName;
        delete submitData.name;
      }

      if (data.type === "client") {
        submitData.head_count = data.head_count;
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();

      const formData = {
        ...defaultFormValues,
        ...updatedUser,
        displayName: updatedUser.contact_name || updatedUser.name || "",
        provisions: updatedUser.provide ? updatedUser.provide.split(", ") : [],
      };

      reset(formData);
      setHasUnsavedChanges(false);
      toast.success("User saved successfully!");
      setRefreshTrigger((prev) => prev + 1);
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
          Pragma: "no-cache",
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
          Pragma: "no-cache",
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
    const {
      onUpload: originalOnUpload,
      progresses,
      isUploading,
    } = useUploadFile("fileUploader", {
      defaultUploadedFiles: [],
      userId: params?.id ?? "",
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
      entityId: params.id,
    });

    const onUpload = async (files: FileWithPath[]): Promise<void> => {
      await originalOnUpload(files);
      handleUploadSuccess();
    };

    return {
      onUpload,
      progresses,
      isUploading,
      category,
      entityType: "user",
      entityId: params.id,
    };
  };

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
                    currentUserRole={
                      (session?.user?.type as UserType) || "client"
                    }
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
