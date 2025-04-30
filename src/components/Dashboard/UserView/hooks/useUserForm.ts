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
      countiesServed: null,
      counties: null,
      timeNeeded: null,
      cateringBrokerage: null,
      provisions: null,
      frequency: null,
      headCount: null,
      status: "pending",
      name: null,
      contact_name: null,
      sideNotes: null
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
      // Destructure known fields
      const {
        displayName,
        // Form-specific array fields
        counties,          // For clients
        countiesServed,    // For vendors
        timeNeeded,        // For both
        cateringBrokerage, // For vendors
        provisions,        // For vendors
        // Base fields
        type,
        ...baseSubmitData
      } = data;

      // Prepare data for the API, matching Prisma schema fields
      const submitData: any = {
        ...baseSubmitData, // Includes id, email, address fields, headCount, frequency, status, etc.
        type: type,
        // Convert arrays back to strings/JSON based on Prisma schema
        // counties field in Prisma is Json?, but API likely expects array or specific structure.
        // Let's assume for now API/Prisma handles array assignment to Json field correctly.
        counties: type === 'client' ? counties : (type === 'vendor' ? countiesServed : null),
        
        // timeNeeded field in Prisma is String?
        timeNeeded: timeNeeded?.join(",") || null, // Join array to comma-separated string
        
        // cateringBrokerage field in Prisma is String?
        cateringBrokerage: type === 'vendor' ? (cateringBrokerage?.join(",") || null) : null, // Only for vendors
        
        // provide field in Prisma is String?
        provide: type === 'vendor' ? (provisions?.join(",") || null) : null, // Only for vendors
        
        // headCount is handled by baseSubmitData as it's number | null
        // frequency is handled by baseSubmitData as it's string | null
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
        credentials: 'include'
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