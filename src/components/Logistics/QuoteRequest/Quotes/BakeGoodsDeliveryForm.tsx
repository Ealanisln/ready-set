import { useForm } from "react-hook-form";
import { DeliveryForm } from "./Form/DeliveryForm";
import { VendorInfoFields } from "./Form/VendorInfoFields";
import { CountiesSelection } from "./Form/CountiesSelection";
import { CheckboxGroup } from "./Form/CheckboxGroup";
import { BakeryFormData, DeliveryFormData } from "../types";
import { Button } from "@/components/ui/button";

interface BakeGoodsDeliveryFormProps {
  onSubmit: (formData: DeliveryFormData) => Promise<void>;
}

export const BakeGoodsDeliveryForm = ({ onSubmit }: BakeGoodsDeliveryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BakeryFormData>({
    defaultValues: {
      formType: "bakery",
      deliveryTypes: [],
      selectedCounties: [],
      partnerServices: "",
      routingApp: "",
      deliveryFrequency: "",
      supplyPickupFrequency: "",
    },
  });

  const onSubmitHandler = async (data: BakeryFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const deliveryTypeOptions = [
    {
      value: "bakedGoods",
      label: "Baked Goods to Your Client",
      description: "Baked goods delivered directly to your client's location",
    },
    {
      value: "supplies",
      label: "Supplies to Your Store",
      description:
        "Includes a variety of items needed for your inventory, such as ingredients, equipment and tools, packaging supplies, etc.",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <DeliveryForm title="Bake Goods Delivery Questionnaire">
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
            {...register("deliveryRadius", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="What delivery radius or areas do you want to cover from your store?"
          />
          {errors.deliveryRadius && (
            <p className="text-sm text-red-500">{errors.deliveryRadius.message}</p>
          )}

          <input
            {...register("deliveryFrequency", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="How frequently do you need deliveries?"
          />
          {errors.deliveryFrequency && (
            <p className="text-sm text-red-500">{errors.deliveryFrequency.message}</p>
          )}

          <input
            {...register("supplyPickupFrequency", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="How frequently do you need supply pickups?"
          />
          {errors.supplyPickupFrequency && (
            <p className="text-sm text-red-500">{errors.supplyPickupFrequency.message}</p>
          )}

          <input
            {...register("partnerServices", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="What delivery services are you currently partnered with?"
          />
          {errors.partnerServices && (
            <p className="text-sm text-red-500">{errors.partnerServices.message}</p>
          )}

          <input
            {...register("routingApp", { required: "This field is required" })}
            className="w-full rounded border p-2"
            placeholder="What routing app do you currently use?"
          />
          {errors.routingApp && (
            <p className="text-sm text-red-500">{errors.routingApp.message}</p>
          )}
        </div>

        <VendorInfoFields register={register} />
        <CountiesSelection register={register} />
        
        <CheckboxGroup
          register={register}
          name="deliveryTypes"
          options={deliveryTypeOptions}
          title="Please select the types of deliveries needed for your Bakery Shop"
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