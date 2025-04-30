import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UserFormValues } from "../types";

// Define a type that extends UseFormReturn with our custom properties
import { UseFormReturn } from "react-hook-form";

type ExtendedUseFormReturn = UseFormReturn<UserFormValues> & {
  watchedValues: UserFormValues;
  hasUnsavedChanges: boolean;
  onSubmit: (data: UserFormValues) => Promise<void>;
};

export const useUserForm = (
  userId: string,
  fetchUser: () => Promise<UserFormValues | null>
): ExtendedUseFormReturn => {
  // Create the form with react-hook-form
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

  // Load initial data
  useEffect(() => {
    const loadUserData = async () => {
      console.log("[useUserForm] Fetching user data...");
      const userData = await fetchUser();
      if (userData) {
        console.log("[useUserForm] User data fetched, attempting reset with:", JSON.stringify(userData, null, 2));
        try {
          methods.reset(userData);
          console.log("[useUserForm] Form reset executed successfully.");
        } catch (error) {
          console.error("[useUserForm] Error during form reset:", error);
        }
      } else {
        console.log("[useUserForm] No user data fetched, skipping reset.");
      }
    };
    
    loadUserData();
  }, [fetchUser, methods]);

  // Form submission
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
      const submitData: any = {
        ...baseSubmitData,
        type: type,
        counties: countiesServed?.join(",") || "",
        time_needed: timeNeeded?.join(",") || "",
        catering_brokerage: cateringBrokerage?.join(",") || "",
        provide: provisions?.join(",") || "",
      };

      // Set name/contact_name based on the form's 'type' field
      // Only update the relevant field, don't nullify the other
      if (
        type === "driver" ||
        type === "helpdesk" ||
        type === "admin" ||
        type === "super_admin"
      ) {
        submitData.name = displayName;
      } else if (type === "vendor" || type === "client") {
        submitData.contact_name = displayName;
      } else {
         // Optional: Handle unexpected types 
         console.warn(`Unexpected user type ${type} in form submission`);
         // Default to setting both if type is unknown, might need review
         submitData.name = displayName;
         submitData.contact_name = displayName;
      }
      
      console.log("Data being sent to API:", submitData); // Add log

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
      await fetchUser();
      toast.success("User saved successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        `Failed to save user: ${error instanceof Error ? error.message : "Please try again."}`
      );
    }
  };

  // Watch form values
  const watchedValues = methods.watch();
  const hasUnsavedChanges = methods.formState.isDirty;
  
  // Return the complete form methods and our custom properties
  return {
    ...methods,
    watchedValues,
    hasUnsavedChanges,
    onSubmit
  };
};