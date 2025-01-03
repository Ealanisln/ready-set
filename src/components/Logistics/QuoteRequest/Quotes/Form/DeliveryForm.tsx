interface DeliveryFormProps {
  title: string;
  children: React.ReactNode;
}

export const DeliveryForm = ({ title, children }: DeliveryFormProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
};