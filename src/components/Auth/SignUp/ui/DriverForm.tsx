import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  driverSchema,
  DriverFormData,
  FormData,
} from "@/components/Auth/SignUp/FormSchemas";
import CommonFields from "../CommonFields";

interface DriverFormProps {
  onSubmit: (data: FormData) => void;
}

const DriverForm: React.FC<DriverFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
  });

  const handleSubmitForm: SubmitHandler<DriverFormData> = (data) => {
    onSubmit(data as FormData);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <CommonFields register={register} errors={errors} />

      <div className="pt-6">
        <button
          type="submit"
          className="hover:bg-primary-dark w-full rounded-md bg-primary px-5 py-3 text-base font-semibold text-white transition"
        >
          Register as Driver
        </button>
      </div>
    </form>
  );
};

export default DriverForm;
