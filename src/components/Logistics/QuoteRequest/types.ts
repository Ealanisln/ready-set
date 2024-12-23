// src/components/Logistics/QuoteRequest/types.ts
import { UseFormRegister } from "react-hook-form";

// Interfaces existentes
export interface FormData {
  [key: string]: any;
}

export interface RegisterProps {
  register: UseFormRegister<FormData>;
}

export type FormType = 'food' | 'flower' | 'bakery' | 'specialty' | null;

export interface DialogFormProps {
  isOpen: boolean;
  onClose: () => void;
  formType: FormType;
}

// Nuevas interfaces para los formularios específicos
export interface BaseFormData {
  name: string;
  email: string;
  companyName: string;
  contactName: string;
  website?: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  driversNeeded: string;
  serviceType: string;
  deliveryRadius: string;
  selectedCounties: string[]; // Made required
}

export interface BakeryFormData extends BaseFormData {
  formType: 'bakery';
  deliveryTypes: Array<'bakedGoods' | 'supplies'>;
  partnerServices: string;
  routingApp: string;
  deliveryFrequency: string; // Made required
  supplyPickupFrequency: string; // Made required
}

export interface FlowerFormData extends BaseFormData {
  formType: 'flower';
  deliveryTypes: Array<'floralArrangements' | 'floralSupplies'>;
  brokerageServices: string[];
  deliveryFrequency?: string;
  supplyPickupFrequency?: string;
}

export interface FoodFormData extends BaseFormData {
  formType: 'food';
  totalStaff: string;
  expectedDeliveries: string;
  partneredServices: string;
  multipleLocations: string;
  deliveryTimes: Array<'breakfast' | 'lunch' | 'dinner' | 'allDay'>;
  orderHeadcount: string[];
  frequency: string;
}

export interface SpecialtyFormData extends BaseFormData {
  formType: 'specialty';
  deliveryTypes: Array<'specialDelivery' | 'specialtyDelivery'>;
  fragilePackage: 'yes' | 'no';
  packageDescription: string;
  deliveryFrequency?: string;
  supplyPickupFrequency?: string;
}

export type DeliveryFormData = 
  | BakeryFormData 
  | FlowerFormData 
  | FoodFormData 
  | SpecialtyFormData;

// También podríamos actualizar la interfaz RegisterProps para ser más específica:
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