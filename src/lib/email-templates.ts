// app/lib/email-templates.ts
interface UserNotificationTemplates {
    getRegistrationEmail: (userData: {
      userType: string;
      email: string;
      name?: string;
      company?: string;
    }) => {
      subject: string;
      html: string;
    };
  }
  
  export const emailTemplates: UserNotificationTemplates = {
    getRegistrationEmail: (userData) => {
      const userName = userData.name || userData.email;
      const companyInfo = userData.company ? `<p>Company: ${userData.company}</p>` : '';
      
      return {
        subject: `New ${userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1)} Registration - Ready Set`,
        html: `
          <html>
            <body>
              <h2>New User Registration</h2>
              <p>A new user has registered on the platform:</p>
              <p>User Type: ${userData.userType}</p>
              <p>Name: ${userName}</p>
              <p>Email: ${userData.email}</p>
              ${companyInfo}
              <p>Please review this registration in the admin dashboard.</p>
            </body>
          </html>
        `
      };
    }
  };
  