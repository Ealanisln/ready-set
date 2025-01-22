// src/lib/form-submissions.ts

import { prisma } from "@/utils/prismaDB";
import { google } from "googleapis";
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
    "Website",
    "Counties",
    "Additional Comments",
    "Pickup Address",
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

      const submission = await prisma.formSubmission.create({
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

    // Remove the nested specifications level if it exists
    const specs = specifications.specifications || specifications;

    // Map column names to their corresponding field names in camelCase
    const columnMappings: Record<FormSectionKey, Record<string, string>> = {
      FOOD: {
        "Service Type": "serviceType",
        "Delivery Radius": "deliveryRadius",
        "Delivery Times": "deliveryTimes",
        "Order Headcount": "orderHeadcount",
        "Total Staff": "totalStaff",
        "Expected Deliveries": "expectedDeliveries",
        Frequency: "frequency",
        "Drivers Needed": "driversNeeded",
        "Partnered Services": "partneredServices",
        "Multiple Locations": "multipleLocations",
      },
      SPECIALTY: {
        "Service Type": "serviceType",
        "Delivery Radius": "deliveryRadius",
        "Delivery Types": "deliveryTypes",
        "Fragile Package": "fragilePackage",
        "Package Description": "packageDescription",
        "Delivery Frequency": "deliveryFrequency",
        "Supply Pickup Frequency": "supplyPickupFrequency",
        Frequency: "frequency",
        "Drivers Needed": "driversNeeded",
      },
      FLOWER: {
        "Service Type": "serviceType",
        "Delivery Radius": "deliveryRadius",
        "Delivery Types": "deliveryTypes",
        "Brokerage Services": "brokerageServices",
        "Delivery Frequency": "deliveryFrequency",
        "Supply Pickup Frequency": "supplyPickupFrequency",
        Frequency: "frequency",
        "Drivers Needed": "driversNeeded",
      },
      BAKERY: {
        "Service Type": "serviceType",
        "Delivery Radius": "deliveryRadius",
        "Delivery Types": "deliveryTypes",
        "Partner Services": "partnerServices",
        "Routing App": "routingApp",
        "Delivery Frequency": "deliveryFrequency",
        "Supply Pickup Frequency": "supplyPickupFrequency",
        Frequency: "frequency",
        "Drivers Needed": "driversNeeded",
      },
    };

    return section.columns.map((column) => {
      const formMapping = columnMappings[formType];
      if (!formMapping) {
        console.warn(`No mapping found for form type: ${formType}`);
        return "N/A";
      }

      const fieldName = formMapping[column];
      if (!fieldName) {
        console.warn(
          `No mapping found for column: ${column} in form type: ${formType}`,
        );
        return "N/A";
      }

      const value = specs[fieldName];
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

      let specifications = submission.specifications;
      // Parse specifications if it's a string
      if (typeof specifications === "string") {
        specifications = JSON.parse(specifications);
      }

      console.log("Processing specifications:", specifications);

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
        normalizeValue(submission.website),
        submission.counties && submission.counties.length > 0
          ? submission.counties.join(", ")
          : "N/A",
        normalizeValue(submission.additionalComments),
        formattedAddress,
        submission.createdAt.toISOString(),
      ];

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
