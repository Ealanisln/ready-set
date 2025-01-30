// src/lib/form-submissions.ts

import { prisma } from "@/utils/prismaDB";
import {
  DeliveryFormData,
  FormType,
} from "@/components/Logistics/QuoteRequest/types";

enum FormSubmissionType {
  food = "food",
  flower = "flower",
  bakery = "bakery",
  specialty = "specialty",
}

const normalizeValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }
  return String(value);
};

export class FormSubmissionService {
  static async createSubmission(data: {
    formType: FormType;
    formData: DeliveryFormData;
  }) {
    if (!data.formType) {
      throw new Error("Form type is required");
    }

    const formTypeMap: Record<string, FormSubmissionType> = {
      food: FormSubmissionType.food,
      flower: FormSubmissionType.flower,
      bakery: FormSubmissionType.bakery,
      specialty: FormSubmissionType.specialty,
    };

    try {
      console.log(
        "Processing submission with data:",
        JSON.stringify(data, null, 2),
      );

      // Extract base fields and specifications
      const {
        companyName,
        contactName,
        email,
        phone,
        website,
        counties,
        additionalComments,
        pickupAddress,
        ...specifications
      } = data.formData;

      const submission = await prisma.form_submission.create({
        data: {
          formType: formTypeMap[data.formType.toLowerCase()],
          companyName: normalizeValue(companyName),
          contactName: normalizeValue(contactName),
          email: normalizeValue(email),
          phone: normalizeValue(phone),
          website: normalizeValue(website),
          counties: Array.isArray(counties) ? counties : [],
          frequency:
            "frequency" in specifications ? specifications.frequency : "N/A",
          pickupAddress: pickupAddress || {
            street: "",
            city: "",
            state: "",
            zip: "",
          },
          additionalComments: normalizeValue(additionalComments),
          specifications: JSON.stringify(specifications),
        },
      });

      console.log("Created submission:", {
        id: submission.id,
        formType: submission.formType,
        specifications:
          typeof submission.specifications === "string"
            ? JSON.parse(submission.specifications)
            : submission.specifications,
      });

      return submission;
    } catch (error) {
      console.error("Error in form submission:", error);
      throw error;
    }
  }
}