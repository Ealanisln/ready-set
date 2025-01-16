import { UseFormRegister } from "react-hook-form";

export type FormType = "food" | "flower" | "bakery" | "specialty" | null;

// Base form data interface
export interface BaseFormData {
  name: string;
  email: string;
  companyName: string;
  contactName: string;
  website?: string;
  phone: string;
  counties: string[];
  additionalComments?: string; // New field
  pickupAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  driversNeeded: string;
  serviceType: string;
  deliveryRadius: string;
}

// Form-specific interfaces
export interface BakeryFormData extends BaseFormData {
  formType: "bakery";
  deliveryTypes: Array<"bakedGoods" | "supplies">;
  partnerServices: string;
  routingApp: string;
  deliveryFrequency: string;
  supplyPickupFrequency: string;
}

export interface FlowerFormData extends BaseFormData {
  formType: "flower";
  deliveryTypes: Array<"floralArrangements" | "floralSupplies">;
  brokerageServices: string[];
  deliveryFrequency?: string;
  supplyPickupFrequency?: string;
}

export interface FoodFormData extends BaseFormData {
  formType: "food";
  totalStaff: string;
  expectedDeliveries: string;
  partneredServices: string;
  multipleLocations: string;
  deliveryTimes: Array<"breakfast" | "lunch" | "dinner" | "allDay">;
  orderHeadcount: string[];
  frequency: string;
}

export interface SpecialtyFormData extends BaseFormData {
  formType: "specialty";
  deliveryTypes: Array<"specialDelivery" | "specialtyDelivery">;
  fragilePackage: "yes" | "no";
  packageDescription: string;
  deliveryFrequency?: string;
  supplyPickupFrequency?: string;
}

// Type for all possible form data types
export type DeliveryFormData = 
  | BakeryFormData 
  | FlowerFormData 
  | FoodFormData 
  | SpecialtyFormData;

// Register props interfaces
export interface BakeryRegisterProps {
  register: UseFormRegister<BakeryFormData>;
}

export interface FlowerRegisterProps {
  register: UseFormRegister<FlowerFormData>;
}

export interface FoodRegisterProps {
  register: UseFormRegister<FoodFormData>;
}

export interface SpecialtyRegisterProps {
  register: UseFormRegister<SpecialtyFormData>;
}

// Dialog form props
export interface DialogFormProps {
  isOpen: boolean;
  onClose: () => void;
  formType: FormType;
}