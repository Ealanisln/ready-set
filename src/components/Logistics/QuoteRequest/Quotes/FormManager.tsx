// src/components/Logistics/QuoteRequest/Quotes/FormManager.tsx
"use client";

import { useState } from "react";
import DialogFormContainer from "@/components/Logistics/DialogFormContainer";
import { FormType, DeliveryFormData } from "@/components/Logistics/QuoteRequest/types";

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

  const handleSubmit = async (formData: DeliveryFormData) => {
    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: activeFormType,
          formData: {
            companyName: formData.companyName,
            contactName: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            counties: formData.selectedCounties,
            frequency: 'frequency' in formData ? formData.frequency : undefined,
            pickupAddress: {
              street: formData.streetAddress,
              city: formData.city,
              state: formData.state,
              zip: formData.zipCode,
            },
            specifications: {
              driversNeeded: formData.driversNeeded,
              serviceType: formData.serviceType,
              deliveryRadius: formData.deliveryRadius,
              ...('deliveryTypes' in formData && { deliveryTypes: formData.deliveryTypes }),
              ...('orderHeadcount' in formData && { orderHeadcount: formData.orderHeadcount }),
            },
            notes: '', // Add any additional notes if needed
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      closeForm();
      // You might want to show a success message using your preferred notification system
      // toast.success('Quote request submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show error message to user)
      // toast.error('Failed to submit quote request. Please try again.');
    }
  };

  return {
    openForm,
    closeForm,
    DialogForm: (
      <DialogFormContainer
        isOpen={isDialogOpen}
        onClose={closeForm}
        formType={activeFormType}
        onSubmit={handleSubmit}
      />
    )
  };
};