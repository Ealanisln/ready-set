import { UseFormRegister } from "react-hook-form";

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface RegisterProps {
  register: UseFormRegister<any>;
}

interface CheckboxGroupProps extends RegisterProps {
  name: string;
  options: CheckboxOption[];
  title?: string;
}

export const CheckboxGroup = ({
  register,
  name,
  options,
  title,
}: CheckboxGroupProps) => (
  <div className="space-y-4">
    {title && <h3 className="font-medium">{title}</h3>}
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input type="checkbox" {...register(`${name}.${option.value}`)} />
          <div>
            <span className="font-medium">{option.label}</span>
            {option.description && (
              <p className="text-sm text-gray-600">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  </div>
);
