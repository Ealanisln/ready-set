// AdditionalInfo.tsx
import React from 'react';

interface AdditionalInfoProps {
  clientAttention: string;
  pickupNotes: string;
  specialNotes: string;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ clientAttention, pickupNotes, specialNotes }) => {
  return (
    <div className="py-6">
      <h3 className="mb-2 font-semibold">Additional Information</h3>
      <div className="grid gap-2 text-sm">
        <div>
          Client Attention: <span className="font-medium">{clientAttention}</span>
        </div>
        <div>
          Pickup Notes: <span className="font-medium">{pickupNotes}</span>
        </div>
        <div>
          Special Notes: <span className="font-medium">{specialNotes}</span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;