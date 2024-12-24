// src/components/Logistics/QuoteRequest/Quotes/FlowerDeliveryForm.tsx

import { useForm } from "react-hook-form";
import { DeliveryForm } from "./Form/DeliveryForm";
import { DeliveryQuestions } from "./Form/DeliveryQuestions";
import { VendorInfoFields } from "./Form/VendorInfoFields";
import { CheckboxGroup } from "./Form/CheckboxGroup";
import { CountiesSelection } from "./Form/CountiesSelection";
import { DeliveryFrequency } from "./Form/DeliveryFrequency";
import { SupplyPickupFrequency } from "./Form/SupplyPickupFrequency";
import { FlowerFormData } from "../types";

export const FlowerDeliveryForm = () => {
  const { register } = useForm<FlowerFormData>();
  
    const deliveryTypeOptions = [
      {
        value: 'floralArrangements',
        label: 'Floral Arrangements to Your Client',
        description: 'Floral arrangements delivered directly to your client\'s location'
      },
      {
        value: 'floralSupplies',
        label: 'Floral Supplies to Your Store',
        description: 'Includes a variety of items needed for your inventory, such as flowers, vases, plants, plant food, etc.'
      }
    ];
  
    const brokerageOptions = [
      { value: 'none', label: 'None' },
      { value: 'dove', label: 'Dove / Teleflora' },
      { value: 'ftd', label: 'FTD' },
      { value: 'flowerShop', label: 'Flower Shop Network' },
      { value: 'lovingly', label: 'Lovingly' },
      { value: 'other', label: 'Other' },
      { value: 'bloomlink', label: 'Bloom Link' },
      { value: 'florist', label: 'Florist' },
      { value: 'bloomNation', label: 'Bloom Nation' }
    ];
  
    return (
      <DeliveryForm title="Flower Delivery Questionnaire" formType="flower">
        <DeliveryQuestions register={register} />
        <VendorInfoFields register={register} />
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
        <CountiesSelection register={register} />
        <DeliveryFrequency register={register} />
        <SupplyPickupFrequency register={register} />
      </DeliveryForm>
    );
  }