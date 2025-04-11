// src/components/CateringRequest/CateringOrderForm.tsx as reference

import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AddressManager from "@/components/AddressManager";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient, User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { Address } from "@/types/address";
import { CateringRequest, OnDemand, CateringNeedHost, VehicleType, OrderType } from "@/types/order";
import { CateringFormData } from "@/types/catering";

interface FormData {
  eventName: string;
  eventDate: string;
  eventTime: string;
  guests: number;
  budget: number;
  specialInstructions: string;
  addressId: string;
}

const CateringOrderForm: React.FC = () => {
  // 1. Set up state with proper types
  const [user, setUser] = useState<User | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. Initialize the Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = await createClient();
        setSupabase(client);
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
        toast.error("Error connecting to the database. Please try again later.");
        setIsLoading(false);
      }
    };

    initSupabase();
  }, []);
  
  // 3. Add useEffect hook for authentication that depends on supabase being initialized
  useEffect(() => {
    if (!supabase) return;
    
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
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

  const handleDateTimeChange = (date: string, time: string) => {
    if (!date || !time) return "";
    return `${date}T${time}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      eventName: "",
      eventDate: "",
      eventTime: "",
      guests: 1,
      budget: 0,
      specialInstructions: "",
      addressId: "",
    },
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddressSelect = (addressId: string) => {
    setValue("addressId", addressId);
  };

  const handleAddressesLoaded = (addresses: Address[]) => {
    setAddresses(addresses);
  };

  const onSubmit = async (data: FormData) => {
    if (!user?.id) {
      console.error("User not authenticated");
      return;
    }
    if (!data.addressId) {
      console.error("Address not selected");
      toast.error("Please select an address");
      return;
    }

    try {
      const endpoint = "/api/orders";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_type: "catering" as OrderType,
          userId: user.id,
          addressId: data.addressId,
          eventName: data.eventName,
          eventDate: data.eventDate,
          eventTime: data.eventTime,
          guests: data.guests,
          budget: data.budget,
          specialInstructions: data.specialInstructions,
          status: "ACTIVE",
        }),
      });

      if (response.ok) {
        setValue("eventName", "");
        setValue("eventDate", "");
        setValue("eventTime", "");
        setValue("guests", 1);
        setValue("budget", 0);
        setValue("specialInstructions", "");
        setValue("addressId", "");
        toast.success("Catering request submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to create catering request", errorData);

        if (errorData.message === "Order number already exists") {
          setErrorMessage("This order number already exists. Please use a different order number.");
        } else {
          toast.error("Failed to submit catering request. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Show loading indicator while Supabase is initializing
  if (isLoading) return <div>Loading...</div>;
  
  // Show sign in message if user is not authenticated
  if (!user) return <div>Please sign in to create orders.</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="eventName">Event Name</Label>
          <Input
            id="eventName"
            {...register("eventName", {
              required: "Event name is required",
              minLength: {
                value: 3,
                message: "Event name must be at least 3 characters"
              }
            })}
            placeholder="Enter event name"
          />
          {errors.eventName && (
            <p className="text-sm text-red-500 mt-1">{errors.eventName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="eventDate">Event Date</Label>
          <Input
            id="eventDate"
            type="date"
            {...register("eventDate", {
              required: "Event date is required",
              validate: {
                futureDate: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return selectedDate >= today || "Event date must be in the future";
                }
              }
            })}
          />
          {errors.eventDate && (
            <p className="text-sm text-red-500 mt-1">{errors.eventDate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="eventTime">Event Time</Label>
          <Input
            id="eventTime"
            type="time"
            {...register("eventTime", {
              required: "Event time is required"
            })}
          />
          {errors.eventTime && (
            <p className="text-sm text-red-500 mt-1">{errors.eventTime.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="guests">Number of Guests</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            {...register("guests", {
              required: "Number of guests is required",
              min: {
                value: 1,
                message: "Must have at least 1 guest"
              },
              max: {
                value: 1000,
                message: "Maximum 1000 guests allowed"
              }
            })}
          />
          {errors.guests && (
            <p className="text-sm text-red-500 mt-1">{errors.guests.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="budget">Budget (USD)</Label>
          <Input
            id="budget"
            type="number"
            min="0"
            step="0.01"
            {...register("budget", {
              required: "Budget is required",
              min: {
                value: 0,
                message: "Budget must be a positive number"
              }
            })}
          />
          {errors.budget && (
            <p className="text-sm text-red-500 mt-1">{errors.budget.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="specialInstructions">Special Instructions</Label>
          <Textarea
            id="specialInstructions"
            {...register("specialInstructions")}
            placeholder="Any special requirements or preferences?"
            rows={4}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Event Location</Label>
        <AddressManager
          onAddressSelected={handleAddressSelect}
          onAddressesLoaded={handleAddressesLoaded}
          defaultFilter="all"
        />
        {errors.addressId && (
          <p className="text-sm text-red-500 mt-1">{errors.addressId.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
};

export default CateringOrderForm;