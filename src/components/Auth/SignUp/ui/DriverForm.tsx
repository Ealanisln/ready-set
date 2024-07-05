import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverSchema, FormData } from "@/components/Auth/SignUp/FormSchemas";

interface DriverFormProps {
  onSubmit: (data: FormData) => void;
}

const DriverForm: React.FC<DriverFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(driverSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("licenseNumber")}
        placeholder="License Number"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.licenseNumber && (
        <p className="mb-4 text-red-500">
          {errors.licenseNumber.message as string}
        </p>
      )}
    </form>
  );
};

export default DriverForm;
