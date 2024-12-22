// src/components/Logistics/QuoteRequest/types.ts

import { UseFormRegister } from "react-hook-form";

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