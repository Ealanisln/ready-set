import { UseFormRegister } from "react-hook-form";
import { RadioGroup } from "./RadioGroup";

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface RegisterProps {
  register: UseFormRegister<any>;
}

export const SupplyPickupFrequency = ({ register }: RegisterProps) => {
  const options = [
    { value: "none", label: "None" },
    { value: "1-5", label: "1-5" },
    { value: "6-10", label: "6-10" },
    { value: "10+", label: "10+" },
  ];

  return (
    <RadioGroup
      register={register}
      name="supplyPickups"
      options={options}
      title="Supply pick ups in a week"
    />
  );
};
