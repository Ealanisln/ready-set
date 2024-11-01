import { CateringFormData } from "@/types/catering";
import { Control } from "react-hook-form";
import { InputField } from "./FormFields/InputField";

// components/CateringForm/HostSection.tsx
interface HostSectionProps {
    control: Control<CateringFormData>;
    needHost: string;
  }
  
  export const HostSection: React.FC<HostSectionProps> = ({ control, needHost }) => {
    if (needHost !== 'yes') return null;
  
    return (
      <>
        <InputField
          control={control}
          name="hours_needed"
          label="Hours Needed"
          type="number"
          required
          rules={{
            max: { value: 24, message: "Maximum 24 hours" }
          }}
        />
        <InputField
          control={control}
          name="number_of_host"
          label="How many Hosts do you need?"
          type="number"
          required
          rules={{
            max: { value: 10, message: "Maximum 10 hosts" }
          }}
        />
      </>
    );
  };