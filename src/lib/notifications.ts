// app/lib/notifications.ts
import sendEmail from "../app/actions/email";
import { emailTemplates } from "./email-templates";
import { FormDataUnion } from "../components/Auth/SignUp/FormSchemas";

export async function sendRegistrationNotification(userData: FormDataUnion) {
  const { subject, html } = emailTemplates.getRegistrationEmail({
    userType: userData.userType,
    email: userData.email,
    name: "name" in userData ? (userData.name as string) : undefined,
    company: "company" in userData ? (userData.company as string) : undefined,
  });

  return sendEmail({
    name: userData.email,
    email: userData.email,
    message: html,
    subject: subject,
  });
}