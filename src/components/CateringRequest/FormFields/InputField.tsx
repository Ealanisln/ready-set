// components/FormFields/InputField.tsx
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  type?: string;
  rules?: object;
  required?: boolean;
  optional?: boolean;
  rows?: number;
}

export const InputField = <T extends FieldValues>({
  name,
  label,
  control,
  type = 'text',
  rules = {},
  required = false,
  optional = false,
  rows,
}: InputFieldProps<T>) => {
  const Component = type === 'textarea' ? 'textarea' : 'input';
  
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
        {label} {optional && '(optional)'}
      </label>
      <Controller
        name={name}
        control={control}
        rules={required ? { required: `${label} is required` } : rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <Component
              {...field}
              type={type}
              rows={rows}
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            {error && <span className="text-sm text-red-500">{error.message}</span>}
          </>
        )}
      />
    </div>
  );
};