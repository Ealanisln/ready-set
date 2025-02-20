"use server";

import { Client } from "@sendgrid/client";
import { resources } from "@/components/Resources/Data/Resources";
import { generateSlug } from "@/lib/create-slug";

export type ResourceSlug = string;
type Resource = (typeof resources)[number];

const RESOURCE_MAP = resources.reduce(
  (acc: Record<ResourceSlug, Resource>, resource: Resource) => {
    const slug = generateSlug(resource.title);
    return {
      ...acc,
      [slug]: resource,
    };
  },
  {} as Record<ResourceSlug, Resource>,
);

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = "solutions@readysetllc.com";
const FROM_NAME = "Ready Set";

if (!SENDGRID_API_KEY) {
  console.error("SENDGRID_API_KEY is not configured in environment variables");
  throw new Error("Email service not properly configured");
}

// Use a single client instance
const client = new Client();
client.setApiKey(SENDGRID_API_KEY);

export const sendDownloadEmail = async (
  userEmail: string,
  firstName: string,
  resourceSlug: ResourceSlug,
) => {
  try {
    // Input validation
    if (!userEmail || !firstName || !resourceSlug) {
      throw new Error("Missing required parameters for sending download email");
    }

    const resource = RESOURCE_MAP[resourceSlug];
    if (!resource || !resource.downloadUrl) {
      throw new Error(`Resource not found or missing download URL: ${resourceSlug}`);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      throw new Error("Invalid email format");
    }

    console.log("Attempting to send email:", {
      apiKeyExists: !!SENDGRID_API_KEY,
      apiKeyLength: SENDGRID_API_KEY?.length,
      fromEmail: FROM_EMAIL,
      toEmail: userEmail,
    });

    // Construct the email HTML
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Guide is Ready to Download</title>
  <style>
    .preheader { 
      display: none !important;
      visibility: hidden;
      opacity: 0;
      color: transparent;
      height: 0;
      width: 0;
      max-height: 0;
      max-width: 0;
      mso-hide: all;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #343434; background-color: #f4f4f4;">
  <div class="preheader" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
    You can access your free guide from this email at anytime
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding: 30px 40px; background-color: #fbd113;">
              <img src="https://ready-set.co/images/logo/logo.png" alt="Ready Set Logo" width="150" style="display: block;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px; color: #343434; font-size: 24px; font-weight: bold;">Hi ${firstName}!</h1>
              <p style="margin: 0 0 20px; font-size: 16px; color: #343434;">
                Thank you for downloading ${resource.title}. You can access your guide here:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${resource.downloadUrl}" style="display: inline-block; padding: 14px 30px; background-color: #fbd113; color: #343434; text-decoration: none; border-radius: 4px; font-weight: bold; text-align: center;">Download ${resource.title}</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0; font-size: 16px; color: #343434;">
                Looking to apply these strategies to your business? Schedule a free consultation with our team, and we'll help you get started.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 20px;">
                    <a href="https://ready-set.co/contact" style="display: inline-block; padding: 12px 25px; background-color: #facc15; color: #343434; text-decoration: none; border-radius: 4px; font-weight: bold; text-align: center;">Schedule a Consultation</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0; font-size: 16px; color: #343434;">
                All the best, <br>
                The Ready Set Team
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #343434; padding: 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://res.cloudinary.com/dlqu2l2ia/image/upload/v1738910182/logo-dark_aebe9q.png" alt="Ready Set Co Logo" style="margin-bottom: 20px; max-width: 200px; height: auto;">
                    <p style="margin: 0 0 10px; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px;">Follow us!</p>
                    <p style="margin: 0 0 20px;">
                      <a href="https://www.facebook.com/ReadySetCoGroup/" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                        <img src="https://readysetllc.com/images/social/1.png" alt="Facebook" style="width: 24px; height: 24px;">
                      </a>
                      <a href="https://www.tiktok.com/@readyset.co" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                        <img src="https://readysetllc.com/images/social/2.png" alt="TikTok" style="width: 24px; height: 24px;">
                      </a>
                      <a href="https://www.instagram.com/readyset.co/" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                        <img src="https://readysetllc.com/images/social/3.png" alt="Instagram" style="width: 24px; height: 24px;">
                      </a>
                      <a href="http://linkedin.com/company/ready-set-group-llc/" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                        <img src="https://readysetllc.com/images/social/4.png" alt="LinkedIn" style="width: 24px; height: 24px;">
                      </a>
                    </p>
                    <p style="color: #FFFFFF; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; margin: 0 0 10px;">
                      Ready Set Group, LLC | 166 Geary St, STE 1500 | San Francisco, CA 94108
                    </p>
                    <p style="margin: 0; color: #c4c2bd; font-size: 12px;">
                      This email was sent to ${userEmail} by Ready Set. If you did not request this download, please disregard this message.
                    </p>
                    <p style="margin: 10px 0 0; color: #c4c2bd; font-size: 12px;">
                      <a href="unsubscribe" style="color: #fbd113;">Unsubscribe</a> |
                      <a href="/privacy-policy" style="color: #fbd113;">Privacy Policy</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Try sending using v2 API
    const response = await fetch('https://api.sendgrid.com/api/mail.send.json', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_user: FROM_EMAIL,
        api_key: SENDGRID_API_KEY,
        to: userEmail,
        from: FROM_EMAIL,
        fromname: FROM_NAME,
        subject: "Your guide is ready to download",
        html: emailHtml
      })
    });

    console.log('SendGrid API Response:', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('SendGrid API Error:', errorData);
      throw new Error(`SendGrid API error: ${response.status} ${response.statusText}`);
    }

    return true;

  } catch (error) {
    console.error("Download email failed:", {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error instanceof Response ? await error.text() : undefined
      } : error,
      config: {
        apiKeyExists: !!SENDGRID_API_KEY,
        apiKeyPrefix: SENDGRID_API_KEY?.substring(0, 5),
        fromEmail: FROM_EMAIL
      }
    });

    throw error;
  }
};