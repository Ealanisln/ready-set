// In a new file, e.g., FormComponents.tsx
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface CheckboxGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: readonly string[]; // Change this line
  label: string;
}


export function CheckboxGroup<T extends FieldValues>({ name, control, options, label }: CheckboxGroupProps<T>) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">{label}</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id={`${name}-${option}`}
                  value={option}
                  checked={(field.value as string[]).includes(option)}
                  onChange={(e) => {
                    const updatedValue = e.target.checked
                      ? [...field.value, option]
                      : (field.value as string[]).filter((v) => v !== option);
                    field.onChange(updatedValue);
                  }}
                  className="mr-2"
                />
              )}
            />
            <label htmlFor={`${name}-${option}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: readonly string[];
  label: string;
}

export function RadioGroup<T extends FieldValues>({ name, control, options, label }: RadioGroupProps<T>) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">{label}</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <input
                  type="radio"
                  id={`${name}-${option}`}
                  value={option}
                  checked={field.value === option}
                  onChange={() => field.onChange(option)}
                  className="mr-2"
                />
              )}
            />
            <label htmlFor={`${name}-${option}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}