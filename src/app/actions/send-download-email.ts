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
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Thanks for downloading, ${firstName}!</h2>
          <p>Here's your guide: <a href="${resource.downloadUrl}" style="color: #007bff;">Download ${resource.title}</a></p>
          <p>Need help implementing these strategies? <a href="https://ready-set.co/contact" style="color: #007bff;">Schedule a consultation</a></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            This email was sent by Ready Set. If you did not request this download, 
            please disregard this email.
          </p>
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
