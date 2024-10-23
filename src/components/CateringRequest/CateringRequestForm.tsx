// components/CateringForm/CateringRequestForm.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import AddressManager from "../AddressManager";
import { InputField } from "./FormFields/InputField";
import { SelectField } from "./FormFields/SelectField";
import { HostSection } from "./HostSection";
import { AddressSection } from "./AddressSection";
import { CateringFormData, Address } from "@/types/catering";
import { useUploadFile } from "@/hooks/use-upload-file";
import { UploadedFile } from "@/types/uploaded-file";
import { X } from "lucide-react";
import { FileWithPath } from "react-dropzone";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface ExtendedCateringFormData extends CateringFormData {
  attachments?: UploadThingFile[];
}

// Define a type for the upload result
type UploadResult = {
  key: string;
  name: string;
  url: string;
};

// Use UploadThing's file type
type UploadThingFile = {
  key: string;
  name: string;
  url: string;
  size: number;
  type: string;
  serverData: unknown;
  customId?: string | null;
};

const BROKERAGE_OPTIONS = [
  { value: "Foodee", label: "Foodee" },
  { value: "Ez Cater", label: "Ez Cater" },
  { value: "Grubhub", label: "Grubhub" },
  { value: "Cater Cow", label: "Cater Cow" },
  { value: "Zero Cater", label: "Zero Cater" },
  { value: "Platterz", label: "Platterz" },
  { value: "Direct Delivery", label: "Direct Delivery" },
  { value: "Other", label: "Other" },
];

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const CateringRequestForm: React.FC = () => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileKeys, setUploadedFileKeys] = useState<string[]>([]);
  const { control, handleSubmit, watch, setValue, reset } =
    useForm<ExtendedCateringFormData>({
      defaultValues: {
        brokerage: "",
        order_number: "",
        date: "",
        pickup_time: "",
        arrival_time: "",
        complete_time: "",
        headcount: "",
        need_host: "no",
        hours_needed: "",
        number_of_host: "",
        client_attention: "",
        pickup_notes: "",
        special_notes: "",
        order_total: "",
        tip: "",
        address: {
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
        delivery_address: {
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

  const handleAddressesLoaded = useCallback((loadedAddresses: Address[]) => {
    setAddresses(loadedAddresses);
  }, []);

  const needHost = watch("need_host");

  const { onUpload, uploadedFiles, progresses, isUploading } = useUploadFile(
    "fileUploader",
    {
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
      category: "catering",
      entityType: "catering_request",
      entityId: "temp",
      userId: session?.user?.id,
    },
  );

  // Cleanup function for uploaded files
  const cleanupUploadedFiles = async (fileKeys: string[]) => {
    try {
      await fetch("/api/uploadthing/cleanup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileKeys }),
      });
    } catch (error) {
      console.error("Error cleaning up files:", error);
    }
  };

  // Handle window/tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (uploadedFileKeys.length > 0 && !isSubmitting) {
        // Show browser's default "Changes you made may not be saved" dialog
        e.preventDefault();
        e.returnValue = "";

        // Note: We can't guarantee this cleanup will complete before the window closes
        // That's why we also need server-side cleanup for orphaned files
        cleanupUploadedFiles(uploadedFileKeys);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Cleanup if component unmounts without submission
      if (uploadedFileKeys.length > 0 && !isSubmitting) {
        cleanupUploadedFiles(uploadedFileKeys);
      }
    };
  }, [uploadedFileKeys, isSubmitting]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    
    const files = Array.from(event.target.files) as FileWithPath[];
    try {
      const result = await onUpload(files);
      // No need to check if result exists since onUpload will either return array or throw
      const newFileKeys = result.map(file => file.key);
      setUploadedFileKeys(prev => [...prev, ...newFileKeys]);
      setValue('attachments', result);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files. Please try again.');
    }
  };

  const removeFile = async (fileToRemove: UploadThingFile) => {
    // Remove from UI immediately
    const updatedFiles = (uploadedFiles || []).filter(
      (file) => file.key !== fileToRemove.key,
    ) as UploadThingFile[];
    setValue("attachments", updatedFiles);

    // Remove from tracked keys
    setUploadedFileKeys((prev) =>
      prev.filter((key) => key !== fileToRemove.key),
    );

    // Clean up the removed file
    await cleanupUploadedFiles([fileToRemove.key]);
  };

  const onSubmit = async (data: ExtendedCateringFormData) => {
    if (!session?.user?.id) {
      console.error("User not authenticated");
      return;
    }

    // Set loading state
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
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

      if (response.ok) {
        // Clear the tracked file keys since they're now associated with a submitted order
        setUploadedFileKeys([]);
        reset();
        toast.success("Catering request submitted successfully!");
      } else {
        // If submission fails, keep the files tracked for potential cleanup
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to submit catering request",
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            setValue("address", selectedAddress);
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
          name="need_host"
          control={control}
          render={({ field }) => (
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  {...field}
                  value="yes"
                  checked={field.value === "yes"}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  {...field}
                  value="no"
                  checked={field.value === "no"}
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
        name="order_number"
        label="Order Number"
        required
      />

      <InputField
        control={control}
        name="date"
        label="Date"
        type="date"
        required
      />

      <InputField
        control={control}
        name="pickup_time"
        label="Pick Up Time"
        type="time"
        required
      />

      <InputField
        control={control}
        name="arrival_time"
        label="Arrival Time"
        type="time"
        required
      />

      <InputField
        control={control}
        name="complete_time"
        label="Complete Time"
        type="time"
        optional
      />

      <InputField
        control={control}
        name="client_attention"
        label="Client / Attention"
        required
      />

      <InputField
        control={control}
        name="order_total"
        label="Order Total"
        type="number"
        required
        rules={{ min: { value: 0, message: "Order total must be positive" } }}
      />

      <AddressSection
        control={control}
        addresses={addresses}
        onAddressSelected={(address) => setValue("delivery_address", address)}
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
        name="pickup_notes"
        label="Pick Up Notes"
        type="textarea"
        rows={3}
        optional
      />

      <InputField
        control={control}
        name="special_notes"
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
          {uploadedFiles?.map((file: UploadThingFile) => (
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
