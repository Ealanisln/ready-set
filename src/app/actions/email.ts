'use server';

import sgMail from "@sendgrid/mail";

interface FormInputs {
  name: string;
  email: string;
  phone?: string; // Made optional since job applications might not need it
  message: string;
  subject?: string; // Added optional subject field
}

const sendEmail = async(data: FormInputs) => {
    // Determine if this is a job application
    const isJobApplication = !data.phone;
    const emailSubject = isJobApplication 
      ? "New Job Application - Ready Set"
      : "Website message - Ready Set";

    let body = `
      <p>${isJobApplication ? 'New job application' : 'Someone sent you a message'} from Ready Set Website:</p>
    `;
  
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key as keyof FormInputs];
        body += `<p>${key}: ${value}</p>`;
      }
    }
  
    const msg = {
      to: "info@ready-set.co",
      from: "emmanuel@alanis.dev",
      subject: emailSubject,
      html: body,
    };
  
    sgMail.setApiKey(process.env.SEND_API_KEY || "");
  
    try {
      await sgMail.send(msg);
      return "Your message was sent successfully."; 
    } catch (error) {
      throw new Error("Error trying to send the message.");
    }
}

export default sendEmail;