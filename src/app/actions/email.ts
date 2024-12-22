"use server";

import axios from "axios";

interface FormInputs {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

const sendEmail = async (data: FormInputs) => {
  // Determine if this is a job application
  const isJobApplication = !data.phone;
  const emailSubject = isJobApplication
    ? "New Job Application - Ready Set"
    : "Website message - Ready Set";

  // Create the HTML body
  let body = `
    <html>
      <body>
        <p>${isJobApplication ? "New job application" : "Someone sent you a message"} from Ready Set Website:</p>
  `;

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key as keyof FormInputs];
      body += `<p><strong>${key}:</strong> ${value}</p>`;
    }
  }

  body += "</body></html>";

  // Prepare the email payload according to Brevo's API structure
  const emailData = {
    sender: {
      name: "Ready Set Website",
      email: "updates@readysetllc.com",
    },
    to: [
      {
        email: "info@readysetllc.com",
        name: "Ready Set",
      },
    ],
    subject: emailSubject,
    htmlContent: body,
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      emailData,
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      },
    );

    if (response.status === 201) {
      return "Your message was sent successfully.";
    } else {
      throw new Error("Unexpected response from email service");
    }
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Error trying to send the message.");
  }
};

export default sendEmail;
