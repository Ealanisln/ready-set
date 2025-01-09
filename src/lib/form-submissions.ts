// src/lib/form-submissions.ts

import { prisma } from "@/utils/prismaDB";
import { google } from "googleapis";
import {
  DeliveryFormData,
  FormType,
} from "@/components/Logistics/QuoteRequest/types";
import { FormSubmissionType } from "@prisma/client";

// Define form types
type FormSectionKey = "FOOD" | "FLOWER" | "BAKERY" | "SPECIALTY";

type SheetColumnsType = {
  COMMON: string[];
  SECTIONS: {
    [K in FormSectionKey]: {
      title: string;
      sheetName: string;
      columns: string[];
    };
  };
};

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SHEET_COLUMNS: SheetColumnsType = {
  COMMON: [
    "ID",
    "Form Type",
    "Company Name",
    "Contact Name",
    "Email",
    "Phone",
    "Counties",
    "Pickup Address",
    "Notes",
    "Created At",
  ],
  SECTIONS: {
    FOOD: {
      title: "Food Delivery",
      sheetName: "Food-Quotes",
      columns: [
        "Service Type",
        "Delivery Radius",
        "Delivery Times",
        "Order Headcount",
        "Total Staff",
        "Expected Deliveries",
        "Frequency",
        "Drivers Needed",
        "Partnered Services",
        "Multiple Locations",
      ],
    },
    FLOWER: {
      title: "Flower Delivery",
      sheetName: "Flower-Quotes",
      columns: [
        "Service Type",
        "Delivery Radius",
        "Delivery Types",
        "Brokerage Services",
        "Delivery Frequency",
        "Supply Pickup Frequency",
        "Frequency",
        "Drivers Needed",
      ],
    },
    BAKERY: {
      title: "Bakery Delivery",
      sheetName: "Bakery-Quotes",
      columns: [
        "Service Type",
        "Delivery Radius",
        "Delivery Types",
        "Partner Services",
        "Routing App",
        "Delivery Frequency",
        "Supply Pickup Frequency",
        "Frequency",
        "Drivers Needed",
      ],
    },
    SPECIALTY: {
      title: "Specialty Delivery",
      sheetName: "Specialty-Quotes",
      columns: [
        "Service Type",
        "Delivery Radius",
        "Delivery Types",
        "Fragile Package",
        "Package Description",
        "Delivery Frequency",
        "Supply Pickup Frequency",
        "Frequency",
        "Drivers Needed",
      ],
    },
  },
};

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
    userId?: string;
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

      const specifications = data.formData.specifications;

      const submission = await prisma.formSubmission.create({
        data: {
          formType: formTypeMap[data.formType.toLowerCase()],
          userId: data.userId,
          companyName: normalizeValue(data.formData.companyName),
          contactName: data.formData.contactName,
          email: data.formData.email,
          phone: data.formData.phone,
          counties: data.formData.counties || [],
          frequency:
            "frequency" in specifications ? specifications.frequency : "N/A",
          pickupAddress: data.formData.pickupAddress || {
            street: "",
            city: "",
            state: "",
            zip: "",
          },
          specifications: JSON.stringify(specifications),
          notes: "",
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

      await this.syncToGoogleSheets(submission);

      return submission;
    } catch (error) {
      console.error("Error in form submission:", error);
      throw error;
    }
  }

  static async setupSheetHeaders() {
    try {
      const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;

      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
      });

      const existingSheets =
        spreadsheet.data.sheets?.map((sheet) => sheet.properties?.title) || [];

      for (const [formType, section] of Object.entries(
        SHEET_COLUMNS.SECTIONS,
      )) {
        if (!existingSheets.includes(section.sheetName)) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: section.sheetName,
                    },
                  },
                },
              ],
            },
          });
        }

        const headers = [...SHEET_COLUMNS.COMMON, ...section.columns];
        const endColumn = String.fromCharCode(64 + headers.length);

        await sheets.spreadsheets.values.clear({
          spreadsheetId,
          range: `${section.sheetName}!A1:${endColumn}1`,
        });

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${section.sheetName}!A1:${endColumn}1`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [headers],
          },
        });

        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: spreadsheet.data.sheets?.find(
                      (sheet) => sheet.properties?.title === section.sheetName,
                    )?.properties?.sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: headers.length,
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 0.8, green: 0.8, blue: 0.8 },
                      textFormat: { bold: true },
                      horizontalAlignment: "CENTER",
                    },
                  },
                  fields:
                    "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                },
              },
            ],
          },
        });
      }

      console.log("Sheet headers setup successfully");
    } catch (error) {
      console.error("Error setting up sheet headers:", error);
      throw error;
    }
  }

  private static getFormSpecificValues(
    formType: FormSectionKey,
    specifications: any,
  ): string[] {
    const section = SHEET_COLUMNS.SECTIONS[formType];
    if (!section) {
      console.warn(`Unknown form type: ${formType}`);
      return [];
    }

    return section.columns.map((column) => {
      // Convert column name to camelCase for matching object keys
      const key = column
        .toLowerCase()
        .replace(/\s+(.)/g, (match, group1) => group1.toUpperCase())
        .replace(/\s+/g, "");

      let value = specifications[key];

      // Special handling for arrays
      if (Array.isArray(value)) {
        return value.join(", ");
      }

      return normalizeValue(value);
    });
  }

  private static async syncToGoogleSheets(submission: any) {
    try {
      const formType = submission.formType.toUpperCase() as FormSectionKey;
      const section = SHEET_COLUMNS.SECTIONS[formType];

      if (!section) {
        throw new Error(`Unknown form type: ${formType}`);
      }

      const specifications =
        typeof submission.specifications === "string"
          ? JSON.parse(submission.specifications)
          : submission.specifications;

      console.log("Processing specifications:", specifications); // Debug log

      const address = submission.pickupAddress;
      const formattedAddress = address
        ? `${address.street}, ${address.city}, ${address.state} ${address.zip}`
        : "N/A";

      const commonValues = [
        submission.id,
        submission.formType,
        normalizeValue(submission.companyName),
        normalizeValue(submission.contactName),
        normalizeValue(submission.email),
        normalizeValue(submission.phone),
        submission.counties?.join(", ") || "N/A",
        formattedAddress,
        normalizeValue(submission.notes),
        submission.createdAt.toISOString(),
      ];

      // Get form-specific values with better logging
      const formSpecificValues = this.getFormSpecificValues(
        formType,
        specifications,
      );
      console.log("Form specific values:", {
        formType,
        values: formSpecificValues,
        columns: section.columns,
      });

      const values = [[...commonValues, ...formSpecificValues]];

      // Log the final values being written
      console.log("Writing to sheet:", {
        sheetName: section.sheetName,
        headers: [...SHEET_COLUMNS.COMMON, ...section.columns],
        values: values[0],
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        range: `${section.sheetName}!A2`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      });

      console.log("Successfully synced to sheets:", {
        submissionId: submission.id,
        formType,
        sheetName: section.sheetName,
      });

      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: { syncedToSheets: true },
      });
    } catch (error) {
      console.error("Error syncing to Google Sheets:", error);
      throw error;
    }
  }
}
