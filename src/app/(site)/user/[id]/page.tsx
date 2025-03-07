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
import ProfileCard from "@/components/Dashboard/ProfileCard";
import AddressCard from "@/components/Dashboard/AddressCard";
import VendorClientDetailsCard from "@/components/Dashboard/VendorClientDetailsCard";
import toast from "react-hot-toast";
import { UnsavedChangesAlert } from "@/components/Dashboard/UnsavedChangesAlert";
import { PasswordChange } from "@/components/Dashboard/AdminView/PasswordChange";
import { createClient } from "@/utils/supabase/client";
import UserFilesDisplay from "@/components/User/user-files-display";
import UserProfileUploads from "@/components/Uploader/user-profile-uploads";
import { FileWithPath } from "react-dropzone";
import { useUploadFile } from "@/hooks/use-upload-file";
import { COUNTIES, TIME_NEEDED, CATERING_BROKERAGE, PROVISIONS } from "@/components/Auth/SignUp/ui/FormData";

// Updated to match the db schema fields
// Base database user interface
interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  type: "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";
  company_name?: string;
  contact_name?: string;
  contact_number?: string;
  website?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  location_number?: string;
  parking_loading?: string;
  counties?: string;
  time_needed?: string;
  catering_brokerage?: string;
  frequency?: string;
  provide?: string;
  head_count?: string;
  status: "active" | "pending" | "deleted";
  side_notes?: string;
  isTemporaryPassword?: boolean;
}

  // Form-specific option type
interface OptionType {
  label: string;
  value: string;
}

// Extended interface to include transformed array fields for form usage
interface UserFormValues {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  type: "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";
  company_name?: string;
  contact_name?: string;
  contact_number?: string;
  website?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  location_number?: string;
  parking_loading?: string;
  counties?: string;
  time_needed?: string;
  catering_brokerage?: string;
  frequency?: string;
  provide?: string;
  head_count?: string;
  status: "active" | "pending" | "deleted";
  side_notes?: string;
  isTemporaryPassword?: boolean;
  
  // Form-specific fields
  displayName: string;
  countiesServed?: string[];
  timeNeeded?: string[];
  cateringBrokerage?: string[];
  provisions?: string[];
}

export default function EditUser(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Get the current user session using Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }
      setUser(user);
    };

    getUser();
  }, [router, supabase]);


  // Update the useUploadFileHook to handle the proper return type
  const useUploadFileHook = (category: string) => {
    const {
      onUpload: originalOnUpload,
      progresses,
      isUploading,
    } = useUploadFile("fileUploader", {
      defaultUploadedFiles: [],
      userId: user?.id ?? "",
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

    // Wrap the onUpload function to return void instead of UploadThingFile[]
    const onUpload = async (files: FileWithPath[]): Promise<void> => {
      await originalOnUpload(files);
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

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    defaultValues: {
      type: "vendor",
      status: "pending",
      displayName: "",
      countiesServed: [],
      timeNeeded: [],
      cateringBrokerage: [],
      provisions: []
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  // Helper function to convert comma-separated string to array of values
  const stringToValueArray = (str: string | undefined): string[] => {
    if (!str) return [];
    return str.split(',').map((item: string) => item.trim());
  };
  
  // Helper function to convert comma-separated string to array of option objects
  const stringToOptionsArray = (str: string | undefined, optionsArray: readonly { label: string; value: string }[]): OptionType[] => {
    if (!str) return [];
    
    const values = str.split(',').map((item: string) => item.trim());
    return values.map((value: string) => {
      // Try to find the matching option in the predefined array
      const matchingOption = optionsArray.find((option: OptionType) => option.value === value);
      // Return the matching option if found, otherwise create a new option
      return matchingOption || { label: value, value: value };
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Make sure we have the authenticated user before fetching user details
        if (!user) return;

        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Unauthorized. Please login as an admin.");
            return;
          }
          throw new Error("Failed to fetch user");
        }
        const data: User = await response.json();

        // Set form values with safer null handling to match schema
        setValue("displayName", data.name || data.contact_name || "");
        setValue("name", data.name || "");
        setValue("email", data.email || "");
        setValue("company_name", data.company_name || "");
        setValue("contact_name", data.contact_name || "");
        setValue("contact_number", data.contact_number || "");
        setValue("website", data.website || "");
        setValue("street1", data.street1 || "");
        setValue("street2", data.street2 || "");
        setValue("city", data.city || "");
        setValue("state", data.state || "");
        setValue("zip", data.zip || "");
        setValue("location_number", data.location_number || "");
        setValue("parking_loading", data.parking_loading || "");
        setValue("type", data.type);
        setValue("status", data.status);
        setValue("frequency", data.frequency || "");
        setValue("head_count", data.head_count || "");
        setValue("side_notes", data.side_notes || "");
        setValue("isTemporaryPassword", data.isTemporaryPassword || false);
        
        // Transform string values to arrays of simple values (not objects)
        // This matches what CheckboxGroup expects for the checked state
        setValue("countiesServed", stringToValueArray(data.counties));
        setValue("timeNeeded", stringToValueArray(data.time_needed));
        setValue("cateringBrokerage", stringToValueArray(data.catering_brokerage));
        setValue("provisions", stringToValueArray(data.provide));
        
        // Keep the original string values for reference or backup
        setValue("counties", data.counties || "");
        setValue("time_needed", data.time_needed || "");
        setValue("catering_brokerage", data.catering_brokerage || "");
        setValue("provide", data.provide || "");
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id, setValue, user]);

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    try {
      // Create a clean User object for submission
      const submitData: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        emailVerified: data.emailVerified,
        image: data.image,
        type: data.type,
        company_name: data.company_name,
        contact_name: data.contact_name,
        contact_number: data.contact_number,
        website: data.website,
        street1: data.street1,
        street2: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        location_number: data.location_number,
        parking_loading: data.parking_loading,
        frequency: data.frequency,
        head_count: data.head_count,
        status: data.status,
        side_notes: data.side_notes,
        isTemporaryPassword: data.isTemporaryPassword
      };
      
      // Transform arrays back to comma-separated strings for API
      if (data.countiesServed && Array.isArray(data.countiesServed)) {
        submitData.counties = data.countiesServed.join(',');
      } else {
        submitData.counties = data.counties;
      }
      
      if (data.timeNeeded && Array.isArray(data.timeNeeded)) {
        submitData.time_needed = data.timeNeeded.join(',');
      } else {
        submitData.time_needed = data.time_needed;
      }
      
      if (data.cateringBrokerage && Array.isArray(data.cateringBrokerage)) {
        submitData.catering_brokerage = data.cateringBrokerage.join(',');
      } else {
        submitData.catering_brokerage = data.catering_brokerage;
      }
      
      if (data.provisions && Array.isArray(data.provisions)) {
        submitData.provide = data.provisions.join(',');
      } else {
        submitData.provide = data.provide;
      }

      // Ensure we're matching the expected fields in the schema
      // This is important for the PUT API call to work correctly
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
      
      // Update the form with the returned data from server to keep it in sync
      const formattedUser = {
        ...updatedUser,
        countiesServed: updatedUser.counties ? updatedUser.counties.split(',').map((s: string) => s.trim()) : [],
        timeNeeded: updatedUser.time_needed ? updatedUser.time_needed.split(',').map((s: string) => s.trim()) : [],
        cateringBrokerage: updatedUser.catering_brokerage ? updatedUser.catering_brokerage.split(',').map((s: string) => s.trim()) : [],
        provisions: updatedUser.provide ? updatedUser.provide.split(',').map((s: string) => s.trim()) : [],
        displayName: updatedUser.name || updatedUser.contact_name || ""
      };
      
      reset(formattedUser);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to save user. Please try again.");
    }
  };

  const handleBack = () => {
    reset();
    setHasUnsavedChanges(false);
    toast("Changes discarded", { icon: "🔄" });
    router.push("/");
  };

  const handleDiscard = () => {
    reset();
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
                    type="button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Button>
                )}
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Edit User
                </h1>
                <Badge variant="outline" className="ml-auto sm:ml-0">
                  {watchedValues.type}
                </Badge>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  {hasUnsavedChanges ? (
                    <UnsavedChangesAlert
                      onConfirm={handleDiscard}
                      triggerButton={
                        <Button variant="outline" size="sm" type="button">
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
                  <Button size="sm" type="submit">Save User</Button>
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
                        View and manage your documents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="py-2">
                        {user ? (
                          <UserFilesDisplay
                            userId={user.id}
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
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Upload Files</CardTitle>
                      <CardDescription>Add your documents here</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UserProfileUploads
                        uploadHooks={uploadHooks}
                        userType={watchedValues.type}
                        onUploadSuccess={handleUploadSuccess}
                      />
                    </CardContent>
                  </Card>
                  <PasswordChange />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:hidden">
                <Button variant="outline" size="sm" onClick={handleDiscard} type="button">
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