// src/components/User/UserProfile/hooks/useUserForm.ts

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UserFormValues } from "../types";

export const useUserForm = (
  userId: string,
  fetchUser: () => Promise<UserFormValues | null>
) => {
  // Form setup with default values - Assign the result to 'methods'
  const methods = useForm<UserFormValues>({
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

  // Destructure necessary parts from 'methods' for use within this hook
  const {
    watch,
    reset,
    formState: { isDirty },
    // Note: control, handleSubmit, errors etc. are available via the returned 'methods' object
  } = methods;

  // Watch form values
  const watchedValues = watch();
  const hasUnsavedChanges = isDirty;

  // Load initial data
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUser();
      if (userData) {
        // Use reset from the destructured methods
        reset(userData);
        console.log("Form reset with data:", userData);
      }
    };

    loadUserData();
  }, [fetchUser, reset]); // Dependency array includes reset

  // Form submission logic (remains the same)
  const onSubmit = async (data: UserFormValues) => {
    try {
      // Destructure known form-specific fields and array fields
      const {
        displayName,
        countiesServed,
        timeNeeded,
        cateringBrokerage,
        provisions,
        type,
        ...baseSubmitData
      } = data;

      // Start with base data
      const submitData = {
        ...baseSubmitData,
        // Use 'type' as is (don't map to 'role')
        type: type,
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
      // Fetch user again to potentially update state elsewhere and ensure form is reset with latest saved data
      const latestUserData = await fetchUser();
      if (latestUserData) {
          reset(latestUserData); // Reset the form with the data just saved
      }
      toast.success("User saved successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        `Failed to save user: ${error instanceof Error ? error.message : "Please try again."}`
      );
    }
  };

  // Return the entire methods object along with custom values/handlers
  return {
    methods, // <- Now returning the whole methods object
    watchedValues,
    hasUnsavedChanges,
    onSubmit, // Your custom submit handler
    // Note: isDirty is available via methods.formState.isDirty
    // Note: reset is available via methods.reset
    // Note: control is available via methods.control
    // Note: handleSubmit is available via methods.handleSubmit (you'll use it like: methods.handleSubmit(onSubmit))
  };
};