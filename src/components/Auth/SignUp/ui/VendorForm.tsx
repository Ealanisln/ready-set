import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorSchema, FormData } from "@/components/Auth/SignUp/FormSchemas";
import { z } from "zod";
import CommonFields from "../CommonFields";
import {
  COUNTIES,
  TIME_NEEDED,
  CATERING_BROKERAGE,
  FREQUENCY,
  PROVISIONS,
} from "./FormData";
import { CheckboxGroup, RadioGroup } from "./FormComponents";

interface VendorFormProps {
  onSubmit: (data: FormData) => void;
}

const VendorForm: React.FC<VendorFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      countiesServed: [],
      timeNeeded: [],
      cateringBrokerage: [],
      provisions: [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CommonFields<z.infer<typeof vendorSchema>>
        register={register}
        errors={errors}
      />

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
        {...register("contactname")}
        placeholder="Contact Name"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.contactname && (
        <p className="mb-4 text-red-500">
          {errors.contactname.message as string}
        </p>
      )}

      <div className="space-y-6">
        <div>
          <CheckboxGroup
            name="countiesServed"
            control={control}
            options={COUNTIES}
            label="Counties Served"
          />
          {errors.countiesServed && (
            <p className="mt-2 text-red-500">
              {errors.countiesServed.message as string}
            </p>
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

        <div>
          <CheckboxGroup
            name="cateringBrokerage"
            control={control}
            options={CATERING_BROKERAGE}
            label="Catering Brokerage"
          />
          {errors.cateringBrokerage && (
            <p className="mt-2 text-red-500">
              {errors.cateringBrokerage.message as string}
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

        <div>
          <CheckboxGroup
            name="provisions"
            control={control}
            options={PROVISIONS}
            label="Do you provide"
          />
          {errors.provisions && (
            <p className="mt-2 text-red-500">
              {errors.provisions.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          className="hover:bg-primary-dark w-full rounded-md bg-primary px-5 py-3 text-base font-semibold text-white transition"
        >
          Register as Vendor
        </button>
      </div>
    </form>
  );
};

export default VendorForm;