// src/components/Dashboard/UserView/hooks/useUserData.ts

import { useState, useCallback } from "react";
import { FileWithPath } from "react-dropzone"; // Keep this import for typing
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import { useUploadFile } from "@/hooks/use-upload-file"; // Keep this import
import { User, UserFormValues } from "../types";
import { UseFormSetValue } from "react-hook-form"; // Import UseFormSetValue

export const useUserData = (
  userId: string,
  refreshTrigger: number,
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>
) => {
  // State management
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
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
    if (!userId) return null;

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

      const data = await response.json();
      console.log("API Response:", data);
      
      // Transform the API data to match form structure
      const formData: UserFormValues = {
        id: data.id,
        displayName: data.name || data.contact_name || "",
        email: data.email,
        contact_number: data.contact_number,
        // Use 'type' instead of 'role' since that's what your API returns
        type: data.type || "client", 
        company_name: data.company_name,
        website: data.website,
        street1: data.street1 || "",
        street2: data.street2 || "",
        city: data.city || "",
        state: data.state || "",
        zip: data.zip || "",
        location_number: data.location_number || "",
        parking_loading: data.parking_loading || "",
        
        // Transform string fields to arrays
        countiesServed: stringToValueArray(data.counties),
        counties: data.counties || "",
        
        timeNeeded: stringToValueArray(data.time_needed),
        time_needed: data.time_needed || "",
        
        cateringBrokerage: stringToValueArray(data.catering_brokerage),
        catering_brokerage: data.catering_brokerage || "",
        
        provisions: stringToValueArray(data.provide),
        provide: data.provide || "",
        
        frequency: data.frequency || "",
        head_count: data.head_count || "",
        status: data.status || "pending",
        name: data.name,
        contact_name: data.contact_name,
      };
      
      console.log("Transformed form data:", formData);
      return formData;
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data");
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
    fetchUser,
    handleStatusChange,
    handleRoleChange,
    handleUploadSuccess,
    useUploadFileHook
  };
};