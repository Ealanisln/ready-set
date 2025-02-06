// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { sendDownloadEmail } from '@/app/actions/send-download-email';

const prisma = new PrismaClient();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  industry: z.string(),
  newsletterConsent: z.boolean(),
  resourceSlug: z.string()
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validatedData = FormSchema.parse(data);

    const lead = await prisma.lead_capture.create({
      data: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        industry: validatedData.industry,
        newsletter_consent: validatedData.newsletterConsent
      }
    });

    if (validatedData.newsletterConsent) {
      const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contacts: [{
            email: validatedData.email,
            first_name: validatedData.firstName,
            last_name: validatedData.lastName,
            custom_fields: {
              industry: validatedData.industry
            }
          }]
        })
      });

      if (!response.ok) {
        console.error('SendGrid subscription failed');
      }
    }

     await sendDownloadEmail(
      validatedData.email,
      validatedData.firstName,
      validatedData.resourceSlug
    );

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process lead' },
      { status: 500 }
    );
  }
}