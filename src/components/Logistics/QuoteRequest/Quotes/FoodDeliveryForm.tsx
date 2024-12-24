// src/components/Logistics/QuoteRequest/Quotes/FoodDeliveryForm.tsx

import { useForm } from "react-hook-form";
import { DeliveryForm } from "./Form/DeliveryForm";
import { VendorInfoFields } from "./Form/VendorInfoFields";
import { CountiesSelection } from "./Form/CountiesSelection";
import { CheckboxGroup } from "./Form/CheckboxGroup";
import { RadioGroup } from "./Form/RadioGroup";
import { FoodFormData } from "../types";

export const FoodDeliveryForm = () => {
  const { register } = useForm<FoodFormData>();

  const deliveryTimeOptions = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "allDay", label: "All day" },
  ];

  const orderHeadcountOptions = [
    { value: "1-24", label: "1-24" },
    { value: "25-49", label: "25-49" },
    { value: "50-74", label: "50-74" },
    { value: "75-99", label: "75-99" },
    { value: "100-124", label: "100-124" },
    { value: "125-199", label: "125-199" },
    { value: "200-249", label: "200-249" },
    { value: "250-299", label: "250-299" },
    { value: "300plus", label: "300+" },
  ];

  const frequencyOptions = [
    { value: "1-5", label: "1-5 per week" },
    { value: "6-10", label: "6-10 per week" },
    { value: "11-25", label: "11-25 per week" },
    { value: "over25", label: "over 25 per week" },
  ];

  return (
    <DeliveryForm title="Food Delivery Questionnaire" formType="food">
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
          {...register("totalStaff")}
          className="w-full rounded border p-2"
          placeholder="How many total staff do you currently have?"
        />
        <input
          {...register("expectedDeliveries")}
          className="w-full rounded border p-2"
          placeholder="How many deliveries per day are we anticipating?"
        />
        <input
          {...register("partneredServices")}
          className="w-full rounded border p-2"
          placeholder="What services are you partnered with?"
        />
        <input
          {...register("multipleLocations")}
          className="w-full rounded border p-2"
          placeholder="Do you have multiple locations?"
        />
        <input
          {...register("deliveryRadius")}
          className="w-full rounded border p-2"
          placeholder="What delivery radius or areas do you want to cover from your store?"
        />
      </div>
      <VendorInfoFields register={register} />
      <CountiesSelection register={register} />
      <CheckboxGroup
        register={register}
        name="deliveryTimes"
        options={deliveryTimeOptions}
        title="Delivery Times Needed"
      />
      <CheckboxGroup
        register={register}
        name="orderHeadcount"
        options={orderHeadcountOptions}
        title="Order Headcount (Select all that apply)"
      />
      <RadioGroup
        register={register}
        name="frequency"
        options={frequencyOptions}
        title="Frequency"
      />
    </DeliveryForm>
  );
};
