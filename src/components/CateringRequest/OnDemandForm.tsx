import React, { useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import AddressManager from "../AddressManager";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { Address } from "@/types/address";
import {
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Clipboard,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

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
  icon,
}) => (
  <div className="relative mb-4">
    <label
      htmlFor={name}
      className="mb-2 block text-sm font-medium text-gray-700"
    >
      {label}{" "}
      {optional ? (
        <span className="text-xs text-gray-500">(Optional)</span>
      ) : (
        ""
      )}
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
          {error && (
            <p className="mt-1 text-xs text-red-500">{error.message}</p>
          )}
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
}> = ({
  control,
  name,
  label,
  options,
  required = false,
  optional = false,
  icon,
}) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="mb-2 block text-sm font-medium text-gray-700"
    >
      {label}{" "}
      {optional ? (
        <span className="text-xs text-gray-500">(Optional)</span>
      ) : (
        ""
      )}
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
          {error && (
            <p className="mt-1 text-xs text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  </div>
);

interface OnDemandFormData {
  brokerage: string;
  order_number: string;
  address_id: string;
  delivery_address_id: string;
  date: string;
  pickup_time: string;
  arrival_time: string;
  complete_time?: string;
  client_attention: string;
  pickup_notes?: string;
  special_notes?: string;
  order_total: string;
  tip?: string;
  item_delivered: string;
  vehicle_type: "Car" | "Van" | "Truck";
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  address: {
    id: string;
    street1: string;
    street2?: string | null;
    city: string;
    state: string;
    zip: string;
  };
  delivery_address: {
    id: string;
    street1: string;
    street2?: string | null;
    city: string;
    state: string;
    zip: string;
  };
}

const OnDemandOrderForm: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [supabase, setSupabase] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      const client = await createClient();
      setSupabase(client);
    };
    
    initSupabase();
  }, []);
  
  useEffect(() => {
    if (!supabase) return;
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );
    
    // Clean up subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<OnDemandFormData>({
    defaultValues: {
      brokerage: "",
      order_number: "",
      date: "",
      pickup_time: "",
      arrival_time: "",
      complete_time: "",
      client_attention: "",
      pickup_notes: "",
      special_notes: "",
      order_total: "",
      tip: "",
      item_delivered: "",
      vehicle_type: "Car",
      length: "",
      width: "",
      height: "",
      weight: "",
      address: {
        id: "",
        street1: "",
        street2: null,
        city: "",
        state: "",
        zip: "",
      },
      delivery_address: {
        id: "",
        street1: "",
        street2: null,
        city: "",
        state: "",
        zip: "",
      },
    },
  });
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleAddressesLoaded = useCallback((loadedAddresses: Address[]) => {
    setAddresses(loadedAddresses);
  }, []);
  
  const onSubmit = async (data: OnDemandFormData) => {
    if (!user?.id) {
      console.error("User not authenticated");
      return;
    }
    
    if (!data.address) {
      console.error("Pickup address not selected");
      toast.error("Please select a pickup address");
      return;
    }
    
    if (!data.delivery_address) {
      console.error("Delivery address not selected for on-demand order");
      toast.error("Please select a delivery address for on-demand order");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const endpoint = "/api/orders";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          order_type: "on_demand",
          address: {
            id: data.address.id,
            street1: data.address.street1,
            street2: data.address.street2,
            city: data.address.city,
            state: data.address.state,
            zip: data.address.zip,
          },
          delivery_address: {
            id: data.delivery_address.id,
            street1: data.delivery_address.street1,
            street2: data.delivery_address.street2,
            city: data.delivery_address.city,
            state: data.delivery_address.state,
            zip: data.delivery_address.zip,
          },
          tip: data.tip ? parseFloat(data.tip) : undefined,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        reset();
        toast.success("On-demand request submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to create on-demand request", errorData);
        
        if (errorData.message === "Order number already exists") {
          setErrorMessage(
            "This order number already exists. Please use a different order number.",
          );
        } else {
          toast.error("Failed to submit on-demand request. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {errorMessage && (
        <div className="mb-6 flex items-center rounded-md bg-red-50 p-4 text-red-800">
          <AlertCircle className="mr-2 h-5 w-5" />
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Pickup Location</h3>
        <div className="rounded-md bg-gray-50 p-4">
          <AddressManager
            onAddressesLoaded={handleAddressesLoaded}
            onAddressSelected={(addressId) => {
              const selectedAddress = addresses.find(
                (addr) => addr.id === addressId,
              );
              if (selectedAddress) {
                setValue("address", {
                  id: selectedAddress.id,
                  street1: selectedAddress.street1,
                  street2: selectedAddress.street2 || null,
                  city: selectedAddress.city,
                  state: selectedAddress.state,
                  zip: selectedAddress.zip,
                });
              }
            }}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Delivery Location</h3>
        <div className="rounded-md bg-gray-50 p-4">
          <AddressManager
            onAddressesLoaded={handleAddressesLoaded}
            onAddressSelected={(addressId) => {
              const selectedAddress = addresses.find(
                (addr) => addr.id === addressId,
              );
              if (selectedAddress) {
                setValue("delivery_address", {
                  id: selectedAddress.id,
                  street1: selectedAddress.street1,
                  street2: selectedAddress.street2 || null,
                  city: selectedAddress.city,
                  state: selectedAddress.state,
                  zip: selectedAddress.zip,
                });
              }
            }}
            showFilters={false}
            showManagementButtons={false}
          />
        </div>
      </div>
      
      <div className="mb-8 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <SelectField
          control={control}
          name="brokerage"
          label="Brokerage / Direct"
          required
          icon={<Clipboard size={16} />}
          options={[
            { value: "doordash", label: "DoorDash" },
            { value: "ubereats", label: "UberEats" },
            { value: "postmates", label: "Postmates" },
            { value: "grubhub", label: "GrubHub" },
            { value: "direct", label: "Direct" },
          ]}
        />
        
        <InputField
          control={control}
          name="order_number"
          label="Order Number"
          required
          icon={<Clipboard size={16} />}
          placeholder="e.g., ORD-12345"
        />
      </div>
      
      <div className="mb-8 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
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
          name="pickup_time"
          label="Pickup Time"
          type="time"
          required
          icon={<Clock size={16} />}
        />
      </div>
      
      <div className="mb-8 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
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
          name="client_attention"
          label="Client Attention"
          required
          icon={<Users size={16} />}
          placeholder="Client or Recipient Name"
        />
      </div>
      
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Order Details</h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <InputField
            control={control}
            name="item_delivered"
            label="Item Being Delivered"
            required
            icon={<Package size={16} />}
          />
          
          <SelectField
            control={control}
            name="vehicle_type"
            label="Vehicle Type"
            required
            icon={<Truck size={16} />}
            options={[
              { value: "Car", label: "Car" },
              { value: "Van", label: "Van" },
              { value: "Truck", label: "Truck" },
            ]}
          />
        </div>
      </div>
      
      <div className="mb-8 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <InputField
          control={control}
          name="order_total"
          label="Order Total"
          type="number"
          required
          icon={<DollarSign size={16} />}
          placeholder="0.00"
        />
        
        <InputField
          control={control}
          name="tip"
          label="Tip"
          type="number"
          optional
          icon={<DollarSign size={16} />}
          placeholder="0.00"
        />
      </div>
      
      <div className="mb-8">
        <InputField
          control={control}
          name="pickup_notes"
          label="Pickup Notes"
          type="textarea"
          optional
          placeholder="Any special instructions for pickup"
        />
      </div>
      
      <div className="mb-8">
        <InputField
          control={control}
          name="special_notes"
          label="Special Notes"
          type="textarea"
          optional
          placeholder="Any special delivery instructions or requirements"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit Request"
          )}
        </button>
      </div>
    </form>
  );
};

export default OnDemandOrderForm;