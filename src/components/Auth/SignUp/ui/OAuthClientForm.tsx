// app/complete-profile/OAuthClientForm.tsx
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  COUNTIES,
  TIME_NEEDED,
  CATERING_BROKERAGE,
  FREQUENCY,
  PROVISIONS,
  HEAD_COUNT,
} from "@/components/Auth/SignUp/ui/FormData";
import { CheckboxGroup, RadioGroup } from "./FormComponents";

// Create a modified schema for OAuth users (no email/password fields)
const oauthClientSchema = z.object({
  userType: z.literal("client"),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  parking: z.string().optional(),
  company: z.string().min(1, "Company name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  phone: z.string().min(10, "Phone number is required"),
  website: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0))
    .optional(),
  countiesServed: z
    .array(z.string())
    .min(1, "Please select at least one county"),
  timeNeeded: z.array(z.string()).min(1, "Please select at least one time"),
  frequency: z.string().min(1, "Please select a frequency"),
  head_count: z.string().min(1, "Please select a headcount"),
});

type OAuthClientFormData = z.infer<typeof oauthClientSchema>;

interface OAuthClientFormProps {
  onSubmit: (data: OAuthClientFormData) => Promise<void>;
  isLoading?: boolean;
  userData?: any;
}

const OAuthClientForm: React.FC<OAuthClientFormProps> = ({
  onSubmit,
  isLoading = false,
  userData = {},
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OAuthClientFormData>({
    resolver: zodResolver(oauthClientSchema),
    defaultValues: {
      userType: "client",
      contact_name: userData?.full_name || userData?.name || "",
      countiesServed: [],
      timeNeeded: [],
      frequency: undefined,
      head_count: undefined,
    },
  });

  const onSubmitWrapper = async (data: OAuthClientFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });

    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWrapper)}>
      <input type="hidden" {...register("userType")} value="client" />

      {/* Address Fields */}
      <div className="mb-4">
        <input
          {...register("street1")}
          placeholder="Street Address"
          className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
          disabled={isLoading}
        />
        {errors.street1 && (
          <p className="mb-4 text-red-500">{errors.street1.message}</p>
        )}

        <input
          {...register("street2")}
          placeholder="Address Line 2 (Optional)"
          className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
          disabled={isLoading}
        />

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <input
              {...register("city")}
              placeholder="City"
              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
              disabled={isLoading}
            />
            {errors.city && (
              <p className="mt-1 text-red-500">{errors.city.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("state")}
              placeholder="State"
              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
              disabled={isLoading}
            />
            {errors.state && (
              <p className="mt-1 text-red-500">{errors.state.message}</p>
            )}
          </div>
        </div>

        <input
          {...register("zip")}
          placeholder="ZIP Code"
          className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
          disabled={isLoading}
        />
        {errors.zip && (
          <p className="mb-4 text-red-500">{errors.zip.message}</p>
        )}
      </div>

      <input
        {...register("phone")}
        placeholder="Phone Number"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
        disabled={isLoading}
      />
      {errors.phone && (
        <p className="mb-4 text-red-500">{errors.phone.message}</p>
      )}

      <input
        {...register("parking")}
        placeholder="Parking / Loading (Optional)"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.parking && (
        <p className="mb-4 text-red-500">{errors.parking.message}</p>
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
        <p className="mb-4 text-red-500">{errors.company.message}</p>
      )}

      <input
        {...register("contact_name")}
        placeholder="Contact Name"
        defaultValue={userData?.full_name || userData?.name || ""}
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.contact_name && (
        <p className="mb-4 text-red-500">{errors.contact_name.message}</p>
      )}

      <input
        {...register("website")}
        placeholder="Website (Optional)"
        type="url"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.website && (
        <p className="mb-4 text-red-500">{errors.website.message}</p>
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
            <p className="mt-2 text-red-500">{errors.timeNeeded.message}</p>
          )}
        </div>

        <div className="mb-4">
          <RadioGroup
            name="head_count"
            control={control}
            options={HEAD_COUNT}
            label="Headcount"
          />
          {errors.head_count && (
            <p className="mt-2 text-red-500">{errors.head_count.message}</p>
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
            <p className="mt-2 text-red-500">{errors.frequency.message}</p>
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
          {isLoading ? "Registering..." : "Complete Profile"}
        </button>
      </div>
    </form>
  );
};

export default OAuthClientForm;
