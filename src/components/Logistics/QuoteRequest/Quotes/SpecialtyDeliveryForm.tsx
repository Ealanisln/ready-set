// src/components/Logistics/QuoteRequest/Quotes/SpecialtyDeliveryForm.tsx

import { useForm } from "react-hook-form";
import { DeliveryForm } from "./Form/DeliveryForm";
import { VendorInfoFields } from "./Form/VendorInfoFields";
import { CheckboxGroup } from "./Form/CheckboxGroup";
import { CountiesSelection } from "./Form/CountiesSelection";
import { DeliveryFrequency } from "./Form/DeliveryFrequency";
import { SupplyPickupFrequency } from "./Form/SupplyPickupFrequency";
import { RadioGroup } from "./Form/RadioGroup";
import { SpecialtyFormData } from "../types";

export const SpecialtyDeliveryForm = () => {
  const { register } = useForm<SpecialtyFormData>();

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
    <DeliveryForm
      title="Specialty Deliveries Questionnaire"
      formType="specialty"
    >
      <div className="space-y-4">
        <input
          {...register("driversNeeded")}
          className="w-full rounded border p-2"
          placeholder="How many days per week do you require drivers?"
        />
        <input
          {...register("serviceType")}
          className="w-full rounded border p-2"
          placeholder="Will this service be seasonal or year-round?"
        />
        <input
          {...register("deliveryRadius")}
          className="w-full rounded border p-2"
          placeholder="What delivery radius or areas do you want to cover from your store?"
        />
      </div>
      <VendorInfoFields register={register} />
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
        title="Fragile Package"
      />
      <CountiesSelection register={register} />
      <DeliveryFrequency register={register} />
      <SupplyPickupFrequency register={register} />
      <div className="space-y-4">
        <h3 className="font-medium">Describe your packages</h3>
        <textarea
          {...register("packageDescription")}
          className="w-full rounded border p-2"
          rows={4}
        />
      </div>
    </DeliveryForm>
  );
};
