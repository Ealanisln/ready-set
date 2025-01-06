import * as React from "react";

interface EmailTemplateProps {
  data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    subject?: string;
  };
  isJobApplication: boolean;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  data,
  isJobApplication,
}) => (
  <div>
    <p>
      {isJobApplication ? "New job application" : "Someone sent you a message"}{" "}
      from Ready Set Website:
    </p>

    {Object.entries(data).map(
      ([key, value]) =>
        value && (
          <p key={key}>
            <strong>{key}:</strong> {value}
          </p>
        ),
    )}
  </div>
);
