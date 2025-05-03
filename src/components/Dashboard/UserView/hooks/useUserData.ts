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

  // Fetch user data
  const fetchUser = useCallback(async () => {
    if (!userId) return null;

    try {
      setLoading(true);
      
      // Check for admin mode
      const isAdminMode = typeof window !== 'undefined' && localStorage.getItem('admin_mode') === 'true';
      
      // Add a timestamp and request id to prevent caching
      const cacheKey =
        Date.now().toString() + Math.random().toString(36).substring(7);
      const response = await fetch(`/api/users/${userId}?t=${cacheKey}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          "x-request-source": isAdminMode ? "AdminPanel" : "ModernUserProfile",
          "x-admin-mode": isAdminMode ? "true" : "false"
        },
        credentials: 'include'
      });

      if (!response.ok) {
        // Check if we got redirected to sign-in page
        if (response.redirected && response.url.includes('sign-in')) {
          if (isAdminMode) {
            console.log("Admin mode active but got redirected to sign-in. Attempting to recover...");
            // Try to reload the page while preserving admin mode
            window.location.reload();
            return null;
          }
          throw new Error("Authentication required - please sign in");
        }
        
        // Try to get the error message from the response body
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user");
        } catch (jsonError) {
          throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log("API Response:", data);
      
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
        
        // Counties - Use the array provided by the API (already split)
        countiesServed: Array.isArray(data.countiesServed) ? data.countiesServed : [],
        // Keep original string if needed elsewhere, ensure it's a string or fallback
        counties: typeof data.counties === 'string' ? data.counties : "", 
        
        // Time Needed - Use the array directly from the API
        timeNeeded: Array.isArray(data.timeNeeded) ? data.timeNeeded : [],
        
        // Catering Brokerage - Use the array directly from the API
        cateringBrokerage: Array.isArray(data.cateringBrokerage) ? data.cateringBrokerage : [],
        
        // Provisions - Use the array directly from the API
        provisions: Array.isArray(data.provisions) ? data.provisions : [],
        frequency: data.frequency || null,
        headCount: data.headCount ?? data.head_count ?? null, // Use camelCase or snake_case from API
        status: data.status || "pending",
        name: data.name,
        contact_name: data.contact_name,
        sideNotes: data.sideNotes // Make sure sideNotes exists in API response or handle null
      };
      
      console.log("[useUserData] fetchUser returning transformed data:", JSON.stringify(formData, null, 2));
      
      return formData;
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data");
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

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