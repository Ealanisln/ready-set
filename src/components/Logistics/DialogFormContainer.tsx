import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FoodDeliveryForm,
  FlowerDeliveryForm,
  BakeGoodsDeliveryForm,
  SpecialtyDeliveryForm,
} from "@/components/Logistics/QuoteRequest";
import {
  DialogFormProps,
  FormType,
} from "@/components/Logistics/QuoteRequest/types";

const getFormTitle = (type: FormType) => {
  switch (type) {
    case "food":
      return "Food Delivery Quote Request";
    case "flower":
      return "Flower Delivery Quote Request";
    case "bakery":
      return "Bakery Delivery Quote Request";
    case "specialty":
      return "Specialty Delivery Request";
    default:
      return "Quote Request";
  }
};

const getFormDescription = (type: FormType) => {
  switch (type) {
    case "food":
      return "Fill out this form to request a quote for food delivery services.";
    case "flower":
      return "Fill out this form to request a quote for flower delivery services.";
    case "bakery":
      return "Fill out this form to request a quote for bakery delivery services.";
    case "specialty":
      return "Fill out this form to request a quote for specialty delivery services.";
    default:
      return "Fill out this form to request a quote for our delivery services.";
  }
};

const DialogFormContainer = ({
  isOpen,
  onClose,
  formType,
}: DialogFormProps) => {
  const renderForm = () => {
    switch (formType) {
      case "food":
        return <FoodDeliveryForm />;
      case "flower":
        return <FlowerDeliveryForm />;
      case "bakery":
        return <BakeGoodsDeliveryForm />;
      case "specialty":
        return <SpecialtyDeliveryForm />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-yellow-500">
            {getFormTitle(formType)}
          </DialogTitle>
          <DialogDescription>
            {getFormDescription(formType)}
          </DialogDescription>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormContainer;