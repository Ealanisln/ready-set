import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverSchema } from "@/components/Auth/SignUp/FormSchemas";
import { Loader2 } from "lucide-react";

interface DriverFormData {
  userType: "driver";
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
  isLoading?: boolean;
}

const DriverForm: React.FC<DriverFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      userType: "driver"
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("userType")} value="driver" />

      <input
        {...register("name")}
        placeholder="Name"
        disabled={isLoading}
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
      />
      {errors.name && (
        <p className="mb-4 text-red-500">{errors.name.message as string}</p>
      )}

      <input
        {...register("email")}
        type="email"
        placeholder="Email"
        disabled={isLoading}
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
      />
      {errors.email && (
        <p className="mb-4 text-red-500">{errors.email.message as string}</p>
      )}

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        disabled={isLoading}
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
      />
      {errors.password && (
        <p className="mb-4 text-red-500">{errors.password.message as string}</p>
      )}

      <input
        {...register("phoneNumber")}
        placeholder="Phone Number"
        disabled={isLoading}
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
      />
      {errors.phoneNumber && (
        <p className="mb-4 text-red-500">
          {errors.phoneNumber.message as string}
        </p>
      )}

      <input
        {...register("street1")}
        placeholder="Street Address"
        disabled={isLoading}
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
      />
      {errors.street1 && (
        <p className="mb-4 text-red-500">{errors.street1.message as string}</p>
      )}

      <input
        {...register("street2")}
        placeholder="Street Address 2 (Optional)"
        disabled={isLoading}
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
      />

      <input
        {...register("city")}
        placeholder="City"
        disabled={isLoading}
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
      />
      {errors.city && (
        <p className="mb-4 text-red-500">{errors.city.message as string}</p>
      )}

      <input
        {...register("state")}
        placeholder="State"
        disabled={isLoading}
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
      />
      {errors.state && (
        <p className="mb-4 text-red-500">{errors.state.message as string}</p>
      )}

      <input
        {...register("zip")}
        placeholder="ZIP Code"
        disabled={isLoading}
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
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
          className="hover:bg-primary-dark w-full rounded-md bg-primary px-5 py-3 text-base font-semibold text-white transition disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register as Driver"
          )}
        </button>
      </div>
    </form>
  );
};

export default DriverForm;