// src/components/Logistics/QuoteRequest/Quotes/SpecialtyDeliveryForm.tsx

import { useForm } from "react-hook-form";
import { DeliveryForm } from "./Form/DeliveryForm";
import { VendorInfoFields } from "./Form/VendorInfoFields";
import { CheckboxGroup } from "./Form/CheckboxGroup";
import { CountiesSelection } from "./Form/CountiesSelection";
import { RadioGroup } from "./Form/RadioGroup";
import { SpecialtyFormData, DeliveryFormData } from "../types";
import { Button } from "@/components/ui/button";

interface SpecialtyDeliveryFormProps {
  onSubmit: (formData: DeliveryFormData) => Promise<void>;
}
export const SpecialtyDeliveryForm = ({
  onSubmit,
}: SpecialtyDeliveryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SpecialtyFormData>({
    defaultValues: {
      formType: "specialty",
      // Base form fields
      name: "",
      email: "",
      companyName: "",
      contactName: "",
      website: "",
      phone: "",
      pickupAddress: {
        // Changed from flat fields to nested object
        street: "", // Changed from streetAddress to street
        city: "",
        state: "",
        zip: "", // Changed from zipCode to zip
      },
      driversNeeded: "",
      serviceType: "",
      deliveryRadius: "",
      counties: [],

      // Specialty-specific fields
      deliveryTypes: [], // Array<'specialDelivery' | 'specialtyDelivery'>
      fragilePackage: "no", // Default to "no"
      packageDescription: "",
      deliveryFrequency: "",
      supplyPickupFrequency: "",
    },
  });
  const onSubmitHandler = async (data: SpecialtyFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const deliveryTypeOptions = [
    {
      value: "specialDelivery",
      label: "Special Delivery to Your Client",
      description: "Package delivered directly to your client's location",
    },
    {
      value: "specialtyDelivery",
      label: "Specialty Delivery to My Location",
      description:
        "Includes a variety of items needed for your inventory. (Delivery directly to your store location)",
    },
  ];

  const fragileOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <DeliveryForm
        title="Specialty Deliveries Questionnaire"
        formType="specialty"
      >
        <div className="space-y-4">
          <input
            {...register("driversNeeded", {
              required: "This field is required",
            })}
            className="w-full rounded border p-2"
            placeholder="How many days per week do you require drivers?"
          />
          {errors.driversNeeded && (
            <p className="text-sm text-red-500">
              {errors.driversNeeded.message}
            </p>
          )}

          <input
            {...register("serviceType", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="Will this service be seasonal or year-round?"
          />
          {errors.serviceType && (
            <p className="text-sm text-red-500">{errors.serviceType.message}</p>
          )}

          <input
            {...register("deliveryRadius", {
              required: "This field is required",
            })}
            className="w-full rounded border p-2"
            placeholder="What delivery radius or areas do you want to cover from your store?"
          />
          {errors.deliveryRadius && (
            <p className="text-sm text-red-500">
              {errors.deliveryRadius.message}
            </p>
          )}

          <input
            {...register("deliveryFrequency")}
            className="w-full rounded border p-2"
            placeholder="How frequently do you need deliveries? (Optional)"
          />

          <input
            {...register("supplyPickupFrequency")}
            className="w-full rounded border p-2"
            placeholder="How frequently do you need supply pickups? (Optional)"
          />

          <div className="space-y-2">
            <h3 className="font-medium">Describe your packages</h3>
            <textarea
              {...register("packageDescription", {
                required: "This field is required",
              })}
              className="w-full rounded border p-2"
              rows={4}
              placeholder="Please provide details about your packages"
            />
            {errors.packageDescription && (
              <p className="text-sm text-red-500">
                {errors.packageDescription.message}
              </p>
            )}
          </div>
        </div>

        <VendorInfoFields register={register} />
        <CountiesSelection register={register} />

        <CheckboxGroup
          register={register}
          name="deliveryTypes"
          options={deliveryTypeOptions}
          title="Please select the types of deliveries needed for your shop"
        />

        <RadioGroup
          register={register}
          name="fragilePackage"
          options={fragileOptions}
          title="Is this a fragile package?"
        />

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </DeliveryForm>
    </form>
  );
};
