import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "@/components/Auth/SignUp/FormSchemas";
import CommonFields from "../CommonFields";
import {
  COUNTIES,
  TIME_NEEDED,
  FREQUENCY,
  HEAD_COUNT,
  ClientFormData,
} from "./FormData";
import { CheckboxGroup, RadioGroup } from "./FormComponents";

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => Promise<void>;
}

const VendorForm: React.FC<ClientFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      userType: "client",
      countiesServed: [],
      timeNeeded: [],
      frequency: undefined,
      head_count: undefined,
    },
  });

  // Add this wrapper function
  const onSubmitWrapper = async (data: ClientFormData) => {
    Object.entries(data).forEach(([key, value]) => {});

    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWrapper)}>
      <input type="hidden" {...register("userType")} value="client" />
      <CommonFields<ClientFormData> register={register} errors={errors} />
      <input
        {...register("parking")}
        placeholder="Parking / Loading (Optional)"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.parking && (
        <p className="mb-4 text-red-500">{errors.parking.message as string}</p>
      )}

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 flex-shrink text-gray-600">
          Additional Information
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <input
        {...register("company")}
        placeholder="Company Name"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.company && (
        <p className="mb-4 text-red-500">{errors.company.message as string}</p>
      )}

      <input
        {...register("contact_name")}
        placeholder="Contact Name"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.contact_name && (
        <p className="mb-4 text-red-500">
          {errors.contact_name.message as string}
        </p>
      )}

      <input
        {...register("website")}
        placeholder="Website (Optional)"
        type="url"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.website && (
        <p className="mb-4 text-red-500">{errors.website.message as string}</p>
      )}

      <div className="space-y-6">
        <div>
          <CheckboxGroup
            name="countiesServed"
            control={control}
            options={COUNTIES}
            label="County location"
          />
          {errors.countiesServed && (
            <p className="mt-2 text-red-500">{errors.countiesServed.message}</p>
          )}
        </div>

        <div>
          <CheckboxGroup
            name="timeNeeded"
            control={control}
            options={TIME_NEEDED}
            label="Time Needed"
          />
          {errors.timeNeeded && (
            <p className="mt-2 text-red-500">
              {errors.timeNeeded.message as string}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="headcount"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Headcount
          </label>
          <Controller
            name="head_count"
            control={control}
            rules={{ required: "Please select a headcount" }}
            render={({ field }) => (
              <>
                <RadioGroup
                  {...field}
                  control={control}
                  options={HEAD_COUNT}
                  label="Headcount"
                />
                {errors.head_count && (
                  <p className="mt-2 text-red-500">
                    {errors.head_count.message}
                  </p>
                )}
              </>
            )}
          />
          {errors.head_count && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              {errors.head_count.message as string}
            </p>
          )}
        </div>

        <div>
          <RadioGroup
            name="frequency"
            control={control}
            options={FREQUENCY}
            label="Frequency"
          />
          {errors.frequency && (
            <p className="mt-2 text-red-500">
              {errors.frequency.message as string}
            </p>
          )}
        </div>
      </div>
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 text-red-500">
          <p>Please correct the following errors:</p>
          <ul>
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="hover:bg-primary-dark w-full rounded-md bg-primary px-5 py-3 text-base font-semibold text-white transition disabled:opacity-50"
        >
          {isLoading ? "Registering..." : "Register as Client"}
        </button>
      </div>
    </form>
  );
};

export default VendorForm;
