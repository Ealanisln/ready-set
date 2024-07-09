// src/components/Auth/SignUp/ui/BaseForm.tsx
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseSchema, FormData } from "@/components/Auth/SignUp/FormSchemas";

interface BaseFormProps {
  onSubmit: (data: FormData) => void;
  children: (methods: UseFormReturn<FormData>) => React.ReactNode;
}

const BaseForm: React.FC<BaseFormProps> = ({ onSubmit, children }) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(baseSchema),
  });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <input
        {...methods.register("name")}
        placeholder="Name"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {methods.formState.errors.name && (
        <p className="mb-4 text-red-500">
          {methods.formState.errors.name.message}
        </p>
      )}

      <input
        {...methods.register("phoneNumber")}
        placeholder="Phone Number"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {methods.formState.errors.phoneNumber && (
        <p className="mb-4 text-red-500">
          {methods.formState.errors.phoneNumber.message}
        </p>
      )}

      <input
        {...methods.register("email")}
        placeholder="Email"
        type="email"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {methods.formState.errors.email && (
        <p className="mb-4 text-red-500">
          {methods.formState.errors.email.message}
        </p>
      )}

      <input
        {...methods.register("password")}
        placeholder="Password"
        type="password"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {methods.formState.errors.password && (
        <p className="mb-4 text-red-500">
          {methods.formState.errors.password.message}
        </p>
      )}

      {children(methods)}
    </form>
  );
};

export default BaseForm;
