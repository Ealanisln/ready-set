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
    try {
      // 1. Save to PostgreSQL
      const submission = await prisma.formSubmission.create({
        data: {
          formType: data.formType.toUpperCase() as FormSubmissionType,
          userId: data.userId,
          companyName: data.formData.companyName,
          contactName: data.formData.contactName,
          email: data.formData.email,
          phone: data.formData.phone,
          counties: data.formData.counties || [],
          frequency: data.formData.frequency,
          pickupAddress: data.formData.pickupAddress,
          specifications: data.formData.specifications,
          notes: data.formData.notes,
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
      const values = [
        [
          submission.id,
          submission.formType,
          submission.companyName,
          submission.contactName,
          submission.email,
          submission.phone,
          submission.counties.join(", "),
          submission.frequency,
          JSON.stringify(submission.pickupAddress),
          JSON.stringify(submission.specifications),
          submission.notes,
          submission.createdAt.toISOString(),
        ],
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        range: "Form Submissions!A:L", // Adjust based on your columns
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

  // Add this method to handle failed syncs
  static async syncFailedSubmissions() {
    const failedSubmissions = await prisma.formSubmission.findMany({
      where: { syncedToSheets: false },
    });

    for (const submission of failedSubmissions) {
      await this.syncToGoogleSheets(submission);
    }
  }
}
