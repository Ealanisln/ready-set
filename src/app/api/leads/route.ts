import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import sgMail from "@sendgrid/mail";
import { sendDownloadEmail } from "@/app/actions/send-download-email";

const prisma = new PrismaClient();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const WEBSITE_LEADS_LIST_ID = process.env.SENDGRID_LIST_ID;

const FormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  industry: z.string(),
  newsletterConsent: z.boolean(),
  resourceSlug: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validatedData = FormSchema.parse(data);

    // Create lead in your database
    const lead = await prisma.lead_capture.upsert({
      where: {
        email: validatedData.email,
      },
      update: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        industry: validatedData.industry,
        newsletter_consent: validatedData.newsletterConsent,
      },
      create: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        industry: validatedData.industry,
        newsletter_consent: validatedData.newsletterConsent,
      },
    });

    if (validatedData.newsletterConsent) {
      // Structure the contact data according to SendGrid's API
      const sendgridPayload = {
        contacts: [
          {
            email: validatedData.email,
            first_name: validatedData.firstName,
            last_name: validatedData.lastName,
            custom_fields: {
              industry: validatedData.industry,
            },
          },
        ],
        list_ids: [WEBSITE_LEADS_LIST_ID],
      };

      const response = await fetch(
        "https://api.sendgrid.com/v3/marketing/contacts",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendgridPayload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();

        // First, let's try to get the list of valid custom fields
        const fieldsResponse = await fetch(
          "https://api.sendgrid.com/v3/marketing/field_definitions",
          {
            headers: {
              Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
              "Content-Type": "application/json",
            },
          },
        );

        const fieldsData = await fieldsResponse.json();

        console.error("SendGrid subscription failed:", {
          status: response.status,
          statusText: response.statusText,
          errors: errorData,
          listId: WEBSITE_LEADS_LIST_ID,
          payload: sendgridPayload,
          availableFields: fieldsData, 
        });
      }
    }

    // Send download email
    await sendDownloadEmail(
      validatedData.email,
      validatedData.firstName,
      validatedData.resourceSlug,
    );

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error processing lead:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to process lead" },
      { status: 500 },
    );
  }
}
