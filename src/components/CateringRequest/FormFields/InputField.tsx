// components/FormFields/InputField.tsx
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ReactNode } from 'react';

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  type?: string;
  rules?: object;
  required?: boolean;
  optional?: boolean;
  rows?: number;
  placeholder?: string;
  icon?: ReactNode;
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
  placeholder,
  icon,
}: InputFieldProps<T>) => {
  return (
    <div className="relative mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
        {label} {optional && <span className="text-xs text-gray-500">(Optional)</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={required ? { required: `${label} is required`, ...rules } : rules}
        render={({ field, fieldState: { error } }) => (
          <div>
            <div className="relative">
              {icon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  {icon}
                </div>
              )}
              {type === 'textarea' ? (
                <textarea
                  {...field}
                  id={name}
                  rows={rows || 3}
                  placeholder={placeholder}
                  className={`w-full rounded-md border ${
                    error ? 'border-red-500' : 'border-gray-300'
                  } ${icon ? 'pl-10' : 'pl-3'} py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                />
              ) : (
                <input
                  {...field}
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  className={`w-full rounded-md border ${
                    error ? 'border-red-500' : 'border-gray-300'
                  } ${icon ? 'pl-10' : 'pl-3'} py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                />
              )}
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
          </div>
        )}
      />
    </div>
  );
};