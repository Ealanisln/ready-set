import { useForm } from "react-hook-form";
import { DeliveryForm } from "./Form/DeliveryForm";
import { VendorInfoFields } from "./Form/VendorInfoFields";
import { CountiesSelection } from "./Form/CountiesSelection";
import { CheckboxGroup } from "./Form/CheckboxGroup";
import { RadioGroup } from "./Form/RadioGroup";
import { FoodFormData, DeliveryFormData } from "../types";
import { Button } from "@/components/ui/button";

interface FoodDeliveryFormProps {
  onSubmit: (formData: DeliveryFormData) => Promise<void>;
}

export const FoodDeliveryForm = ({ onSubmit }: FoodDeliveryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FoodFormData>({
    defaultValues: {
      formType: 'food'
    }
  });

  const onSubmitHandler = async (data: FoodFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

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
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <DeliveryForm title="Food Delivery Questionnaire" formType="food">
        <div className="space-y-4">
          <input
            {...register("driversNeeded", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="How many days per week do you require drivers?"
          />
          {errors.driversNeeded && (
            <p className="text-sm text-red-500">{errors.driversNeeded.message}</p>
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
            {...register("totalStaff", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="How many total staff do you currently have?"
          />
          {errors.totalStaff && (
            <p className="text-sm text-red-500">{errors.totalStaff.message}</p>
          )}

          <input
            {...register("expectedDeliveries", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="How many deliveries per day are we anticipating?"
          />
          {errors.expectedDeliveries && (
            <p className="text-sm text-red-500">{errors.expectedDeliveries.message}</p>
          )}

          <input
            {...register("partneredServices")}
            className="w-full rounded border p-2"
            placeholder="What services are you partnered with?"
          />

          <input
            {...register("multipleLocations", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="Do you have multiple locations?"
          />
          {errors.multipleLocations && (
            <p className="text-sm text-red-500">{errors.multipleLocations.message}</p>
          )}

          <input
            {...register("deliveryRadius", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="What delivery radius or areas do you want to cover from your store?"
          />
          {errors.deliveryRadius && (
            <p className="text-sm text-red-500">{errors.deliveryRadius.message}</p>
          )}
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