// src/components/Logistics/QuoteRequest/Quotes/FormManager.tsx

import { useState } from "react";
import DialogFormContainer from "@/components/Logistics/DialogFormContainer";
import { 
  FormType, 
  DeliveryFormData,
  BakeryFormData,
  FlowerFormData,
  FoodFormData,
  SpecialtyFormData
} from "../types";

interface APISubmissionData {
  formType: FormType;
  formData: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    website?: string;
    counties: string[];
    additionalComments?: string;  // Add this field
    pickupAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    specifications: {
      driversNeeded: string;
      serviceType: string;
      deliveryRadius: string;
      // Form-specific fields
      deliveryTypes?: string[];
      deliveryFrequency?: string;
      supplyPickupFrequency?: string;
      partnerServices?: string;
      routingApp?: string;
      brokerageServices?: string[];
      totalStaff?: string;
      expectedDeliveries?: string;
      partneredServices?: string;
      multipleLocations?: string;
      deliveryTimes?: string[];
      orderHeadcount?: string[];
      frequency?: string;
      fragilePackage?: 'yes' | 'no';
      packageDescription?: string;
    };
  };
}

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
      // Base submission data structure
      const baseSubmission: APISubmissionData = {
        formType: formData.formType,
        formData: {
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          counties: formData.counties || [], // Use counties instead of selectedCounties
          additionalComments: formData.additionalComments,
          pickupAddress: formData.pickupAddress, // Use pickupAddress directly
          specifications: {
            driversNeeded: formData.specifications.driversNeeded,
            serviceType: formData.specifications.serviceType,
            deliveryRadius: formData.specifications.deliveryRadius,
          },
        },
      };
  
      // Add form-specific fields based on form type
      switch (formData.formType) {
        case 'bakery': {
          const bakeryData = formData as BakeryFormData;
          baseSubmission.formData.specifications = {
            ...baseSubmission.formData.specifications,
            deliveryTypes: bakeryData.specifications.deliveryTypes,
            deliveryFrequency: bakeryData.specifications.deliveryFrequency,
            supplyPickupFrequency: bakeryData.specifications.supplyPickupFrequency,
            partnerServices: bakeryData.specifications.partnerServices,
            routingApp: bakeryData.specifications.routingApp,
          };
          break;
        }
        case 'flower': {
          const flowerData = formData as FlowerFormData;
          baseSubmission.formData.specifications = {
            ...baseSubmission.formData.specifications,
            deliveryTypes: flowerData.specifications.deliveryTypes,
            deliveryFrequency: flowerData.specifications.deliveryFrequency,
            supplyPickupFrequency: flowerData.specifications.supplyPickupFrequency,
            brokerageServices: flowerData.specifications.brokerageServices,
          };
          break;
        }
        case 'food': {
          const foodData = formData as FoodFormData;
          baseSubmission.formData.specifications = {
            ...baseSubmission.formData.specifications,
            totalStaff: foodData.specifications.totalStaff,
            expectedDeliveries: foodData.specifications.expectedDeliveries,
            partneredServices: foodData.specifications.partneredServices,
            multipleLocations: foodData.specifications.multipleLocations,
            deliveryTimes: foodData.specifications.deliveryTimes,
            orderHeadcount: foodData.specifications.orderHeadcount,
            frequency: foodData.specifications.frequency,
          };
          break;
        }
        case 'specialty': {
          const specialtyData = formData as SpecialtyFormData;
          baseSubmission.formData.specifications = {
            ...baseSubmission.formData.specifications,
            deliveryTypes: specialtyData.specifications.deliveryTypes,
            deliveryFrequency: specialtyData.specifications.deliveryFrequency,
            supplyPickupFrequency: specialtyData.specifications.supplyPickupFrequency,
            fragilePackage: specialtyData.specifications.fragilePackage,
            packageDescription: specialtyData.specifications.packageDescription,
          };
          break;
        }
      }
  
      console.log('Submitting form data:', baseSubmission);
  
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(baseSubmission),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
  
      closeForm();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show error message to user)
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