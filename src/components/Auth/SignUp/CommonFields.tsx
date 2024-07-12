import React from "react";
import { UseFormRegister, FieldErrors, Path } from "react-hook-form";

type CommonFields = {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
};

interface CommonFieldsProps<T extends Partial<CommonFields>> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

const CommonFields = <T extends Partial<CommonFields>>({
  register,
  errors,
}: CommonFieldsProps<T>) => {
  return (
    <>
      <input
        {...register("email" as Path<T>)}
        placeholder="Email"
        type="email"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.email && (
        <p className="mb-4 text-red-500">{errors.email.message as string}</p>
      )}

      <input
        {...register("password" as Path<T>)}
        placeholder="Password"
        type="password"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.password && (
        <p className="mb-4 text-red-500">{errors.password.message as string}</p>
      )}

      {/* <input
        {...register("passwordConfirmation" as Path<T>)}
        placeholder="Confirm Password"
        type="password"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.passwordConfirmation && (
        <p className="mb-4 text-red-500">
          {errors.passwordConfirmation.message as string}
        </p>
      )} */}

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 flex-shrink text-gray-600">Address</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <input
        {...register("phoneNumber" as Path<T>)}
        placeholder="Phone Number"
        type="tel"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.phoneNumber && (
        <p className="mb-4 text-red-500">
          {errors.phoneNumber.message as string}
        </p>
      )}
      <input
        {...register("street1" as Path<T>)}
        placeholder="Street Address 1"
        type="text"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.street1 && (
        <p className="mb-4 text-red-500">{errors.street1.message as string}</p>
      )}

      <input
        {...register("street2" as Path<T>)}
        placeholder="Street Address 2 (Optional)"
        type="text"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.street2 && (
        <p className="mb-4 text-red-500">{errors.street2.message as string}</p>
      )}

      <input
        {...register("city" as Path<T>)}
        placeholder="City"
        type="text"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.city && (
        <p className="mb-4 text-red-500">{errors.city.message as string}</p>
      )}

      <input
        {...register("state" as Path<T>)}
        placeholder="State"
        type="text"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.state && (
        <p className="mb-4 text-red-500">{errors.state.message as string}</p>
      )}

      <input
        {...register("zip" as Path<T>)}
        placeholder="Zip Code"
        type="text"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.zip && (
        <p className="mb-4 text-red-500">{errors.zip.message as string}</p>
      )}
    </>
  );
};

export default CommonFields;
