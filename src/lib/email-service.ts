// src/lib/email-service.ts

import { Resend } from "resend";
import {
  FormType,
  DeliveryFormData,
} from "@/components/Logistics/QuoteRequest/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  static async sendFormSubmissionNotification(data: {
    formType: FormType;
    formData: DeliveryFormData;
    submissionId: string;
  }) {
    const { formType, formData, submissionId } = data;
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
    } = formData;

    const formattedAddress = pickupAddress
      ? `${pickupAddress.street}, ${pickupAddress.city}, ${pickupAddress.state} ${pickupAddress.zip}`
      : "N/A";

    // Improved specifications handling
    const formatSpecificationValue = (value: any): string => {
      if (value === null || value === undefined) return "N/A";
      if (Array.isArray(value)) return value.join(", ");
      if (typeof value === "object") {
        // Handle nested objects
        return Object.entries(value)
          .map(([k, v]) => `${k}: ${formatSpecificationValue(v)}`)
          .join(", ");
      }
      return String(value);
    };

    // Create HTML content for specifications with improved formatting
    const specsList = Object.entries(specifications)
      .map(([key, value]) => {
        // Convert camelCase to Title Case
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, str => str.toUpperCase())
          .trim();
        const formattedValue = formatSpecificationValue(value);
        return `<li><strong>${formattedKey}:</strong> ${formattedValue}</li>`;
      })
      .join("");

    const formTypeDisplay = formType ? formType.charAt(0).toUpperCase() + formType.slice(1) : "Unknown";

    const htmlContent = `
      <h2>New ${formTypeDisplay} Delivery Quote Request</h2>
      <p>Submission ID: ${submissionId}</p>
      
      <h3>Contact Information</h3>
      <ul>
        <li><strong>Company:</strong> ${companyName || "N/A"}</li>
        <li><strong>Contact Name:</strong> ${contactName || "N/A"}</li>
        <li><strong>Email:</strong> ${email || "N/A"}</li>
        <li><strong>Phone:</strong> ${phone || "N/A"}</li>
        <li><strong>Website:</strong> ${website || "N/A"}</li>
      </ul>

      <h3>Delivery Details</h3>
      <ul>
        <li><strong>Counties:</strong> ${counties?.join(", ") || "N/A"}</li>
        <li><strong>Pickup Address:</strong> ${formattedAddress}</li>
      </ul>

      ${specsList ? `
      <h3>Service Specifications</h3>
      <ul>
        ${specsList}
      </ul>
      ` : ""}

      <h3>Additional Information</h3>
      <p>${additionalComments || "No additional comments provided."}</p>
    `;

    try {
      await resend.emails.send({
        to: process.env.NOTIFICATION_RECIPIENT || 'info@ready-set.co',
        from: 'Ready Set Website <updates@updates.readysetllc.com>',
        subject: `New ${formTypeDisplay} Delivery Quote Request - ${companyName}`,
        html: htmlContent,
        text: htmlContent.replace(/<[^>]*>/g, ""), // Strip HTML for plain text version
      });
      console.log("Notification email sent successfully");
    } catch (error) {
      console.error("Error sending notification email:", error);
      throw error;
    }
  }
}
