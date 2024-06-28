'use server';

import sgMail from "@sendgrid/mail";


interface FormInputs {
    name: string;
    email: string;
    phone: string;
    message: string;
  }

const sendEmail = async( data: FormInputs) => {

    let body = `
      <p>Someone sent you a message from Ready Set Website:</p>
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
      subject: "Website message - Ready Set",
      html: body,
    };
  
    sgMail.setApiKey(process.env.SEND_API_KEY || "");
  
    try {
      await sgMail.send(msg);
      return "Your message was sent succesfully. "; 
    } catch (error) {
      throw new Error("Error trying to sent the message.");
    }

  }

export default sendEmail;
