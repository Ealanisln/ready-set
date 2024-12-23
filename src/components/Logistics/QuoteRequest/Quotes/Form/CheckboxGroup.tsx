import { UseFormRegister } from "react-hook-form";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface CheckboxGroupProps {
  register: UseFormRegister<any>;
  name: string;
  options: Option[];
  title: string;
  required?: boolean;
}

export const CheckboxGroup = ({
  register,
  name,
  options,
  title,
  required
}: CheckboxGroupProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{title}</h3>
      <div className="space-y-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-start space-x-3">
            <input
              type="checkbox"
              value={option.value}
              {...register(name, { required: required })}
              className="mt-1"
            />
            <div>
              <p className="font-medium">{option.label}</p>
              {option.description && (
                <p className="text-sm text-gray-500">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};