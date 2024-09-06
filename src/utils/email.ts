import sgMail from '@sendgrid/mail';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

// Set SendGrid API key
sgMail.setApiKey(process.env.SEND_API_KEY || '');

export const sendEmail = async (data: EmailPayload) => {
  const msg = {
    to: data.to,
    from: process.env.EMAIL_FROM || 'emmanuel@alanis.dev', // Use a verified sender email
    subject: data.subject,
    html: data.html,
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent successfully', response);
    return response;
  } catch (error: any) {
    console.error('Error sending email:');
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};