"use client";

import React, { useCallback, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useSession } from "next-auth/react";
import AddressManager, { Address } from "../AddressManager";
import toast from "react-hot-toast";

interface FormData {
  brokerage: string;
  order_number: string;
  address_id: string;
  delivery_address_id: string;
  date: string;
  pickup_time: string;
  arrival_time: string;
  complete_time?: string;
  headcount: string;
  need_host: "yes" | "no";
  hours_needed?: string;
  number_of_host?: string;
  client_attention: string;
  pickup_notes?: string;
  special_notes?: string;
  order_total: string;
  tip?: string;
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

const CateringRequestForm: React.FC = () => {
  const { data: session } = useSession();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
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
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const handleAddressesLoaded = useCallback((loadedAddresses: Address[]) => {
    setAddresses(loadedAddresses);
  }, []);

  const handleAddressSelected = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const needHost = watch("need_host");

  const onSubmit = async (data: FormData) => {
    console.log("Submitting data:", data);

    if (!session?.user?.id) {
      console.error("User not authenticated");
      return;
    }
    if (!data.address || !data.delivery_address) {
      console.error("Pickup or delivery address not selected");
      toast.error("Please select both pickup and delivery addresses");
      return;
    }
    try {
      const response = await fetch("/api/catering-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          address_id: data.address.id,
          delivery_address_id: data.delivery_address.id,
          tip: data.tip ? parseFloat(data.tip) : undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Reset the form
        reset({
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
          },
          delivery_address: {
            id: "",
            street1: "",
            street2: null,
            city: "",
            state: "",
            zip: "",
          },
        });

        // Show success notification
        toast.success("Catering request submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to create catering request", errorData);
        toast.error("Failed to submit catering request. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-3xl space-y-6 px-4 py-8"
    >
      <div>
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
        <label
          htmlFor="brokerage"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Brokerage / Direct
        </label>
        <Controller
          name="brokerage"
          control={control}
          rules={{ required: "Brokerage is required" }}
          render={({ field }) => (
            <select
              {...field}
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Please Select</option>
              <option value="Foodee">Foodee</option>
              <option value="Ez Cater">Ez Cater</option>
              <option value="Grubhub">Grubhub</option>
              <option value="Cater Cow">Cater Cow</option>
              <option value="Zero Cater">Zero Cater</option>
              <option value="Platterz">Platterz</option>
              <option value="Direct Delivery">Direct Delivery</option>
              <option value="Other">Other</option>
            </select>
          )}
        />
        {errors.brokerage && (
          <span className="text-sm text-red-500">
            {errors.brokerage.message}
          </span>
        )}
      </div>
      <div>
        <label
          htmlFor="orderNumber"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Order Number
        </label>
        <Controller
          name="order_number"
          control={control}
          rules={{ required: "Order Number is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          )}
        />
        {errors.order_number && (
          <span className="text-sm text-red-500">
            {errors.order_number.message}
          </span>
        )}
      </div>
      <div>
        <label
          htmlFor="date"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <Controller
          name="date"
          control={control}
          rules={{ required: "Date is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="date"
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          )}
        />
        {errors.date && (
          <span className="text-sm text-red-500">{errors.date.message}</span>
        )}
      </div>
      <div>
        <label
          htmlFor="pickUpTime"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Pick Up Time
        </label>
        <Controller
          name="pickup_time"
          control={control}
          rules={{ required: "Pick Up Time is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="time"
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          )}
        />
        {errors.pickup_time && (
          <span className="text-sm text-red-500">
            {errors.pickup_time.message}
          </span>
        )}
      </div>
      <div>
        <label
          htmlFor="arrivalTime"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Arrival Time
        </label>
        <Controller
          name="arrival_time"
          control={control}
          rules={{ required: "Arrival Time is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="time"
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          )}
        />
        {errors.arrival_time && (
          <span className="text-sm text-red-500">
            {errors.arrival_time.message}
          </span>
        )}
      </div>
      <div>
        <label
          htmlFor="completeTime"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Complete Time (optional)
        </label>
        <Controller
          name="complete_time"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="time"
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          )}
        />
      </div>
      <div>
        <label
          htmlFor="headcount"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Headcount
        </label>
        <Controller
          name="headcount"
          control={control}
          rules={{ required: "Headcount is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          )}
        />
        {errors.headcount && (
          <span className="text-sm text-red-500">
            {errors.headcount.message}
          </span>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Do you need a Host?
        </label>
        <Controller
          name="need_host"
          control={control}
          rules={{ required: "Please select if you need a host" }}
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
        {errors.need_host && (
          <span className="text-sm text-red-500">
            {errors.need_host.message}
          </span>
        )}
      </div>

      {needHost === "yes" && (
        <>
          <div>
            <label
              htmlFor="hours_needed"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Hours Needed
            </label>
            <Controller
              name="hours_needed"
              control={control}
              rules={{
                required: "Hours Needed is required",
                max: { value: 24, message: "Maximum 24 hours" },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  max="24"
                  className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              )}
            />
            {errors.hours_needed && (
              <span className="text-sm text-red-500">
                {errors.hours_needed.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="number_of_host"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              How many Host do you need?
            </label>
            <Controller
              name="number_of_host"
              control={control}
              rules={{
                required: "Number of Hosts is required",
                max: { value: 10, message: "Maximum 10 hosts" },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  max="10"
                  className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              )}
            />
            {errors.number_of_host && (
              <span className="text-sm text-red-500">
                {errors.number_of_host.message}
              </span>
            )}
          </div>
        </>
      )}

      <div>
        <label
          htmlFor="clientAttention"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Client / Attention
        </label>
        <Controller
          name="client_attention"
          control={control}
          rules={{ required: "Client / Attention is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          )}
        />
        {errors.client_attention && (
          <span className="text-sm text-red-500">
            {errors.client_attention.message}
          </span>
        )}
      </div>
      <div>
        <label
          htmlFor="address"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Delivery Address
        </label>
        <Controller
          name="delivery_address"
          control={control}
          rules={{ required: "Delivery Address is required" }}
          render={({ field }) => (
            <select
              onChange={(e) => {
                const selectedAddress = addresses.find(
                  (addr) => addr.id === e.target.value,
                );
                if (selectedAddress) {
                  field.onChange({
                    id: selectedAddress.id,
                    street1: selectedAddress.street1,
                    street2: selectedAddress.street2 || null,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    zip: selectedAddress.zip,
                  });
                }
              }}
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select delivery address</option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {`${address.street1}, ${address.city}, ${address.state} ${address.zip}`}
                </option>
              ))}
            </select>
          )}
        />
        {errors.delivery_address && (
          <span className="text-sm text-red-500">
            {errors.delivery_address.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="orderTotal"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Order Total
        </label>
        <Controller
          name="order_total"
          control={control}
          rules={{ required: "Order Total is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              step="0.01"
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          )}
        />
        {errors.order_total && (
          <span className="text-sm text-red-500">
            {errors.order_total.message}
          </span>
        )}
      </div>
      <div>
        <label
          htmlFor="tip"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Tip (optional)
        </label>
        <Controller
          name="tip"
          control={control}
          rules={{
            validate: (value: string | undefined) => {
              if (value === undefined || value === "") return true; // Allow empty or undefined value
              const num = parseFloat(value);
              return (
                (!isNaN(num) && num >= 0) ||
                "Tip must be a positive number or empty"
              );
            },
          }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          )}
        />
        {errors.tip && (
          <span className="text-sm text-red-500">{errors.tip.message}</span>
        )}
      </div>
      <div>
        <label
          htmlFor="pickUpNotes"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Pick Up Notes (optional)
        </label>
        <Controller
          name="pickup_notes"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
              rows={3}
            />
          )}
        />
      </div>
      <div>
        <label
          htmlFor="specialNotes"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Special Notes (optional)
        </label>
        <Controller
          name="special_notes"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
              rows={3}
            />
          )}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 px-6 py-3 text-white transition hover:bg-blue-600"
      >
        Submit Catering Request
      </button>
    </form>
  );
};

export default CateringRequestForm;
