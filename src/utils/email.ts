import { Resend } from 'resend';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (data: EmailPayload) => {
  try {
    const fromAddress = process.env.EMAIL_FROM || 'noreply@updates.readysetllc.com';
    console.log(`[DEBUG] Sending email from: ${fromAddress}`);

    const response = await resend.emails.send({
      to: data.to,
      from: fromAddress,
      subject: data.subject,
      html: data.html,
    });
    console.log('Email sent successfully', response);
    return response;
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};