import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeliveryFormProps {
  title: string;
  children: React.ReactNode;
}

export const DeliveryForm = ({ title, children }: DeliveryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-yellow-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {children}
          <div className="space-y-4">
            <textarea
              className="w-full rounded border p-2"
              placeholder="Additional Comment"
              rows={4}
            />
            <button
              type="submit"
              className="w-full rounded bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600"
            >
              Submit
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};