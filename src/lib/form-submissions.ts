// src/lib/form-submissions.ts

import { prisma } from "@/utils/prismaDB";
import { google } from "googleapis";
import { FormType } from "@/components/Logistics/QuoteRequest/types";
import { FormSubmissionType } from "@prisma/client";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export class FormSubmissionService {
  static async createSubmission(data: {
    formType: FormType;
    userId?: string;
    formData: any;
  }) {
    if (!data.formType) {
      throw new Error("Form type is required");
    }

    const formTypeMap: Record<string, FormSubmissionType> = {
      'food': FormSubmissionType.food,
      'flower': FormSubmissionType.flower,
      'bakery': FormSubmissionType.bakery,
      'specialty': FormSubmissionType.specialty,
    };

    try {
      // Format base specifications based on form type
      let specifications: any = {
        driversNeeded: data.formData.driversNeeded || '',
        serviceType: data.formData.serviceType || '',
        deliveryRadius: data.formData.deliveryRadius || '',
      };

      // Add form-specific fields
      switch (data.formType) {
        case 'bakery':
          specifications = {
            ...specifications,
            deliveryTypes: data.formData.deliveryTypes || [],
            partnerServices: data.formData.partnerServices || '',
            routingApp: data.formData.routingApp || '',
            deliveryFrequency: data.formData.deliveryFrequency || '',
            supplyPickupFrequency: data.formData.supplyPickupFrequency || '',
          };
          break;
        case 'flower':
          specifications = {
            ...specifications,
            deliveryTypes: data.formData.deliveryTypes || [],
            brokerageServices: data.formData.brokerageServices || [],
            deliveryFrequency: data.formData.deliveryFrequency || '',
            supplyPickupFrequency: data.formData.supplyPickupFrequency || '',
          };
          break;
        case 'food':
          specifications = {
            ...specifications,
            totalStaff: data.formData.totalStaff || '',
            expectedDeliveries: data.formData.expectedDeliveries || '',
            partneredServices: data.formData.partneredServices || '',
            multipleLocations: data.formData.multipleLocations || '',
            deliveryTimes: data.formData.deliveryTimes || [],
            orderHeadcount: data.formData.orderHeadcount || [],
            frequency: data.formData.frequency || '',
          };
          break;
        case 'specialty':
          specifications = {
            ...specifications,
            deliveryTypes: data.formData.deliveryTypes || [],
            fragilePackage: data.formData.fragilePackage || 'no',
            packageDescription: data.formData.packageDescription || '',
            deliveryFrequency: data.formData.deliveryFrequency || '',
            supplyPickupFrequency: data.formData.supplyPickupFrequency || '',
          };
          break;
      }

      // Create submission
      const submission = await prisma.formSubmission.create({
        data: {
          formType: formTypeMap[data.formType.toLowerCase()],
          userId: data.userId,
          companyName: data.formData.companyName || '',
          contactName: data.formData.contactName || '',
          email: data.formData.email || '',
          phone: data.formData.phone || '',
          counties: data.formData.selectedCounties || [],
          frequency: data.formData.frequency || '',
          pickupAddress: {
            street: data.formData.streetAddress || '',
            city: data.formData.city || '',
            state: data.formData.state || '',
            zip: data.formData.zipCode || '',
          },
          specifications,
          notes: data.formData.notes || "",
        },
      });

      // Sync to Google Sheets
      await this.syncToGoogleSheets(submission);

      return submission;
    } catch (error) {
      console.error("Error in form submission:", error);
      throw error;
    }
  }

  private static async syncToGoogleSheets(submission: any) {
    try {
      const specifications = submission.specifications as any;
      const address = submission.pickupAddress as any;
      const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
      
      // Prepare base values array
      const baseValues = [
        submission.id,
        submission.formType,
        submission.companyName || 'N/A',
        submission.contactName || 'N/A',
        submission.email || 'N/A',
        submission.phone || 'N/A',
        submission.counties?.join(", ") || 'N/A',
        submission.frequency || "N/A",
        formattedAddress,
        specifications?.driversNeeded || 'N/A',
        specifications?.serviceType || 'N/A',
        specifications?.deliveryRadius || 'N/A',
      ];

      // Add form-specific values
      let formSpecificValues: string[] = [];
      switch (submission.formType) {
        case 'FOOD':
          formSpecificValues = [
            specifications?.deliveryTimes?.join(", ") || "N/A",
            specifications?.orderHeadcount?.join(", ") || "N/A",
            specifications?.totalStaff || "N/A",
            specifications?.expectedDeliveries || "N/A",
          ];
          break;
        case 'FLOWER':
        case 'BAKERY':
          formSpecificValues = [
            specifications?.deliveryTypes?.join(", ") || "N/A",
            specifications?.deliveryFrequency || "N/A",
            specifications?.supplyPickupFrequency || "N/A",
          ];
          break;
        case 'SPECIALTY':
          formSpecificValues = [
            specifications?.deliveryTypes?.join(", ") || "N/A",
            specifications?.fragilePackage || "N/A",
            specifications?.packageDescription || "N/A",
          ];
          break;
      }

      const values = [[
        ...baseValues,
        ...formSpecificValues,
        submission.notes || 'N/A',
        submission.createdAt.toISOString(),
      ]];

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        range: "user-quotes!A:P",
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      });

      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: { syncedToSheets: true },
      });
    } catch (error) {
      console.error("Error syncing to Google Sheets:", error);
    }
  }
}