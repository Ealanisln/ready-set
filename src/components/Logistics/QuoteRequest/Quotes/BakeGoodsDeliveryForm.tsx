import { useForm } from "react-hook-form";
import { DeliveryForm } from "./Form/DeliveryForm";
import { DeliveryQuestions } from "./Form/DeliveryQuestions";
import { VendorInfoFields } from "./Form/VendorInfoFields";
import { CheckboxGroup } from "./Form/CheckboxGroup";
import { CountiesSelection } from "./Form/CountiesSelection";
import { DeliveryFrequency } from "./Form/DeliveryFrequency";
import { SupplyPickupFrequency } from "./Form/SupplyPickupFrequency";
import { BakeryFormData } from "../types";

export const BakeGoodsDeliveryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const deliveryTypeOptions = [
    {
      value: "bakedGoods",
      label: "Baked Goods to Your Client",
      description: "Bake goods delivered directly to your client's location",
    },
    {
      value: "supplies",
      label: "Supplies to Your Store",
      description:
        "Includes a variety of items needed for your inventory, such as ingredients, equipment and tools, packaging supplies, etc.",
    },
  ];

  return (
    <DeliveryForm title="Bake Goods Delivery Questionnaire" formType="bakery">
      <DeliveryQuestions register={register} />
      <VendorInfoFields register={register} />
      <CheckboxGroup
        register={register}
        name="deliveryTypes"
        options={deliveryTypeOptions}
        title="Please select the types of deliveries needed for your Bakery Shop"
      />
      <CountiesSelection register={register} />
      <DeliveryFrequency register={register} />
      <SupplyPickupFrequency register={register} />
    </DeliveryForm>
  );
};
