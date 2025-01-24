import sgMail from '@sendgrid/mail';
import type { MailDataRequired } from '@sendgrid/mail';

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

export const sendEmail = async (data: EmailPayload) => {
  // Validate email address
  if (!data.to || !data.to.trim()) {
    throw new Error('Recipient email address is required');
  }

  // Ensure at least one of html or text is provided and is non-empty
  if ((!data.html || data.html.trim().length === 0) && (!data.text || data.text.trim().length === 0)) {
    throw new Error('Either html or text content must be provided and non-empty');
  }

  const fromEmail = process.env.EMAIL_FROM || 'emmanuel@alanis.dev';

  const msg: MailDataRequired = {
    to: { email: data.to.trim() },
    from: { email: fromEmail },
    subject: data.subject,
    content: [{
      type: data.html ? 'text/html' : 'text/plain',
      value: (data.html || data.text || '').trim()
    }]
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent successfully to:', data.to);
    return response;
  } catch (error: any) {
    const errorBody = error?.response?.body;
    console.error('Error sending email:', {
      recipient: data.to,
      error: errorBody || error
    });
    
    // Provide more specific error messages
    if (errorBody?.errors?.[0]?.message) {
      throw new Error(`Failed to send email: ${errorBody.errors[0].message}`);
    }
    throw new Error('Failed to send email: ' + (error?.message || 'Unknown error'));
  }
};