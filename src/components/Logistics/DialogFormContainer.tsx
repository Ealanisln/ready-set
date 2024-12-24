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
      <DialogContent className="top-[50%] w-[90vw] max-w-3xl translate-y-[-50%] rounded-lg border bg-white p-4 shadow-lg sm:p-6 md:w-full">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-yellow-500 sm:text-xl">
            {getFormTitle(formType)}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 sm:text-base">
            {getFormDescription(formType)}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto px-1">
          {renderForm()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormContainer;