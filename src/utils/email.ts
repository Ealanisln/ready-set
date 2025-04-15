import { Resend } from 'resend';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (data: EmailPayload) => {
  try {
    const response = await resend.emails.send({
      to: data.to,
      from: process.env.EMAIL_FROM || 'solutions@readysetllc.com',
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