import { UseFormRegister } from "react-hook-form";

interface RegisterProps {
  register: UseFormRegister<any>;
}

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps extends RegisterProps {
  name: string;
  options: RadioOption[];
  title?: string;
}

export const RadioGroup = ({
  register,
  name,
  options,
  title,
}: RadioGroupProps) => (
  <div className="space-y-4">
    {title && <h3 className="font-medium">{title}</h3>}
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input type="radio" {...register(name)} value={option.value} />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);
