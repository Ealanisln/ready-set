import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, FormData } from "@/components/Auth/SignUp/FormSchemas";

interface ClientFormProps {
  onSubmit: (data: FormData) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(clientSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("client")}
        placeholder="Company Name"
        className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      {errors.company && (
        <p className="mb-4 text-red-500">{errors.company.message as string}</p>
      )}
    </form>
  );
};


export default ClientForm


clientSchema