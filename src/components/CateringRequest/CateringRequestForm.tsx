// components/CateringForm/CateringRequestForm.tsx
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import AddressManager from "../AddressManager";
import { InputField } from "./FormFields/InputField";
import { SelectField } from "./FormFields/SelectField";
import { HostSection } from "./HostSection";
import { AddressSection } from "./AddressSection";
import { CateringFormData, Address } from "@/types/catering";

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

const CateringRequestForm: React.FC = () => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, watch, setValue, reset } =
    useForm<CateringFormData>({
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

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddressesLoaded = useCallback((loadedAddresses: Address[]) => {
    setAddresses(loadedAddresses);
  }, []);

  const needHost = watch("need_host");

  const onSubmit = async (data: CateringFormData) => {

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
        }),
      });


      if (response.ok) {
        reset();
        toast.success("Catering request submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("API error:", errorData);

        if (errorData.message === "Order number already exists") {
          setErrorMessage(
            "This order number already exists. Please use a different order number.",
          );
        } else {
          toast.error("Failed to submit catering request. Please try again.");
        }
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
