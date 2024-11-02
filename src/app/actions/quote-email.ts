// src/app/actions/quote-email.ts
'use server';

import sgMail from "@sendgrid/mail";

interface QuoteFormInputs {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  message: string;
}

export const sendQuoteEmail = async(data: QuoteFormInputs) => {
  let body = `
    <h2>New Quote Request from Ready Set Website</h2>
    <p>A new quote request has been submitted with the following details:</p>
    <ul>
      <li><strong>Company:</strong> ${data.companyName}</li>
      <li><strong>Contact Person:</strong> ${data.contactPerson}</li>
      <li><strong>Email:</strong> ${data.email}</li>
      <li><strong>Phone:</strong> ${data.phone}</li>
      <li><strong>Message:</strong> ${data.message}</li>
    </ul>
  `;

  const msg = {
    to: "info@ready-set.co",
    from: "emmanuel@alanis.dev",
    subject: "Quote Request - Ready Set Logistics",
    html: body,
  };

  sgMail.setApiKey(process.env.SEND_API_KEY || "");

  try {
    await sgMail.send(msg);
    return "Your quote request has been sent successfully. We'll be in touch soon!";
  } catch (error) {
    throw new Error("Error sending quote request. Please try again later.");
  }
};