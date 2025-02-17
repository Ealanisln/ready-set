import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { Client } from "@sendgrid/client";
import { ClientRequest } from "@sendgrid/client/src/request";
import { sendDownloadEmail } from "@/app/actions/send-download-email";

const prisma = new PrismaClient();
const client = new Client();

if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_LIST_ID) {
  throw new Error('SendGrid configuration is missing');
}

client.setApiKey(process.env.SENDGRID_API_KEY);
const WEBSITE_LEADS_LIST_ID = process.env.SENDGRID_LIST_ID;

const FormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  industry: z.string(),
  newsletterConsent: z.boolean(),
  resourceSlug: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validatedData = FormSchema.parse(data);

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
      try {
        const sendgridData = {
          list_ids: [WEBSITE_LEADS_LIST_ID],
          contacts: [
            {
              email: validatedData.email.toLowerCase(),
              first_name: validatedData.firstName,
              last_name: validatedData.lastName,
              custom_fields: {
                industry: validatedData.industry,
              },
            },
          ],
        };

        const request: ClientRequest = {
          url: `/v3/marketing/contacts`,
          method: 'PUT' as const,
          body: sendgridData,
        };

        const [response, body] = await client.request(request);

        if (response.statusCode === 202) {
          console.log('Contact queued for processing', {
            jobId: body.job_id,
            email: validatedData.email,
          });
        } else {
          throw new Error(`Unexpected status code: ${response.statusCode}`);
        }
      } catch (error) {
        console.error('SendGrid subscription error:', {
          error,
          email: validatedData.email,
        });
      }
    }

    // Only send download email if resourceSlug exists
    if (validatedData.resourceSlug) {
      await sendDownloadEmail(
        validatedData.email,
        validatedData.firstName,
        validatedData.resourceSlug // Now TypeScript knows resourceSlug is defined in this block
      );
    }

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