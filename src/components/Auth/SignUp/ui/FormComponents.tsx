"use client";

// FormComponents.tsx
import React, { forwardRef } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface CheckboxGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: readonly Option[];
  label: string;
}

export const CheckboxGroup = forwardRef<
  HTMLInputElement,
  CheckboxGroupProps<any>
>((props, ref) => {
  const { name, control, options, label } = props;
  return (
    <div>
      <h3 className="mb-2 font-semibold">{label}</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  ref={ref}
                  type="checkbox"
                  id={`${name}-${option.value}`}
                  value={option.value}
                  checked={(field.value as string[])?.includes(option.value)}
                  onChange={(e) => {
                    const updatedValue = e.target.checked
                      ? [...(field.value || []), option.value]
                      : (field.value as string[])?.filter(
                          (v) => v !== option.value,
                        );
                    field.onChange(updatedValue);
                  }}
                  className="mr-2"
                />
              )}
            />
            <label htmlFor={`${name}-${option.value}`}>{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
});

CheckboxGroup.displayName = "CheckboxGroup";

interface RadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: readonly Option[];
  label: string;
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps<any>>(
  (props, ref) => {
    const { name, control, options, label } = props;
    return (
      <div>
        <h3 className="mb-2 font-semibold">{label}</h3>
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    ref={ref}
                    type="radio"
                    id={`${name}-${option.value}`}
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    className="mr-2"
                  />
                )}
              />
              <label htmlFor={`${name}-${option.value}`}>{option.label}</label>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
