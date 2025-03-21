import React from 'react';

interface CustomerInfoProps {
  name?: string | null;  // Updated to make it optional
  email?: string | null; // Updated to make it optional
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ name, email }) => {
  return (
    <div className="py-4">
      <h3 className="mb-2 font-semibold">Customer Information</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          Customer: <span className="font-medium">{name || "N/A"}</span>
        </div>
        <div>
          Email:{" "}
          {email ? (
            <a href={`mailto:${email}`} className="font-medium">{email}</a>
          ) : (
            <span className="font-medium">N/A</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;