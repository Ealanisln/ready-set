import { Control, Controller, FieldValues, Path } from "react-hook-form";

// components/FormFields/SelectField.tsx
interface SelectFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    control: Control<T>;
    options: { value: string; label: string }[];
    rules?: object;
    required?: boolean;
  }
  
  export const SelectField = <T extends FieldValues>({
    name,
    label,
    control,
    options,
    rules = {},
    required = false,
  }: SelectFieldProps<T>) => {
    return (
      <div>
        <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
        <Controller
          name={name}
          control={control}
          rules={required ? { required: `${label} is required` } : rules}
          render={({ field, fieldState: { error } }) => (
            <>
              <select
                {...field}
                className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Please Select</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {error && <span className="text-sm text-red-500">{error.message}</span>}
            </>
          )}
        />
      </div>
    );
  };
  