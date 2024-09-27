// src/app/(site)/user/[id]/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload } from "lucide-react";
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
import ProfileCard from "@/components/Dashboard/ProfileCard";
import AddressCard from "@/components/Dashboard/AddressCard";
import VendorClientDetailsCard from "@/components/Dashboard/VendorClientDetailsCard";
import toast from "react-hot-toast";
import { UnsavedChangesAlert } from "@/components/Dashboard/UnsavedChangesAlert";
import { PasswordChange } from "@/components/Dashboard/AdminView/PasswordChange";
import { useSession } from "next-auth/react";
import { useUploadFile } from "@/hooks/use-upload-file";
import UserFilesDisplay from "@/components/User/user-files-display";
import UserProfileUploads from "@/components/Uploader/user-profile-uploads";

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  email: string;
  contact_number: string;
  type: "driver" | "vendor" | "client" | "helpdesk";
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

export default function EditUser({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const useUploadFileHook = (category: string) => {
    console.log("Creating upload hook for category:", category);
    const { onUpload, progresses, isUploading } = useUploadFile(
      "fileUploader",
      {
        defaultUploadedFiles: [],
        userId: userId ?? "",
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
      },
    );
    return { 
      onUpload: (files: File[]) => {
        console.log("Uploading files for category:", category);
        return onUpload(files);
      }, 
      progresses, 
      isUploading, 
      category,
      entityType: "user",
      entityId: params.id
    };
  };

  const uploadHooks = {
    driver_photo: useUploadFileHook("driver_photo"),
    insurance_photo: useUploadFileHook("insurance_photo"),
    vehicle_photo: useUploadFileHook("vehicle_photo"),
    license_photo: useUploadFileHook("license_photo"),
  };

  const uploadFields = [
    { name: "driver_photo", label: "Driver Photo" },
    { name: "insurance_photo", label: "Insurance Photo" },
    { name: "vehicle_photo", label: "Vehicle Photo" },
    { name: "license_photo", label: "Driver License Photo" },
  ];

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

  const watchedValues = watch();

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Unauthorized. Please login as an admin.");
            return;
          }
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();

        // Set form values
        setValue(
          "displayName",
          data.displayName || data.contact_name || data.name || "",
        );
        setValue("company_name", data.company_name || "");
        setValue("contact_number", data.contact_number || "");
        setValue("email", data.email || "");
        setValue("website", data.website || "");
        setValue("street1", data.street1 || "");
        setValue("street2", data.street2 || "");
        setValue("city", data.city || "");
        setValue("state", data.state || "");
        setValue("zip", data.zip || "");
        setValue("parking_loading", data.parking_loading || "");
        setValue("type", data.type || "");
        setValue("status", data.status || "pending");

        // Only set timeNeeded and countiesServed if the user is a vendor or client
        if (data.type === "vendor" || data.type === "client") {
          setValue("timeNeeded", data.timeNeeded || []);
          setValue("countiesServed", data.countiesServed || []);
        }

        // Vendor specific fields
        if (data.type === "vendor") {
          setValue("cateringBrokerage", data.cateringBrokerage || []);
          setValue("frequency", data.frequency || "");
          setValue("provisions", data.provide ? data.provide.split(", ") : []);
        }

        if (data.type === "client") {
          setValue("head_count", data.head_count || "");
          setValue("frequency", data.frequency || "");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id, setValue]);

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    try {
      const submitData: User = { ...data };

      delete (submitData as any).displayName;

      if (data.type === "driver" || data.type === "helpdesk") {
        submitData.name = data.displayName;
        delete submitData.contact_name;
        delete submitData.company_name;
      } else if (data.type === "vendor" || data.type === "client") {
        submitData.contact_name = data.displayName;
        delete submitData.name;
      }

      if (data.type === "client") {
        submitData.head_count = data.head_count;
      }

      const response = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      const updatedUser = await response.json();

      toast.success("User saved successfully!");
      reset(updatedUser);

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to save user. Please try again.");
    }
  };

  const currentPageTitle = loading
    ? "Loading..."
    : `Editing ${watchedValues.displayName || "User"}`;

  const handleBack = () => {
    reset(); // Reset the form
    setHasUnsavedChanges(false);
    toast("Changes discarded", { icon: "🔄" });
    router.push("/");
  };

  const handleDiscard = () => {
    reset(); // Reset the form
    setHasUnsavedChanges(false);
    toast("Changes discarded", { icon: "🔄" });
    router.push("/");
  };

  const handleUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col pt-24">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                {hasUnsavedChanges ? (
                  <UnsavedChangesAlert
                    onConfirm={handleBack}
                    triggerButton={
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                      </Button>
                    }
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleBack}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Button>
                )}
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Edit your user info
                </h1>
                <Badge variant="outline" className="ml-auto sm:ml-0">
                  {watchedValues.type}
                </Badge>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  {hasUnsavedChanges ? (
                    <UnsavedChangesAlert
                      onConfirm={handleDiscard}
                      triggerButton={
                        <Button variant="outline" size="sm">
                          Discard
                        </Button>
                      }
                    />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDiscard}
                      type="button"
                    >
                      Discard
                    </Button>
                  )}
                  <Button size="sm">Save User</Button>
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
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card
                    className="overflow-hidden"
                    x-chunk="dashboard-07-chunk-4"
                  >
                    <CardHeader>
                      <CardTitle>User Docs</CardTitle>
                      <CardDescription>Add your documents here</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UserProfileUploads uploadHooks={uploadHooks} />

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
                  <PasswordChange />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:hidden">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
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
