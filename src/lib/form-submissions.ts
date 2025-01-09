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

// Define column headers for each form type
const SHEET_COLUMNS = {
  BASE_COLUMNS: [
    "ID",
    "Form Type",
    "Company Name",
    "Contact Name",
    "Email",
    "Phone",
    "Counties",
    "Frequency",
    "Pickup Address",
    "Drivers Needed",
    "Service Type",
    "Delivery Radius",
  ],
  FOOD: [
    "Delivery Times",
    "Order Headcount",
    "Total Staff",
    "Expected Deliveries",
    "Partnered Services",
    "Multiple Locations",
  ],
  FLOWER: [
    "Delivery Types",
    "Brokerage Services",
    "Delivery Frequency",
    "Supply Pickup Frequency",
  ],
  BAKERY: [
    "Delivery Types",
    "Partner Services",
    "Routing App",
    "Delivery Frequency",
    "Supply Pickup Frequency",
  ],
  SPECIALTY: [
    "Delivery Types",
    "Fragile Package",
    "Package Description",
    "Delivery Frequency",
    "Supply Pickup Frequency",
  ],
  FINAL_COLUMNS: ["Notes", "Created At"],
};

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
      food: FormSubmissionType.food,
      flower: FormSubmissionType.flower,
      bakery: FormSubmissionType.bakery,
      specialty: FormSubmissionType.specialty,
    };

    try {
      // Format base specifications based on form type
      let specifications: any = {
        driversNeeded: data.formData.driversNeeded || "",
        serviceType: data.formData.serviceType || "",
        deliveryRadius: data.formData.deliveryRadius || "",
      };

      // Add form-specific fields
      switch (data.formType) {
        case "bakery":
          specifications = {
            ...specifications,
            deliveryTypes: data.formData.deliveryTypes || [],
            partnerServices: data.formData.partnerServices || "",
            routingApp: data.formData.routingApp || "",
            deliveryFrequency: data.formData.deliveryFrequency || "",
            supplyPickupFrequency: data.formData.supplyPickupFrequency || "",
          };
          break;
        case "flower":
          specifications = {
            ...specifications,
            deliveryTypes: data.formData.deliveryTypes || [],
            brokerageServices: data.formData.brokerageServices || [],
            deliveryFrequency: data.formData.deliveryFrequency || "",
            supplyPickupFrequency: data.formData.supplyPickupFrequency || "",
          };
          break;
        case "food":
          specifications = {
            ...specifications,
            totalStaff: data.formData.totalStaff || "",
            expectedDeliveries: data.formData.expectedDeliveries || "",
            partneredServices: data.formData.partneredServices || "",
            multipleLocations: data.formData.multipleLocations || "",
            deliveryTimes: data.formData.deliveryTimes || [],
            orderHeadcount: data.formData.orderHeadcount || [],
            frequency: data.formData.frequency || "",
          };
          break;
        case "specialty":
          specifications = {
            ...specifications,
            deliveryTypes: data.formData.deliveryTypes || [],
            fragilePackage: data.formData.fragilePackage || "no",
            packageDescription: data.formData.packageDescription || "",
            deliveryFrequency: data.formData.deliveryFrequency || "",
            supplyPickupFrequency: data.formData.supplyPickupFrequency || "",
          };
          break;
      }

      // Create submission
      const submission = await prisma.formSubmission.create({
        data: {
          formType: formTypeMap[data.formType.toLowerCase()],
          userId: data.userId,
          companyName: data.formData.companyName || "",
          contactName: data.formData.contactName || "",
          email: data.formData.email || "",
          phone: data.formData.phone || "",
          counties: data.formData.selectedCounties || [],
          frequency: data.formData.frequency || "",
          pickupAddress: {
            street: data.formData.streetAddress || "",
            city: data.formData.city || "",
            state: data.formData.state || "",
            zip: data.formData.zipCode || "",
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

      // Prepare base values
      const baseValues = [
        submission.id,
        submission.formType,
        submission.companyName || "N/A",
        submission.contactName || "N/A",
        submission.email || "N/A",
        submission.phone || "N/A",
        submission.counties?.join(", ") || "N/A",
        submission.frequency || "N/A",
        formattedAddress,
        specifications?.driversNeeded || "N/A",
        specifications?.serviceType || "N/A",
        specifications?.deliveryRadius || "N/A",
      ];

      // Add form-specific values based on form type
      let formSpecificValues: string[] = [];
      switch (submission.formType) {
        case "FOOD":
          formSpecificValues = [
            specifications?.deliveryTimes?.join(", ") || "N/A",
            specifications?.orderHeadcount?.join(", ") || "N/A",
            specifications?.totalStaff || "N/A",
            specifications?.expectedDeliveries || "N/A",
            specifications?.partneredServices || "N/A",
            specifications?.multipleLocations || "N/A",
          ];
          break;
        case "FLOWER":
          formSpecificValues = [
            specifications?.deliveryTypes?.join(", ") || "N/A",
            specifications?.brokerageServices?.join(", ") || "N/A",
            specifications?.deliveryFrequency || "N/A",
            specifications?.supplyPickupFrequency || "N/A",
          ];
          break;
        case "BAKERY":
          formSpecificValues = [
            specifications?.deliveryTypes?.join(", ") || "N/A",
            specifications?.partnerServices || "N/A",
            specifications?.routingApp || "N/A",
            specifications?.deliveryFrequency || "N/A",
            specifications?.supplyPickupFrequency || "N/A",
          ];
          break;
        case "SPECIALTY":
          formSpecificValues = [
            specifications?.deliveryTypes?.join(", ") || "N/A",
            specifications?.fragilePackage || "N/A",
            specifications?.packageDescription || "N/A",
            specifications?.deliveryFrequency || "N/A",
            specifications?.supplyPickupFrequency || "N/A",
          ];
          break;
      }

      // Add final columns (notes and timestamp)
      const finalValues = [
        submission.notes || "N/A",
        submission.createdAt.toISOString(),
      ];

      const values = [[...baseValues, ...formSpecificValues, ...finalValues]];

      // Calculate the range based on form type
      const formTypeColumns =
        SHEET_COLUMNS[submission.formType as keyof typeof SHEET_COLUMNS] || [];
      const totalColumns =
        SHEET_COLUMNS.BASE_COLUMNS.length +
        formTypeColumns.length +
        SHEET_COLUMNS.FINAL_COLUMNS.length;
      const range = `user-quotes!A:${String.fromCharCode(64 + totalColumns)}`;

      // Append to sheets with dynamic range
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      });

      // Update sync status
      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: { syncedToSheets: true },
      });
    } catch (error) {
      console.error("Error syncing to Google Sheets:", error);
      throw error;
    }
  }

  // Helper method to set up sheet headers
  static async setupSheetHeaders() {
    try {
      // Combine all possible columns to create the complete header row
      const headers = [
        ...SHEET_COLUMNS.BASE_COLUMNS,
        ...SHEET_COLUMNS.FOOD,
        ...SHEET_COLUMNS.FLOWER,
        ...SHEET_COLUMNS.BAKERY,
        ...SHEET_COLUMNS.SPECIALTY,
        ...SHEET_COLUMNS.FINAL_COLUMNS,
      ];
  
      // Calculate the end column letter based on the number of headers
      const endColumn = String.fromCharCode(64 + headers.length).toUpperCase();
  
      // Use spreadsheets.values.clear first to remove existing headers
      await sheets.spreadsheets.values.clear({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        range: `user-quotes!A1:${endColumn}1`,
      });
  
      // Then use append instead of update
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        range: `user-quotes!A1`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "OVERWRITE",
        requestBody: {
          values: [headers],
        },
      });
  
      console.log("Sheet headers setup successfully");
    } catch (error) {
      console.error("Error setting up sheet headers:", error);
      throw error;
    }
  }
}
