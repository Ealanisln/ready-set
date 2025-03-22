// src/components/CateringRequest/CateringRequestForm.tsx

import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { CateringFormData, Address } from "@/types/catering";
import { createClient } from "@/utils/supabase/client";
import AddressManager from "../AddressManager";
import { Loader2, AlertCircle, Calendar, Clock, DollarSign, Users, Clipboard, MapPin } from "lucide-react";

// Form field components
const InputField: React.FC<{
  control: any;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  rules?: any;
  rows?: number;
  placeholder?: string;
  icon?: React.ReactNode;
}> = ({ 
  control, 
  name, 
  label, 
  type = "text", 
  required = false, 
  optional = false, 
  rules = {}, 
  rows, 
  placeholder,
  icon
}) => (
  <div className="relative mb-4">
    <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
      {label} {optional ? <span className="text-xs text-gray-500">(Optional)</span> : ""}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false, ...rules }}
      render={({ field, fieldState: { error } }) => (
        <div>
          <div className="relative">
            {icon && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                {icon}
              </div>
            )}
            {type === "textarea" ? (
              <textarea
                {...field}
                id={name}
                rows={rows || 3}
                className={`w-full rounded-md border ${
                  error ? "border-red-500" : "border-gray-300"
                } ${icon ? "pl-10" : "pl-3"} py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                placeholder={placeholder}
              />
            ) : (
              <input
                {...field}
                id={name}
                type={type}
                className={`w-full rounded-md border ${
                  error ? "border-red-500" : "border-gray-300"
                } ${icon ? "pl-10" : "pl-3"} py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                placeholder={placeholder}
              />
            )}
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
        </div>
      )}
    />
  </div>
);

const SelectField: React.FC<{
  control: any;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  optional?: boolean;
  icon?: React.ReactNode;
}> = ({ control, name, label, options, required = false, optional = false, icon }) => (
  <div className="mb-4">
    <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
      {label} {optional ? <span className="text-xs text-gray-500">(Optional)</span> : ""}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field, fieldState: { error } }) => (
        <div>
          <div className="relative">
            {icon && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                {icon}
              </div>
            )}
            <select
              {...field}
              id={name}
              className={`w-full rounded-md border ${
                error ? "border-red-500" : "border-gray-300"
              } ${icon ? "pl-10" : "pl-3"} py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
        </div>
      )}
    />
  </div>
);

// Address Section Component
const AddressSection: React.FC<{
  control: any;
  addresses: Address[];
  onAddressSelected: (address: Address) => void;
}> = ({ control, addresses, onAddressSelected }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h3 className="mb-5 text-lg font-medium text-gray-800">
        Delivery Address
      </h3>
      <div className="mb-2">
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Select a delivery address
        </label>
        <Controller
          name="delivery_address.id"
          control={control}
          rules={{ required: "Delivery address is required" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <MapPin size={16} />
                </div>
                <select
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    const selectedAddress = addresses.find(
                      (addr) => addr.id === e.target.value
                    );
                    if (selectedAddress) {
                      onAddressSelected(selectedAddress);
                    }
                  }}
                  className={`w-full rounded-md border ${
                    error ? "border-red-500" : "border-gray-300"
                  } pl-10 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                >
                  <option value="">Select address</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.street1}, {address.city}, {address.state} {address.zip}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="mt-2 text-xs text-red-500">{error.message}</p>}
            </div>
          )}
        />
      </div>
    </div>
  );
};

// Host Section Component
const HostSection: React.FC<{
  control: any;
  needHost: string;
}> = ({ control, needHost }) => {
  if (needHost !== "yes") return null;

  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
      <h3 className="mb-5 text-lg font-medium text-blue-800">Host Details</h3>
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          control={control}
          name="hours_needed"
          label="Hours Needed"
          type="number"
          required={needHost === "yes"}
          icon={<Clock size={16} />}
        />
        <InputField
          control={control}
          name="number_of_host"
          label="Number of Hosts"
          type="number"
          required={needHost === "yes"}
          icon={<Users size={16} />}
        />
      </div>
    </div>
  );
};

// Form Component
interface ExtendedCateringFormData extends CateringFormData {}

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
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Form initialization
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
      },
    });

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
      
      // Redirect to a success page or dashboard
      setTimeout(() => {
        router.push('/dashboard/orders');
      }, 2000);
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
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
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
          <AlertCircle className="h-5 w-5 text-yellow-400" />
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
      className="mx-auto w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
    >
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">Catering Request</h2>
      
      {errorMessage && (
        <div className="mb-6 flex rounded-md bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">{errorMessage}</div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-medium text-gray-800">
          Pickup Location
        </h3>
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
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <SelectField
          control={control}
          name="brokerage"
          label="Brokerage / Direct"
          options={BROKERAGE_OPTIONS}
          required
          icon={<Clipboard size={16} />}
        />
        <InputField
          control={control}
          name="order_number"
          label="Order Number"
          required
          placeholder="e.g., ORD-12345"
          icon={<Clipboard size={16} />}
        />
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <InputField
          control={control}
          name="date"
          label="Date"
          type="date"
          required
          icon={<Calendar size={16} />}
        />
        <InputField
          control={control}
          name="headcount"
          label="Headcount"
          type="number"
          placeholder="Number of people"
          required
          icon={<Users size={16} />}
        />
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <InputField
          control={control}
          name="pickup_time"
          label="Pick Up Time"
          type="time"
          required
          icon={<Clock size={16} />}
        />
        <InputField
          control={control}
          name="arrival_time"
          label="Arrival Time"
          type="time"
          required
          icon={<Clock size={16} />}
        />
        <InputField
          control={control}
          name="complete_time"
          label="Complete Time"
          type="time"
          optional
          icon={<Clock size={16} />}
        />
      </div>

      <div className="mb-8 rounded-lg bg-gray-50 p-6">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Do you need a Host?
          </label>
          <Controller
            name="need_host"
            control={control}
            render={({ field }) => (
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...field}
                    value="yes"
                    checked={field.value === "yes"}
                    className="mr-3 h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...field}
                    value="no"
                    checked={field.value === "no"}
                    className="mr-3 h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            )}
          />
        </div>
        <HostSection control={control} needHost={needHost} />
      </div>

      <div className="mb-8">
        <InputField
          control={control}
          name="client_attention"
          label="Client / Attention"
          required
          placeholder="Enter client name or attention"
          icon={<Users size={16} />}
        />
      </div>

      <div className="mb-8">
        <h3 className="mb-5 border-b border-gray-200 pb-3 text-lg font-medium text-gray-800">
          Delivery Details
        </h3>
        <AddressSection
          control={control}
          addresses={addresses}
          onAddressSelected={(address) => setValue("delivery_address", address)}
        />
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <InputField
          control={control}
          name="order_total"
          label="Order Total ($)"
          type="number"
          required
          placeholder="0.00"
          rules={{ min: { value: 0, message: "Order total must be positive" } }}
          icon={<DollarSign size={16} />}
        />
        <InputField
          control={control}
          name="tip"
          label="Tip ($)"
          type="number"
          optional
          placeholder="0.00"
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
          icon={<DollarSign size={16} />}
        />
      </div>

      <div className="mb-8">
        <h3 className="mb-5 border-b border-gray-200 pb-3 text-lg font-medium text-gray-800">
          Additional Notes
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            control={control}
            name="pickup_notes"
            label="Pick Up Notes"
            type="textarea"
            rows={3}
            optional
            placeholder="Any special instructions for pickup"
          />
          <InputField
            control={control}
            name="special_notes"
            label="Special Notes"
            type="textarea"
            rows={3}
            optional
            placeholder="Any other special requests or instructions"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`relative w-full rounded-md px-6 py-3 font-medium text-white transition ${
            isSubmitting
              ? "cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <div
            className={`flex items-center justify-center ${isSubmitting ? "opacity-0" : ""}`}
          >
            Submit Catering Request
          </div>
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
              <span className="ml-2">Submitting...</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default CateringRequestForm;