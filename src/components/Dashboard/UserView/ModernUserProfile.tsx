import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { FileWithPath } from "react-dropzone";
import { useUser } from "@/contexts/UserContext";
import { useUploadFile } from "@/hooks/use-upload-file";

// Lucide Icons
import {
  ChevronLeft,
  Building,
  User as UserIcon,
  Phone,
  Mail,
  Globe,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Upload,
  Save,
  XCircle,
  Edit3,
  Archive,
  AlertOctagon,
} from "lucide-react";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom Components
import UserFilesDisplay from "@/components/User/user-files-display";
import UserProfileUploads from "@/components/Uploader/user-profile-uploads";

// Types
interface User {
  id: string;
  name?: string | null;
  contact_name?: string | null;
  email: string | null;
  contact_number: string | null;
  role:
    | "client"
    | "vendor"
    | "driver"
    | "helpdesk"
    | "admin"
    | "super_admin"
    | null;
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

// FIX 1: UserFormValues aligned with form field names ('type') and includes all form fields
interface UserFormValues extends Omit<User, "role"> {
  displayName: string;
  // Use 'type' to match the form field name used in Controller/useForm
  type:
    | "client"
    | "vendor"
    | "driver"
    | "helpdesk"
    | "admin"
    | "super_admin"
    | null;
  // Array versions used in the form's multi-select/checkbox groups
  countiesServed: string[];
  timeNeeded: string[];
  cateringBrokerage: string[];
  provisions: string[];
}

interface ModernUserProfileProps {
  userId: string;
}

// Configuration and constants
const USER_TYPE_COLORS: Record<
  Exclude<UserFormValues["type"], null>,
  string
> = {
  vendor: "bg-blue-100 text-blue-800 border-blue-200",
  client: "bg-emerald-100 text-emerald-800 border-emerald-200",
  driver: "bg-amber-100 text-amber-800 border-amber-200",
  helpdesk: "bg-purple-100 text-purple-800 border-purple-200",
  admin: "bg-indigo-100 text-indigo-800 border-indigo-200",
  super_admin: "bg-rose-100 text-rose-800 border-rose-200",
};

const USER_STATUS_COLORS: Record<
  NonNullable<UserFormValues["status"]>,
  string
> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  deleted: "bg-red-100 text-red-800 border-red-200",
};

const COUNTIES = [
  "Alameda",
  "Contra Costa",
  "Marin",
  "Napa",
  "San Francisco",
  "San Mateo",
  "Santa Clara",
  "Santa Cruz",
  "Solano",
  "Sonoma",
];

const TIME_NEEDED = ["Breakfast", "Lunch", "Dinner", "All Day"];

const CATERING_BROKERAGES = [
  "Foodee",
  "Grubhub",
  "Cater2me",
  "Platterz",
  "Ez Cater",
  "Cater Cow",
  "Zero Cater",
  "Direct Delivery",
  "Other",
];

const PROVISIONS = [
  "Utensils",
  "Napkins",
  "Place Settings",
  "Labels",
  "Serving Utensils",
];

const FREQUENCIES = [
  "1-5 per week",
  "6-15 per week",
  "16-25 per week",
  "over 25 per week",
];

export default function ModernUserProfile({ userId }: ModernUserProfileProps) {
  // State management
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();

  // Auth context
  const { session, userRole, isLoading: isUserLoading } = useUser();

  // Helper function to convert comma-separated string to array of values
  const stringToValueArray = useCallback(
    (str: string | undefined | null): string[] => {
      if (!str) return [];
      return str.split(",").map((item: string) => item.trim());
    },
    [],
  );

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
      id: "",
      displayName: "",
      email: "",
      contact_number: "",
      type: "client",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      company_name: "",
      website: "",
      location_number: "",
      parking_loading: "",
      countiesServed: [],
      counties: "",
      timeNeeded: [],
      time_needed: "",
      cateringBrokerage: [],
      catering_brokerage: "",
      frequency: "",
      provisions: [],
      provide: "",
      head_count: "",
      status: "pending",
      name: null,
      contact_name: null,
    },
  });

  // Watch form values
  const watchedValues = watch();

  // Fetch user data
  const fetchUser = useCallback(async () => {
    if (!userId || isUserLoading) return;

    try {
      setLoading(true);
      // Add a timestamp and request id to prevent caching
      const cacheKey =
        Date.now().toString() + Math.random().toString(36).substring(7);
      const response = await fetch(`/api/users/${userId}?t=${cacheKey}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          "x-request-source": "ModernUserProfile",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data: User = await response.json();

      // Use reset to update all form values and reset dirty state
      reset({
        id: data.id || "",
        // Determine displayName based on role from API
        displayName: data.contact_name || data.name || "",
        name: data.name || null,
        contact_name: data.contact_name || null,
        email: data.email || "",
        contact_number: data.contact_number || "",
        company_name: data.company_name || "",
        website: data.website || "",
        street1: data.street1 || "",
        street2: data.street2 || "",
        city: data.city || "",
        state: data.state || "",
        zip: data.zip || "",
        location_number: data.location_number || "",
        parking_loading: data.parking_loading || "",
        // Map API 'role' to form 'type'
        type: data.role,
        status: data.status || "pending",
        frequency: data.frequency || "",
        head_count: data.head_count || "",
        // Transform string values from API to arrays for the form
        countiesServed:
          data.countiesServed || stringToValueArray(data.counties),
        timeNeeded: data.timeNeeded || stringToValueArray(data.time_needed),
        cateringBrokerage:
          data.cateringBrokerage || stringToValueArray(data.catering_brokerage),
        provisions: data.provisions || stringToValueArray(data.provide),
        // Keep original string values from API if needed for reference/comparison
        counties: data.counties || "",
        time_needed: data.time_needed || "",
        catering_brokerage: data.catering_brokerage || "",
        provide: data.provide || "",
      });

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }, [userId, reset, stringToValueArray, isUserLoading]);

  // Initial fetch and refresh handling
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
    toast.success("File uploaded successfully");
  }, []);

  // FIX 2: Updated onSubmit to handle type/role mapping correctly
  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);

      // Destructure known form-specific fields and array fields
      const {
        displayName,
        countiesServed,
        timeNeeded,
        cateringBrokerage,
        provisions,
        type, // Extract type to map to role
        ...baseSubmitData
      } = data;

      // Start with base data
      const submitData: Partial<User> = {
        ...baseSubmitData,
        // Map form 'type' to API 'role'
        role: type,
        // Transform arrays back to comma-separated strings
        counties: countiesServed?.join(",") || "",
        time_needed: timeNeeded?.join(",") || "",
        catering_brokerage: cateringBrokerage?.join(",") || "",
        provide: provisions?.join(",") || "",
      };

      // Set name/contact_name based on the form's 'type' field
      if (
        type === "driver" ||
        type === "helpdesk" ||
        type === "admin" ||
        type === "super_admin"
      ) {
        submitData.name = displayName;
        submitData.contact_name = null; // Explicitly nullify the other
      } else if (type === "vendor" || type === "client") {
        submitData.contact_name = displayName;
        submitData.name = null; // Explicitly nullify the other
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "x-request-source": "ModernUserProfile-Submit",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        let errorMsg = "Failed to update user";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (_) {
          /* Ignore JSON parsing error */
        }
        throw new Error(errorMsg);
      }

      await response.json();
      fetchUser();
      toast.success("User saved successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        `Failed to save user: ${error instanceof Error ? error.message : "Please try again."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    newStatus: NonNullable<UserFormValues["status"]>,
  ) => {
    if (isUpdatingStatus || !newStatus) return;

    setIsUpdatingStatus(true);

    try {
      const response = await fetch("/api/users/updateUserStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user status");
      }

      // Use reset to update status and maintain form state consistency
      reset({ ...watchedValues, status: newStatus });
      toast.success(data.message || "User status updated successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user status",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRoleChange = async (newRoleValue: string) => {
    // Ensure newRoleValue is a valid role type before proceeding
    const newRole = newRoleValue as UserFormValues["type"];
    if (!newRole) {
      toast.error("Invalid role selected.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/users/${userId}/change-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRole }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to update user role";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      await response.json();
      // After changing role, re-fetch all user data as other fields
      // might change or become relevant/irrelevant
      fetchUser();
      toast.success("User role updated successfully!");
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error(
        `Failed to update role: ${error instanceof Error ? error.message : "Please try again."}`,
      );
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    fetchUser();
    toast("Changes discarded", { icon: "🔄" });
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?",
      );
      if (confirmed) {
        router.push("/admin/users");
      }
    } else {
      router.push("/admin/users");
    }
  };

  // File upload hooks configuration
  const useUploadFileHook = (category: string) => {
    const uploadHook = useUploadFile({
      defaultUploadedFiles: [],
      userId: session?.user?.id ?? "",
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
      entityId: userId,
    });

    const onUpload = async (files: FileWithPath[]): Promise<void> => {
      try {
        await uploadHook.onUpload(files);
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
      entityId: userId,
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

  // Conditional renders based on loading states
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
    return (
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
  }

  if (loading && !isDirty) {
    return (
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
  }

  return (
    <div className="bg-muted/20 min-h-screen pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header with breadcrumbs */}
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

        {/* User Header Section */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                {watchedValues.type === "vendor" ||
                watchedValues.type === "client" ? (
                  <Building className="h-6 w-6" />
                ) : (
                  <UserIcon className="h-6 w-6" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {watchedValues.displayName || "New User"}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  {/* FIX 3: Safely render Type Badge */}
                  <Badge
                    variant="outline"
                    className={`font-medium capitalize ${
                      watchedValues.type
                        ? USER_TYPE_COLORS[watchedValues.type]
                        : "border-gray-200 bg-gray-100 text-gray-800"
                    }`}
                  >
                    {watchedValues.type
                      ? watchedValues.type.replace("_", " ")
                      : "N/A"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`font-medium capitalize ${
                      watchedValues.status
                        ? USER_STATUS_COLORS[watchedValues.status]
                        : USER_STATUS_COLORS.pending
                    }`}
                  >
                    {watchedValues.status || "pending"}
                  </Badge>
                  {watchedValues.email && (
                    <span className="flex items-center text-slate-500">
                      <Mail className="mr-1 h-3.5 w-3.5" />
                      {watchedValues.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Information */}
          <div className="col-span-2 space-y-6">
            {/* Tabs for different sections */}
            <Tabs
              defaultValue="profile"
              value={activeTab}
              onValueChange={setActiveTab}
              className="rounded-xl bg-white shadow-sm"
            >
              <div className="border-b px-6 pt-4">
                <TabsList className="justify-start gap-2 rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="profile"
                    className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="address"
                    className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Address
                  </TabsTrigger>
                  {(watchedValues.type === "vendor" ||
                    watchedValues.type === "client") && (
                    <TabsTrigger
                      value="details"
                      className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      {watchedValues.type === "vendor"
                        ? "Vendor Details"
                        : "Client Details"}
                    </TabsTrigger>
                  )}
                  <TabsTrigger
                    value="files"
                    className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Files
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Profile Tab */}
              <TabsContent value="profile" className="m-0 p-6">
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      <Controller
                        name="company_name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="company_name"
                            placeholder="Enter company name"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="displayName">
                        {watchedValues.type === "vendor" ||
                        watchedValues.type === "client"
                          ? "Contact Name"
                          : "Full Name"}
                      </Label>
                      <Controller
                        name="displayName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="displayName"
                            placeholder="Enter name"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_number">Phone Number</Label>
                      <Controller
                        name="contact_number"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="contact_number"
                            placeholder="Enter phone number"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Controller
                        name="website"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="website"
                            placeholder="Enter website URL"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Address Tab */}
              <TabsContent value="address" className="m-0 p-6">
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="street1">Street Address 1</Label>
                      <Controller
                        name="street1"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="street1"
                            placeholder="Enter street address"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street2">Street Address 2</Label>
                      <Controller
                        name="street2"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="street2"
                            placeholder="Apt, Suite, Unit, etc."
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="city"
                            placeholder="Enter city"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="state"
                            placeholder="Enter state"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zip">Zip Code</Label>
                      <Controller
                        name="zip"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="zip"
                            placeholder="Enter zip code"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parking_loading">
                        Parking/Loading Notes
                      </Label>
                      <Controller
                        name="parking_loading"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="parking_loading"
                            placeholder="Enter parking or loading details"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Type-specific Details Tab */}
              <TabsContent value="details" className="m-0 p-6">
                {watchedValues.type === "vendor" && (
                  <div className="space-y-6">
                    {/* Counties Served */}
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-slate-800">
                        Counties Served
                      </h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                        {COUNTIES.map((county) => (
                          <div
                            key={county}
                            className="flex items-center space-x-2"
                          >
                            <Controller
                              name="countiesServed"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  id={`county-${county}`}
                                  checked={field.value?.includes(county)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValue, county]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (v) => v !== county,
                                        ),
                                      );
                                    }
                                  }}
                                />
                              )}
                            />
                            <Label
                              htmlFor={`county-${county}`}
                              className="text-sm font-normal"
                            >
                              {county}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time Needed */}
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-slate-800">
                        Time Needed
                      </h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {TIME_NEEDED.map((time) => (
                          <div
                            key={time}
                            className="flex items-center space-x-2"
                          >
                            <Controller
                              name="timeNeeded"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  id={`time-${time}`}
                                  checked={field.value?.includes(time)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValue, time]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter((v) => v !== time),
                                      );
                                    }
                                  }}
                                />
                              )}
                            />
                            <Label
                              htmlFor={`time-${time}`}
                              className="text-sm font-normal"
                            >
                              {time}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Catering Brokerage */}
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-slate-800">
                        Catering Brokerage
                      </h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {CATERING_BROKERAGES.map((brokerage) => (
                          <div
                            key={brokerage}
                            className="flex items-center space-x-2"
                          >
                            <Controller
                              name="cateringBrokerage"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  id={`brokerage-${brokerage}`}
                                  checked={field.value?.includes(brokerage)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([
                                        ...currentValue,
                                        brokerage,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (v) => v !== brokerage,
                                        ),
                                      );
                                    }
                                  }}
                                />
                              )}
                            />
                            <Label
                              htmlFor={`brokerage-${brokerage}`}
                              className="text-sm font-normal"
                            >
                              {brokerage}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Frequency */}
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-slate-800">
                        Frequency
                      </h3>
                      <Controller
                        name="frequency"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            // FIX: Use nullish coalescing operator for value
                            value={field.value ?? undefined}
                            className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4"
                          >
                            {FREQUENCIES.map((freq) => (
                              <div
                                key={freq}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={freq}
                                  id={`freq-${freq}`}
                                />
                                <Label
                                  htmlFor={`freq-${freq}`}
                                  className="text-sm font-normal"
                                >
                                  {freq}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      />
                    </div>

                    {/* Do you provide */}
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-slate-800">
                        Do you provide
                      </h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {PROVISIONS.map((provision) => (
                          <div
                            key={provision}
                            className="flex items-center space-x-2"
                          >
                            <Controller
                              name="provisions"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  id={`provision-${provision}`}
                                  checked={field.value?.includes(provision)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([
                                        ...currentValue,
                                        provision,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (v) => v !== provision,
                                        ),
                                      );
                                    }
                                  }}
                                />
                              )}
                            />
                            <Label
                              htmlFor={`provision-${provision}`}
                              className="text-sm font-normal"
                            >
                              {provision}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {watchedValues.type === "client" && (
                  <div className="space-y-6">
                    {/* Client specific fields */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="head_count">Headcount</Label>
                        <Controller
                          name="head_count"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="head_count"
                              placeholder="Enter approximate headcount"
                              {...field}
                              value={field.value || ""}
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* Counties Served */}
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-slate-800">
                        Counties Served
                      </h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                        {COUNTIES.map((county) => (
                          <div
                            key={county}
                            className="flex items-center space-x-2"
                          >
                            <Controller
                              name="countiesServed"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  id={`county-${county}`}
                                  checked={field.value?.includes(county)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValue, county]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (v) => v !== county,
                                        ),
                                      );
                                    }
                                  }}
                                />
                              )}
                            />
                            <Label
                              htmlFor={`county-${county}`}
                              className="text-sm font-normal"
                            >
                              {county}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="m-0 p-6">
                <div className="space-y-6">
                  <div className="rounded-lg border border-dashed p-6">
                    <h3 className="mb-4 text-base font-medium text-slate-800">
                      Uploaded Documents
                    </h3>
                    {userId ? (
                      <UserFilesDisplay
                        userId={userId}
                        refreshTrigger={refreshTrigger}
                      />
                    ) : (
                      <div className="text-center text-slate-500">
                        <p>Loading user information...</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Status & User Management */}
          <div className="space-y-6">
            {/* User Status Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-8">
                <CardTitle className="flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-primary" />
                  User Status and Role
                </CardTitle>
                <CardDescription>
                  Manage user account status and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="-mt-6 space-y-6 p-6">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="mb-3 space-y-2">
                    <Label>Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {(["active", "pending", "deleted"] as const).map(
                        (status) => (
                          <Button
                            key={status}
                            variant={
                              watchedValues.status === status
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleStatusChange(status)}
                            disabled={isUpdatingStatus || loading}
                            className={`capitalize ${
                              watchedValues.status === status
                                ? "text-primary-foreground bg-primary hover:bg-primary/90"
                                : ""
                            }`}
                          >
                            {status === "active" && (
                              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            {status === "pending" && (
                              <Clock className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            {status === "deleted" && (
                              <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            {status}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          // FIX: Use nullish coalescing for the value prop
                          value={field.value ?? undefined}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleRoleChange(value);
                          }}
                          disabled={loading || isUpdatingStatus}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vendor">Vendor</SelectItem>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="driver">Driver</SelectItem>
                            <SelectItem value="helpdesk">Helpdesk</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            {/* Type assertion to handle potential mismatch between userRole and expected types */}
                            {(userRole as string) === "super_admin" && (
                              <SelectItem value="super_admin">
                                Super Admin
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Docs Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  User Documents
                </CardTitle>
                <CardDescription>
                  Upload and manage user-specific documents
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <h3 className="mt-2 text-sm font-medium text-slate-700">
                      Upload Files
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Drag and drop files or click to browse
                    </p>
                  </div>
                  {/* Only render the component when type is available or provide a default value */}
                  <UserProfileUploads
                    uploadHooks={uploadHooks}
                    userType={watchedValues.type ?? "client"}
                    onUploadSuccess={() =>
                      setRefreshTrigger((prev) => prev + 1)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Archive User Card */}
            <Card>
              <CardHeader className="border-b bg-red-50 pb-3">
                <CardTitle className="flex items-center text-red-600">
                  <Archive className="mr-2 h-5 w-5" />
                  Archive User
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4 text-sm text-slate-600">
                  Archiving a user will remove their access to the platform but
                  keep their data for record purposes.
                </p>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  Archive User
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
