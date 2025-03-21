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
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient, Session } from "@supabase/supabase-js";

interface ExtendedCateringFormData extends CateringFormData {
  // Removed attachments property
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
        // Removed attachments default
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

  const needHost = watch("need_host");

  const onSubmit = async (data: ExtendedCateringFormData) => {
    console.log("Starting catering form submission:", { 
      formData: data
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
        tipAmount: data.tip ? parseFloat(data.tip) : undefined
      });
  
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          order_type: "catering",
          tip: data.tip ? parseFloat(data.tip) : undefined
          // Removed attachments from payload
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
        orderId: order.id
      });
  
      reset();
      console.log("Form reset and submission completed successfully");
      toast.success("Catering request submitted successfully!");
    } catch (error) {
      console.error("Submission error:", {
        error,
        formData: data
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