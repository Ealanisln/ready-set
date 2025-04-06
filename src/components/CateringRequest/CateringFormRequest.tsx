// components/CateringForm/CateringRequestForm.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AddressManager from "../AddressManager";
import { InputField } from "./FormFields/InputField";
import { SelectField } from "./FormFields/SelectField";
import { HostSection } from "./HostSection";
import { AddressSection } from "./AddressSection";
import { CateringFormData, Address } from "@/types/catering";
import { useUploadFile, UploadedFile } from "@/hooks/use-upload-file";
import { X } from "lucide-react";
import { FileWithPath } from "react-dropzone";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient, Session } from "@supabase/supabase-js";
import { CateringNeedHost } from "@/types/order";

interface ExtendedCateringFormData extends CateringFormData {
  attachments?: UploadedFile[];
}

const BROKERAGE_OPTIONS = [
  { value: "Foodee", label: "Foodee" },
  { value: "Ez Cater", label: "Ez Cater" },
  { value: "Grubhub", label: "Grubhub" },
  { value: "Cater Cow", label: "Cater Cow" },
  { value: "Cater2me", label: "Cater2me" },
  { value: "Zero Cater", label: "Zero Cater" },
  { value: "Platterz", label: "Platterz" },
  { value: "Direct Delivery", label: "Direct Delivery" },
  { value: "Other", label: "Other" },
];

const CateringRequestForm: React.FC = () => {
  // State for Supabase client
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileKeys, setFileKeys] = useState<string[]>([]);

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = await createClient();
        setSupabase(client);
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
        toast.error("Error connecting to the service. Please try again.");
        setIsInitializing(false);
      }
    };

    initSupabase();
  }, []);

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<ExtendedCateringFormData>({
      defaultValues: {
        brokerage: "",
        orderNumber: "",
        pickupDate: "",
        pickupTime: "",
        arrivalTime: "",
        completeTime: "",
        headcount: "",
        needHost: CateringNeedHost.NO,
        hoursNeeded: "",
        numberOfHosts: "",
        clientAttention: "",
        pickupNotes: "",
        specialNotes: "",
        orderTotal: "",
        tip: "",
        pickupAddress: {
          id: "",
          street1: "",
          street2: null,
          city: "",
          state: "",
          zip: "",
          locationNumber: null,
          parkingLoading: null,
          isRestaurant: false,
          isShared: false,
        },
        deliveryAddress: {
          id: "",
          street1: "",
          street2: null,
          city: "",
          state: "",
          zip: "",
          locationNumber: null,
          parkingLoading: null,
          isRestaurant: false,
          isShared: false,
        },
        attachments: [],
      },
    });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Supabase session when client is initialized
  useEffect(() => {
    if (!supabase) return;

    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchSession();

    // Set up listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleAddressesLoaded = useCallback((loadedAddresses: Address[]) => {
    setAddresses(loadedAddresses);
  }, []);

  const needHost = watch("needHost");
  
  const {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
    tempEntityId,
    updateEntityId,
    deleteFile,
  } = useUploadFile({
    maxFileCount: 5,
    maxFileSize: 10 * 1024 * 1024,
    allowedFileTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    bucketName: "fileUploader",
    category: "catering",
    entityType: "catering_request",
    userId: session?.user?.id,
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files?.length) return;
    const files = Array.from(event.target.files) as FileWithPath[];
    try {
      const result = await onUpload(files);
      const newFileKeys = result.map((file) => file.key);
      setFileKeys((prev) => [...prev, ...newFileKeys]);
      setValue("attachments", result);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files. Please try again.");
    }
  };

  const removeFile = async (fileToRemove: UploadedFile) => {
    try {
      // First remove from storage and database
      await deleteFile(fileToRemove.key);
      
      // Update UI
      const updatedFiles = (uploadedFiles || []).filter(
        (file) => file.key !== fileToRemove.key,
      );
      setValue("attachments", updatedFiles);
      
      // Update tracked keys
      setFileKeys((prev) => prev.filter((key) => key !== fileToRemove.key));
      
      toast.success("File removed successfully");
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file. Please try again.");
    }
  };

  const onSubmit = async (data: ExtendedCateringFormData) => {
    console.log("Starting catering form submission:", { 
      formData: { ...data, attachments: data.attachments?.length } 
    });
  
    if (!session?.user?.id) {
      console.error("User not authenticated", { userId: session?.user?.id });
      toast.error("You must be logged in to submit a request");
      return;
    }
  
    setIsSubmitting(true);
    setErrorMessage(null);
  
    try {
      console.log("Preparing order payload", {
        orderType: "catering",
        tipAmount: data.tip ? parseFloat(data.tip) : undefined,
        attachmentCount: data.attachments?.length
      });
  
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          order_type: "catering",
          tip: data.tip ? parseFloat(data.tip) : undefined,
          attachments: data.attachments?.map((file) => ({
            key: file.key,
            name: file.name,
            url: file.url,
          })),
        }),
      });
  
      console.log("Order API response received", { 
        status: response.status,
        ok: response.ok 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Order API error response:", { 
          status: response.status, 
          errorData 
        });
        throw new Error(
          errorData.message || "Failed to submit catering request",
        );
      }
  
      const order = await response.json();
      console.log("Order created successfully", { 
        orderId: order.id,
        hasAttachments: uploadedFiles.length > 0 
      });
  
      // Update file associations
      if (uploadedFiles.length > 0) {
        try {
          console.log("Updating file associations", { 
            orderId: order.id,
            fileCount: uploadedFiles.length 
          });
          await updateEntityId(order.id.toString());
          console.log("File associations updated successfully");
        } catch (updateError) {
          console.error("Error updating file associations:", {
            error: updateError,
            orderId: order.id,
            fileCount: uploadedFiles.length
          });
          // Continue with form submission even if file update fails
        }
      }
  
      setFileKeys([]);
      reset();
      console.log("Form reset and submission completed successfully");
      toast.success("Catering request submitted successfully!");
    } catch (error) {
      console.error("Submission error:", {
        error,
        formData: { ...data, attachments: data.attachments?.length }
      });
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      console.log("Form submission process completed");
    }
  };

  // Show loading state while Supabase is initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="mx-auto h-8 w-8 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Loading form...</p>
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!session) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Authentication required</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>You must be signed in to submit catering requests.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-3xl space-y-6 px-4 py-8"
    >
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
          {errorMessage}
        </div>
      )}
      <AddressManager
        onAddressesLoaded={handleAddressesLoaded}
        onAddressSelected={(addressId) => {
          const selectedAddress = addresses.find(
            (addr) => addr.id === addressId,
          );
          if (selectedAddress) {
            setValue("pickupAddress", selectedAddress);
          }
        }}
      />
      <SelectField
        control={control}
        name="brokerage"
        label="Brokerage / Direct"
        options={BROKERAGE_OPTIONS}
        required
      />
      <InputField
        control={control}
        name="headcount"
        label="Headcount"
        type="number"
        required
      />
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Do you need a Host?
        </label>
        <Controller
          name="needHost"
          control={control}
          render={({ field }) => (
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  {...field}
                  value={CateringNeedHost.YES}
                  checked={field.value === CateringNeedHost.YES}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  {...field}
                  value={CateringNeedHost.NO}
                  checked={field.value === CateringNeedHost.NO}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          )}
        />
      </div>
      <HostSection control={control} needHost={needHost} />
      <InputField
        control={control}
        name="orderNumber"
        label="Order Number"
        required
      />
      <InputField
        control={control}
        name="pickupDate"
        label="Date"
        type="date"
        required
      />
      <InputField
        control={control}
        name="pickupTime"
        label="Pick Up Time"
        type="time"
        required
      />
      <InputField
        control={control}
        name="arrivalTime"
        label="Arrival Time"
        type="time"
        required
      />
      <InputField
        control={control}
        name="completeTime"
        label="Complete Time"
        type="time"
        optional
      />
      <InputField
        control={control}
        name="clientAttention"
        label="Client / Attention"
        required
      />
      <InputField
        control={control}
        name="orderTotal"
        label="Order Total"
        type="number"
        required
        rules={{ min: { value: 0, message: "Order total must be positive" } }}
      />
      <AddressSection
        control={control}
        addresses={addresses}
        onAddressSelected={(address) => setValue("deliveryAddress", address)}
      />
      <InputField
        control={control}
        name="tip"
        label="Tip"
        type="number"
        optional
        rules={{
          validate: (value: string | undefined) => {
            if (value === undefined || value === "") return true;
            const num = parseFloat(value);
            return (
              (!isNaN(num) && num >= 0) ||
              "Tip must be a positive number or empty"
            );
          },
        }}
      />
      <InputField
        control={control}
        name="pickupNotes"
        label="Pick Up Notes"
        type="textarea"
        rows={3}
        optional
      />
      <InputField
        control={control}
        name="specialNotes"
        label="Special Notes"
        type="textarea"
        rows={3}
        optional
      />
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Attachments
        </label>
        <div className="space-y-2">
          <input
            type="file"
            onChange={handleFileUpload}
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:rounded-md file:border-0
              file:bg-blue-50 file:px-4
              file:py-2 file:text-sm
              file:font-medium file:text-blue-700
              hover:file:bg-blue-100
              disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isUploading || isSubmitting}
          />
          <p className="text-xs text-gray-500">
            Maximum 5 files. Supported formats: PDF, Word, JPEG, PNG, WebP. Max
            size: 10MB per file.
          </p>
        </div>
        {/* Uploaded Files List */}
        <div className="space-y-2">
          {uploadedFiles?.map((file) => (
            <div
              key={file.key}
              className="flex items-center justify-between rounded-md border border-gray-200 p-2"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{file.name}</span>
                {progresses && progresses[file.name] !== undefined && (
                  <span className="text-xs text-gray-500">
                    {Math.round(progresses[file.name])}%
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(file)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isUploading || isSubmitting}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`relative w-full rounded-md px-6 py-3 text-white transition ${
          isSubmitting
            ? "cursor-not-allowed bg-blue-400"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        <div
          className={`flex items-center justify-center ${isSubmitting ? "opacity-0" : ""}`}
        >
          Submit Catering Request
        </div>
        {isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="ml-2">Submitting...</span>
          </div>
        )}
      </button>
    </form>
  );
};

export default CateringRequestForm;