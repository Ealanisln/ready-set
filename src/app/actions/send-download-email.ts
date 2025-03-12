"use server";

import { Resend } from 'resend';
import { resources } from "@/components/Resources/Data/Resources";
import { generateSlug } from "@/lib/create-slug";
import { DownloadEmailTemplate } from '@/components/Resources/DownloadEmailTemplate';

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

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "solutions@updates.readysetllc.com";
const FROM_NAME = "Ready Set";

if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not configured in environment variables");
  throw new Error("Email service not properly configured");
}

// Create a single Resend instance
const resend = new Resend(RESEND_API_KEY);

export const sendDownloadEmail = async (
  userEmail: string,
  firstName: string,
  resourceSlug: ResourceSlug,
  resourceUrl?: string, // Add optional resourceUrl parameter
) => {
  try {
    // Input validation
    if (!userEmail || !firstName || !resourceSlug) {
      throw new Error("Missing required parameters for sending download email");
    }

    const resource = RESOURCE_MAP[resourceSlug];
    if (!resource && !resourceUrl) {
      throw new Error(`Resource not found or missing download URL: ${resourceSlug}`);
    }

    // Use the provided resourceUrl if available, otherwise fall back to the resource's downloadUrl
    const downloadUrl = resourceUrl || (resource?.downloadUrl);
    
    if (!downloadUrl) {
      throw new Error(`No download URL available for resource: ${resourceSlug}`);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      throw new Error("Invalid email format");
    }

    console.log("Attempting to send email:", {
      apiKeyExists: !!RESEND_API_KEY,
      apiKeyLength: RESEND_API_KEY?.length,
      fromEmail: FROM_EMAIL,
      toEmail: userEmail,
    });

    // Get the title from the resource map or use a default if not found
    const resourceTitle = resource?.title || "Resource";

    // Create an async function that returns a Promise<ReactNode>
    const emailTemplate = async () => {
      return DownloadEmailTemplate({ 
        firstName, 
        resourceTitle, 
        downloadUrl, 
        userEmail 
      });
    };

    // Send email using Resend with React template
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [userEmail],
      subject: "Your guide is ready to download",
      react: await emailTemplate(),
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(`Resend API error: ${error.message}`);
    }

    console.log('Resend API Response:', data);
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
        apiKeyExists: !!RESEND_API_KEY,
        apiKeyPrefix: RESEND_API_KEY?.substring(0, 5),
        fromEmail: FROM_EMAIL
      }
    });

    throw error;
  }
};