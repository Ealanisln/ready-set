import { UseFormRegister } from "react-hook-form";
import { RadioGroup } from "./RadioGroup";

interface RegisterProps {
  register: UseFormRegister<any>;
}

export const DeliveryFrequency = ({ register }: RegisterProps) => {
  const options = [
    { value: "none", label: "None" },
    { value: "0-24", label: "0-24" },
    { value: "25-100", label: "25-100" },
    { value: "101-250", label: "101-250" },
    { value: "251-500", label: "251-500" },
    { value: "500+", label: "500+" },
  ];

  return (
    <RadioGroup
      register={register}
      name="deliveryFrequency"
      options={options}
      title="Frequency of Deliveries per day"
    />
  );
};
