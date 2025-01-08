import { prisma } from "@/utils/prismaDB";
import { google } from "googleapis";
import { FormType } from "@/components/Logistics/QuoteRequest/types";
import { FormSubmissionType } from "@prisma/client";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
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

    // Map the form type to the enum
    const formTypeMap: Record<string, FormSubmissionType> = {
      'food': FormSubmissionType.food,
      'flower': FormSubmissionType.flower,
      'bakery': FormSubmissionType.bakery,
      'specialty': FormSubmissionType.specialty,
    };

    try {
      // Format the address and specifications data
      const pickupAddress = {
        street: data.formData.streetAddress,
        city: data.formData.city,
        state: data.formData.state,
        zip: data.formData.zipCode,
      };

      const specifications = {
        driversNeeded: data.formData.driversNeeded,
        serviceType: data.formData.serviceType,
        deliveryRadius: data.formData.deliveryRadius,
        deliveryTypes: data.formData.deliveryTypes || [],
        orderHeadcount: data.formData.orderHeadcount,
      };

      // 1. Save to PostgreSQL
      const submission = await prisma.formSubmission.create({
        data: {
          formType: formTypeMap[data.formType.toLowerCase()],
          userId: data.userId,
          companyName: data.formData.companyName,
          contactName: data.formData.contactName,
          email: data.formData.email,
          phone: data.formData.phone,
          counties: data.formData.selectedCounties || [],
          frequency: data.formData.frequency,
          pickupAddress,
          specifications,
          notes: data.formData.notes || "",
        },
      });

      // 2. Sync to Google Sheets
      await this.syncToGoogleSheets(submission);

      return submission;
    } catch (error) {
      console.error("Error in form submission:", error);
      throw error;
    }
  }

  private static async syncToGoogleSheets(submission: any) {
    try {
      // Format the data for better readability in sheets
      const specifications = submission.specifications as any;
      const address = submission.pickupAddress as any;
      const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
      
      const values = [
        [
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
          specifications?.deliveryTypes?.join(", ") || "N/A",
          specifications?.orderHeadcount || "N/A",
          submission.notes || 'N/A',
          submission.createdAt.toISOString(),
        ],
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        range: "Form Submissions!A:P", // Matches our columns
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      });

      // Mark as synced in database
      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: { syncedToSheets: true },
      });
    } catch (error) {
      console.error("Error syncing to Google Sheets:", error);
      // Don't throw - we'll handle failed syncs separately
    }
  }

  static async syncFailedSubmissions() {
    const failedSubmissions = await prisma.formSubmission.findMany({
      where: { syncedToSheets: false },
    });

    for (const submission of failedSubmissions) {
      await this.syncToGoogleSheets(submission);
    }
  }
}