// src/components/Logistics/QuoteRequest/Quotes/Form/DeliveryQuestions.tsx

import { UseFormRegister } from "react-hook-form";

interface RegisterProps {
  register: UseFormRegister<any>;
}

export const DeliveryQuestions = ({ register }: RegisterProps) => (
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
      {...register("partnerServices")}
      className="w-full rounded border p-2"
      placeholder="Are you partnered with any specific services?"
    />
    <input
      {...register("routingApp")}
      className="w-full rounded border p-2"
      placeholder="Do you use your own routing application?"
    />
    <input
      {...register("deliveryRadius")}
      className="w-full rounded border p-2"
      placeholder="What delivery radius or areas do you want to cover from your store?"
    />
  </div>
);
