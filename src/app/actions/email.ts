// app/actions/send-email.ts
"use server";

import { Resend } from "resend";
import { EmailTemplate } from "@/components/Email/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

interface FormInputs {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

const sendEmail = async (data: FormInputs) => {
  // Validate message length
  if (data.message.length > 1000) {
    throw new Error("Message cannot exceed 1000 characters.");
  }
  // Determine if this is a job application
  const isJobApplication = !data.phone;
  const emailSubject = isJobApplication
    ? "New Job Application - Ready Set"
    : "Website message - Ready Set";

  try {
    const { data: responseData, error } = await resend.emails.send({
      from: "Ready Set Website <updates@updates.readysetllc.com>",
      to: ["info@ready-set.co"],
      subject: emailSubject,
      react: EmailTemplate({ data, isJobApplication }),
    });

    if (error) {
      console.error("Email sending error:", error);
      throw new Error("Error trying to send the message.");
    }

    return "Your message was sent successfully.";
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Error trying to send the message.");
  }
};

export default sendEmail;
