// src/utils/email.ts
import sgMail from '@sendgrid/mail';

type EmailPayload = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

// Ensure SendGrid API key is set
const SENDGRID_API_KEY = process.env.SEND_API_KEY;
if (!SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY is not set in environment variables');
}

sgMail.setApiKey(SENDGRID_API_KEY || '');

export const sendEmail = async (data: EmailPayload): Promise<[sgMail.ClientResponse, {}]> => {
  // Ensure at least one of html or text is provided
  if (!data.html && !data.text) {
    throw new Error('Either html or text content must be provided');
  }

  const msg: sgMail.MailDataRequired = {
    to: data.to,
    from: process.env.EMAIL_FROM || 'emmanuel@alanis.dev',
    subject: data.subject,
    content: [
      {
        type: data.html ? 'text/html' : 'text/plain',
        value: data.html || data.text || ''
      }
    ]
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent successfully');
    return response;
  } catch (error: any) {
    console.error('Error sending email:', error?.response?.body || error);
    throw new Error('Failed to send email: ' + (error?.message || 'Unknown error'));
  }
};