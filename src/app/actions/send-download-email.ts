"use server";

import sgMail from "@sendgrid/mail";
import { resources } from "@/components/Resources/Data/Resources";
import { generateSlug } from "@/lib/create-slug";

// Create type for resource slugs based on existing resources
export type ResourceSlug = string;

// Define the Resource type based on the resources array structure
type Resource = (typeof resources)[number];

// Create a map of slugs to resources
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
const FROM_NAME = "Ready Set Website";

if (!SENDGRID_API_KEY) {
  throw new Error(
    "SENDGRID_API_KEY is not configured in environment variables",
  );
}

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendDownloadEmail = async (
  userEmail: string,
  firstName: string,
  resourceSlug: ResourceSlug,
) => {
  // Validate inputs
  if (!userEmail || !firstName || !resourceSlug) {
    throw new Error("Missing required parameters for sending download email");
  }

  const resource = RESOURCE_MAP[resourceSlug];

  if (!resource || !resource.downloadUrl) {
    throw new Error(
      `Resource not found or missing download URL: ${resourceSlug}`,
    );
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
    throw new Error("Invalid email format");
  }

  const msg = {
    to: userEmail,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    subject: `Your ${resource.title} Download`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Download from Ready Set</title>
        </head>
        <body style="
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #343434;
          background-color: #f4f4f4;
        ">
          <!-- Main Container -->
          <table width="100%" cellpadding="0" cellspacing="0" style="
            background-color: #f4f4f4;
            padding: 20px;
          ">
            <tr>
              <td align="center">
                <!-- Email Content Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                  <!-- Header with Logo -->
                  <tr>
                    <td align="center" style="padding: 30px 40px; background-color: #fbd113;">
                      <img src="https://ready-set.co/images/logo/logo.png" alt="Ready Set Logo" width="150" style="display: block;">
                    </td>
                  </tr>
  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h1 style="
                        margin: 0 0 20px;
                        color: #343434;
                        font-size: 24px;
                        font-weight: bold;
                      ">Thanks for downloading, ${firstName}!</h1>
                      
                      <p style="margin: 0 0 20px; font-size: 16px; color: #343434;">
                        We're excited to share this resource with you. Click the button below to access your download:
                      </p>
  
                      <!-- Download Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${resource.downloadUrl}" style="
                              display: inline-block;
                              padding: 14px 30px;
                              background-color: #fbd113;
                              color: #343434;
                              text-decoration: none;
                              border-radius: 4px;
                              font-weight: bold;
                              text-align: center;
                            ">Download ${resource.title}</a>
                          </td>
                        </tr>
                      </table>
  
                      <p style="margin: 20px 0; font-size: 16px; color: #343434;">
                        Ready to take your strategy to the next level? Our team is here to help you implement these insights effectively.
                      </p>
  
                      <!-- Consultation Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 10px 0 20px;">
                            <a href="https://ready-set.co/contact" style="
                              display: inline-block;
                              padding: 12px 25px;
                              background-color: #facc15;
                              color: #343434;
                              text-decoration: none;
                              border-radius: 4px;
                              font-weight: bold;
                              text-align: center;
                            ">Schedule a Consultation</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #343434; padding: 30px 40px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <!-- Social Media Links -->
                            <p style="margin: 0 0 20px;">
                              <a href="https://twitter.com/readyset" style="
                                display: inline-block;
                                margin: 0 10px;
                                text-decoration: none;
                              "><img src="https://ready-set.co/twitter-icon.png" alt="Twitter" width="24"></a>
                              <a href="https://linkedin.com/company/readyset" style="
                                display: inline-block;
                                margin: 0 10px;
                                text-decoration: none;
                              "><img src="https://ready-set.co/linkedin-icon.png" alt="LinkedIn" width="24"></a>
                            </p>
                            
                            <!-- Contact Information -->
                            <p style="
                              margin: 0 0 10px;
                              color: #c4c2bd;
                              font-size: 14px;
                            ">
                              Ready Set | 123 Business Ave, Suite 100 | City, State 12345
                            </p>
                            
                            <!-- Legal Text -->
                            <p style="
                              margin: 0;
                              color: #c4c2bd;
                              font-size: 12px;
                            ">
                              This email was sent to ${userEmail}. If you did not request this download,
                              please disregard this email.
                            </p>
                            
                            <!-- Unsubscribe Link -->
                            <p style="
                              margin: 10px 0 0;
                              color: #c4c2bd;
                              font-size: 12px;
                            ">
                              <a href="{{{unsubscribe}}}" style="color: #fbd113;">Unsubscribe</a> |
                              <a href="https://ready-set.co/privacy" style="color: #fbd113;">Privacy Policy</a>
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
      </html>
    `,
  };

  try {
    // Attempt to send email
    const [response] = await sgMail.send(msg);

    if (response.statusCode !== 202) {
      throw new Error(`Unexpected status code: ${response.statusCode}`);
    }

    return true;
  } catch (error: unknown) {
    // Type guard for error object
    if (error instanceof Error) {
      console.error("Download email failed:", {
        error: {
          message: error.message,
          code: (error as any).code,
          response: (error as any).response?.body,
          statusCode: (error as any).response?.statusCode,
          headers: (error as any).response?.headers,
        },
      });
    }
    // Re-throw the error so we can see it in the client
    throw error;
  }
};
