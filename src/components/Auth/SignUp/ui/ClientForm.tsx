import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormData, FormData } from "@/components/Auth/SignUp/FormSchemas";
import { CheckboxGroup, RadioGroup } from "./FormComponents";
import { COUNTIES, TIME_NEEDED, HEADCOUNT, FREQUENCY } from './FormData';
import CommonFields from "../CommonFields";

interface ClientFormProps {
  onSubmit: (data: FormData) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: { 
      userType: "client",
      countyLocation: [],
      timeNeeded: [],
    },
  });

  const handleSubmitForm: SubmitHandler<ClientFormData> = (data) => {
    onSubmit(data as FormData);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <CommonFields register={register} errors={errors} />
      
      <input
        {...register("company")}
        placeholder="Company Name"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.company && (
        <p className="mb-4 text-red-500">{errors.company.message}</p>
      )}

      <CheckboxGroup
        name="countyLocation"
        control={control}
        options={COUNTIES}
        label="County Location"
      />
      {errors.countyLocation && (
        <p className="mt-2 text-red-500">{errors.countyLocation.message as string}</p>
      )}

      <CheckboxGroup
        name="timeNeeded"
        control={control}
        options={TIME_NEEDED}
        label="Time Needed"
      />
      {errors.timeNeeded && (
        <p className="mt-2 text-red-500">{errors.timeNeeded.message as string}</p>
      )}

      <RadioGroup
        name="headcount"
        control={control}
        options={HEADCOUNT}
        label="Headcount"
      />
      {errors.headcount && (
        <p className="mt-2 text-red-500">{errors.headcount.message as string}</p>
      )}

      <RadioGroup
        name="frequency"
        control={control}
        options={FREQUENCY}
        label="Frequency"
      />
      {errors.frequency && (
        <p className="mt-2 text-red-500">{errors.frequency.message as string}</p>
      )}

      <div className="pt-6"> 
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-5 py-3 text-base font-semibold text-white transition hover:bg-primary-dark"
        >
          Register as Client
        </button>
      </div>
    </form>
  );
};

export default ClientForm;