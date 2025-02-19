// src/lib/email-service.ts

import sgMail from "@sendgrid/mail";
import {
  FormType,
  DeliveryFormData,
} from "@/components/Logistics/QuoteRequest/types";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

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

    // Create HTML content for specifications
    const specsList = Object.entries(specifications)
      .map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, " $1").trim();
        const formattedValue = Array.isArray(value) ? value.join(", ") : value;
        return `<li><strong>${formattedKey}:</strong> ${formattedValue || "N/A"}</li>`;
      })
      .join("");

    const htmlContent = `
      <h2>New ${formType ? formType.charAt(0).toUpperCase() + formType.slice(1) : "Unknown"} Delivery Quote Request</h2>
      <p>Submission ID: ${submissionId}</p>
      
      <h3>Contact Information</h3>
      <ul>
        <li><strong>Company:</strong> ${companyName}</li>
        <li><strong>Contact Name:</strong> ${contactName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Website:</strong> ${website || "N/A"}</li>
      </ul>

      <h3>Delivery Details</h3>
      <ul>
        <li><strong>Counties:</strong> ${counties?.join(", ") || "N/A"}</li>
        <li><strong>Pickup Address:</strong> ${formattedAddress}</li>
      </ul>

      <h3>Service Specifications</h3>
      <ul>
        ${specsList}
      </ul>

      <h3>Additional Information</h3>
      <p>${additionalComments || "No additional comments provided."}</p>
    `;

    const msg = {
      to: process.env.NOTIFICATION_RECIPIENT || 'info@ready-set.co', // Add this line
      from: 'Ready Set Website <updates@updates.readysetllc.com>',
      subject: `New ${formType} Delivery Quote Request - ${companyName}`,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]*>/g, ""), // Strip HTML for plain text version
    };

    try {
      await sgMail.send(msg);
      console.log("Notification email sent successfully");
    } catch (error) {
      console.error("Error sending notification email:", error);
      throw error;
    }
  }
}
