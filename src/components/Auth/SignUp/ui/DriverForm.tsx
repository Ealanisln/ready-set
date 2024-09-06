import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverSchema } from "@/components/Auth/SignUp/FormSchemas";

interface DriverFormData {
  userType: "driver"; // Add this line
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

interface DriverFormProps {
  onSubmit: (data: DriverFormData) => Promise<void>;
}

const DriverForm: React.FC<DriverFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
  });

  const onSubmitWrapper = async (data: DriverFormData) => {

    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWrapper)}>
      <input type="hidden" {...register("userType")} value="driver" />

      <input
        {...register("name")}
        placeholder="Name"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.name && (
        <p className="mb-4 text-red-500">{errors.name.message as string}</p>
      )}

      <input
        {...register("email")}
        type="email"
        placeholder="Email"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.email && (
        <p className="mb-4 text-red-500">{errors.email.message as string}</p>
      )}

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.password && (
        <p className="mb-4 text-red-500">{errors.password.message as string}</p>
      )}

      <input
        {...register("phoneNumber")}
        placeholder="Phone Number"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.phoneNumber && (
        <p className="mb-4 text-red-500">
          {errors.phoneNumber.message as string}
        </p>
      )}

      <input
        {...register("street1")}
        placeholder="Street Address"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.street1 && (
        <p className="mb-4 text-red-500">{errors.street1.message as string}</p>
      )}

      <input
        {...register("street2")}
        placeholder="Street Address 2 (Optional)"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />

      <input
        {...register("city")}
        placeholder="City"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.city && (
        <p className="mb-4 text-red-500">{errors.city.message as string}</p>
      )}

      <input
        {...register("state")}
        placeholder="State"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.state && (
        <p className="mb-4 text-red-500">{errors.state.message as string}</p>
      )}

      <input
        {...register("zip")}
        placeholder="ZIP Code"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.zip && (
        <p className="mb-4 text-red-500">{errors.zip.message as string}</p>
      )}

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
          {isLoading ? "Registering..." : "Register as Driver"}
        </button>
      </div>
    </form>
  );
};

export default DriverForm;
