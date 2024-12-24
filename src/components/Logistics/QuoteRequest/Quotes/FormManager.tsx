// src/components/Logistics/QuoteRequest/Quotes/FormManager.tsx
"use client";

import { useState } from "react";
import DialogFormContainer from "@/components/Logistics/DialogFormContainer";
import { FormType } from "@/components/Logistics/QuoteRequest/types";

export const FormManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFormType, setActiveFormType] = useState<FormType>(null);

  const openForm = (formType: FormType) => {
    console.log('FormManager - Opening form with type:', formType);
    setActiveFormType(formType);
    setIsDialogOpen(true);
  };

  const closeForm = () => {
    setIsDialogOpen(false);
    setActiveFormType(null);
  };

  return {
    openForm,
    closeForm,
    DialogForm: (
      <DialogFormContainer
        isOpen={isDialogOpen}
        onClose={closeForm}
        formType={activeFormType}
      />
    )
  };
};