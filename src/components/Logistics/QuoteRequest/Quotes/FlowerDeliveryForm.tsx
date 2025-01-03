import { useForm } from "react-hook-form";
import { DeliveryForm } from "./Form/DeliveryForm";
import { VendorInfoFields } from "./Form/VendorInfoFields";
import { CountiesSelection } from "./Form/CountiesSelection";
import { CheckboxGroup } from "./Form/CheckboxGroup";
import { FlowerFormData, DeliveryFormData } from "../types";
import { Button } from "@/components/ui/button";

interface FlowerDeliveryFormProps {
  onSubmit: (formData: DeliveryFormData) => Promise<void>;
}

export const FlowerDeliveryForm = ({ onSubmit }: FlowerDeliveryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FlowerFormData>({
    defaultValues: {
      formType: "flower",
    },
  });

  const onSubmitHandler = async (data: FlowerFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const deliveryTypeOptions = [
    {
      value: "floralArrangements",
      label: "Floral Arrangements to Your Client",
      description:
        "Floral arrangements delivered directly to your client's location",
    },
    {
      value: "floralSupplies",
      label: "Floral Supplies to Your Store",
      description: "Includes a variety of items needed for your inventory",
    },
  ];

  const brokerageOptions = [
    { value: "none", label: "None" },
    { value: "dove", label: "Dove / Teleflora" },
    { value: "ftd", label: "FTD" },
    { value: "flowerShop", label: "Flower Shop Network" },
    { value: "lovingly", label: "Lovingly" },
    { value: "other", label: "Other" },
    { value: "bloomlink", label: "Bloom Link" },
    { value: "florist", label: "Florist" },
    { value: "bloomNation", label: "Bloom Nation" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <DeliveryForm title="Flower Delivery Questionnaire" formType="flower">
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
        </div>

        <VendorInfoFields register={register} />
        <CountiesSelection register={register} />

        <CheckboxGroup
          register={register}
          name="deliveryTypes"
          options={deliveryTypeOptions}
          title="Please select the types of deliveries needed for your shop"
        />

        <CheckboxGroup
          register={register}
          name="brokerageServices"
          options={brokerageOptions}
          title="Are you partnered with any specific brokerage services?"
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
