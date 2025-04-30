import { useEffect } from "react";
import { useForm, UseFormReturn, UseFormHandleSubmit, UseFormSetValue } from "react-hook-form";
import toast from "react-hot-toast";
import { UserFormValues } from "../types";

// Define the return type for clarity
interface UseUserFormReturn {
  methods: UseFormReturn<UserFormValues>;
  watchedValues: UserFormValues;
  hasUnsavedChanges: boolean;
  onSubmit: (data: UserFormValues) => Promise<void>;
}

export const useUserForm = (
  userId: string,
  initialData: UserFormValues | null,
  refetchData: () => Promise<any>
): UseUserFormReturn => {
  // Capture the full methods object
  const methods = useForm<UserFormValues>({
    defaultValues: initialData || {
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

  // Destructure necessary methods/state for internal use
  const { watch, reset, formState: { isDirty } } = methods;

  // Watch form values
  const watchedValues = watch();
  const hasUnsavedChanges = isDirty;
  
  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("[useUserForm] Initial data received, resetting form.");
      // Reset the form with the new initialData
      // keepDirty: false ensures that the form is no longer considered dirty after reset if data matches
      reset(initialData, { keepDirty: false }); 
    } else {
      console.log("[useUserForm] No initial data provided, skipping reset.");
    }
    // Dependency array ensures this runs only when initialData or reset function identity changes
  }, [initialData, reset]);

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
      await refetchData();
      toast.success("User saved successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        `Failed to save user: ${error instanceof Error ? error.message : "Please try again."}`
      );
    }
  };

  return {
    methods,
    watchedValues,
    hasUnsavedChanges,
    onSubmit,
  };
};