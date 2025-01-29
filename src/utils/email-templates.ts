// utils/email-templates.ts
import {
  JobApplicationData,
  UserRegistrationData,
  QuoteRequestData,
} from "../types/email";

export const generateJobApplicationEmail = (data: JobApplicationData) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Job Application</h2>
        <div style="margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${data.message}
          </div>
        </div>
      </div>
    `;
};

export const generateUserRegistrationEmail = (data: UserRegistrationData) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New User Registration</h2>
        <div style="margin: 20px 0;">
          <p><strong>User Type:</strong> ${data.userType}</p>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company}</p>
          <p>Please review this registration in the admin dashboard.</p>
        </div>
      </div>
    `;
};

export const generateQuoteRequestEmail = (data: QuoteRequestData) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Food Delivery Quote Request</h2>
        <p><strong>Submission ID:</strong> ${data.submissionId}</p>
        
        <h3>Contact Information</h3>
        <div style="margin: 10px 0;">
          <p><strong>Company:</strong> ${data.company}</p>
          <p><strong>Contact Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          ${data.website ? `<p><strong>Website:</strong> ${data.website}</p>` : ""}
        </div>
  
        <h3>Delivery Details</h3>
        <div style="margin: 10px 0;">
          <p><strong>Counties:</strong> ${data.counties.join(", ")}</p>
          <p><strong>Pickup Address:</strong> ${data.pickupAddress}</p>
        </div>
  
        <h3>Service Specifications</h3>
        <div style="margin: 10px 0;">
          <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${JSON.stringify(data.specifications, null, 2)}
          </pre>
        </div>
  
        ${
          data.additionalInfo
            ? `
          <h3>Additional Information</h3>
          <div style="margin: 10px 0;">
            <p>${data.additionalInfo}</p>
          </div>
        `
            : ""
        }
      </div>
    `;
};
