import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorSchema } from "@/components/Auth/SignUp/FormSchemas";
import CommonFields from "../CommonFields";
import {
  COUNTIES,
  TIME_NEEDED,
  CATERING_BROKERAGE,
  FREQUENCY,
  PROVISIONS,
  VendorFormData,
} from "./FormData";
import { CheckboxGroup, RadioGroup } from "./FormComponents";

interface VendorFormProps {
  onSubmit: (data: VendorFormData) => Promise<void>;
}

const VendorForm: React.FC<VendorFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      userType: "vendor",
      contact_name: "",
      countiesServed: [],
      timeNeeded: [],
      cateringBrokerage: [],
      frequency: undefined,
      provisions: [],
    },
  });

  const onSubmitWrapper = async (data: VendorFormData) => {

    Object.entries(data).forEach(([key, value]) => {
    });

    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWrapper)}>
    <input type="hidden" {...register("userType")} value="vendor" />

    {currentStep === 1 && (
      <>
        <CommonFields<VendorFormData> register={register} errors={errors} />
        <input
          {...register("parking")}
          placeholder="Parking / Loading (Optional)"
          className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
        />
        {errors.parking && (
          <p className="mb-4 text-red-500">{errors.parking.message as string}</p>
        )}
        <div className="pt-6">
          <button
            type="button"
            onClick={handleNext}
            className="hover:bg-primary-dark w-full rounded-md bg-primary px-5 py-3 text-base font-semibold text-white transition"
          >
            Next
          </button>
        </div>
      </>
    )}

    {currentStep === 2 && (
      <>
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
          required
          className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
        />

      <input
        {...register("contact_name")}
        placeholder="Contact Name"
        required
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />

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
            label="Counties Served"
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

        <div>
          <CheckboxGroup
            name="cateringBrokerage"
            control={control}
            options={CATERING_BROKERAGE}
            label="Catering Brokerage"
          />
          {errors.cateringBrokerage && (
            <p className="mt-2 text-red-500">
              {errors.cateringBrokerage.message}
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
          <div className="pt-6 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              className="hover:bg-gray-300 w-1/2 mr-2 rounded-md bg-gray-200 px-5 py-3 text-base font-semibold text-gray-700 transition"
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="hover:bg-primary-dark w-1/2 rounded-md bg-primary px-5 py-3 text-base font-semibold text-white transition disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "Register as Vendor"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default VendorForm;