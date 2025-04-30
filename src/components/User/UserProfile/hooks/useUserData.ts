// src/components/User/UserProfile/hooks/useUserData.ts

import { useState, useCallback } from "react";
import { FileWithPath } from "react-dropzone"; // Keep this import for typing
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import { useUploadFile } from "@/hooks/use-upload-file"; // Keep this import
import { UserFormValues } from "../types";

// Define the explicit return type for the hook
interface UseUserDataReturn {
  loading: boolean;
  isUpdatingStatus: boolean;
  userData: UserFormValues | null;
  fetchUser: () => Promise<UserFormValues | null>;
  handleStatusChange: (newStatus: NonNullable<UserFormValues["status"]>) => Promise<void>;
  handleRoleChange: (newRoleValue: string) => Promise<void>;
  handleUploadSuccess: () => void;
  useUploadFileHook: (category: string) => any; // Replace 'any' with a more specific type if available
}

export const useUserData = (
  userId: string,
  refreshTrigger: number,
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>
): UseUserDataReturn => {
  // State management
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [userData, setUserData] = useState<UserFormValues | null>(null); // Added state for user data
  
  // Auth context
  const { session } = useUser();

  // Helper function to convert comma-separated string to array of values
  const stringToValueArray = useCallback(
    (str: string | undefined | null): string[] => {
      if (!str) return [];
      return str.split(",").map((item: string) => item.trim());
    },
    []
  );

  // Fetch user data
  const fetchUser = useCallback(async () => {
    if (!userId) {
      console.log("No userId provided to fetchUser");
      setUserData(null); // Ensure userData is null if no userId
      return null;
    }

    try {
      setLoading(true);
      const cacheKey = Date.now().toString() + Math.random().toString(36).substring(7);
      console.log(`Fetching user data for ID: ${userId} with cache key: ${cacheKey}`);
      
      const response = await fetch(`/api/users/${userId}?t=${cacheKey}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          "x-request-source": "ModernUserProfile",
        },
      });

      console.log("API Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response data:", data);
      
      if (!data) {
        console.error("No data received from API");
        throw new Error("No data received from API");
      }

      // Transform the API data to match form structure
      const formData: UserFormValues = {
        id: data.id,
        displayName: data.name || data.contact_name || "",
        email: data.email,
        contact_number: data.contact_number,
        type: (data.type?.toLowerCase() as UserFormValues['type']) || "client",
        company_name: data.company_name,
        website: data.website,
        street1: data.street1 || "",
        street2: data.street2 || "",
        city: data.city || "",
        state: data.state || "",
        zip: data.zip || "",
        location_number: data.location_number || "",
        parking_loading: data.parking_loading || "",
        
        // Counties - Use the array provided by the API if available
        countiesServed: Array.isArray(data.countiesServed) ? data.countiesServed : stringToValueArray(data.counties),
        counties: data.counties || "", // Keep original string if needed elsewhere
        
        // Time Needed - Directly use the array from the API response
        timeNeeded: Array.isArray(data.timeNeeded) ? data.timeNeeded : [], // Use data.timeNeeded (camelCase array)
        // time_needed: data.time_needed || "", // Remove or comment out if time_needed isn't needed in the form state
        
        // Catering Brokerage - Use the array provided by the API if available
        cateringBrokerage: Array.isArray(data.cateringBrokerage) ? data.cateringBrokerage : stringToValueArray(data.catering_brokerage),
        // catering_brokerage: data.catering_brokerage || "", // Remove or comment out
        
        // Provisions - Use the array provided by the API if available
        provisions: Array.isArray(data.provisions) ? data.provisions : stringToValueArray(data.provide),
        provide: data.provide || "", // Keep original string if needed elsewhere
        
        frequency: data.frequency || null,
        head_count: data.headCount ?? data.head_count ?? null, // Use camelCase from API if available, fallback to snake_case
        status: data.status || "pending",
        name: data.name,
        contact_name: data.contact_name,
      };
      
      console.log("Transformed form data:", formData);
      setUserData(formData); // Set the state with fetched data
      return formData;
    } catch (error) {
      console.error("Error in fetchUser:", error);
      toast.error("Failed to fetch user data. Please try again later.");
      setUserData(null); // Reset user data on error
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, stringToValueArray]);

  const handleUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("File uploaded successfully");
  }, [setRefreshTrigger]);

  const handleStatusChange = async (
    newStatus: NonNullable<UserFormValues["status"]>
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

      toast.success(data.message || "User status updated successfully");
      
      // Trigger full refetch via parent component (keeps data consistent)
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user status"
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
      await fetchUser(); // Make sure to await this
      toast.success("User role updated successfully!");
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error(
        `Failed to update role: ${error instanceof Error ? error.message : "Please try again."}`
      );
    } finally {
      setLoading(false);
    }
  };

  // File upload hooks configuration
  const useUploadFileHook = (category: string) => {
    const uploadHook = useUploadFile({
      defaultUploadedFiles: [],
      userId: userId,
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
      uploadedFiles: uploadHook.uploadedFiles,
      category,
      entityType: "user",
      entityId: userId,
    };
  };

  return {
    loading,
    isUpdatingStatus,
    userData, // Return the user data state
    fetchUser,
    handleStatusChange,
    handleRoleChange,
    handleUploadSuccess,
    useUploadFileHook
  };
};