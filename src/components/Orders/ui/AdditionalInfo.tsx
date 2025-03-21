import React from 'react';

interface AdditionalInfoProps {
  clientAttention?: string | null;  // Updated to make it optional
  pickupNotes?: string | null;      // Updated to make it optional
  specialNotes?: string | null;     // Updated to make it optional
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  clientAttention,
  pickupNotes,
  specialNotes,
}) => {
  // Check if any information is available
  const hasAdditionalInfo = clientAttention || pickupNotes || specialNotes;

  if (!hasAdditionalInfo) {
    return null;
  }

  return (
    <div className="py-4">
      <h3 className="mb-2 font-semibold">Additional Information</h3>

      {clientAttention && (
        <div className="mb-3">
          <div className="font-medium">Client Attention</div>
          <p className="text-sm">{clientAttention}</p>
        </div>
      )}

      {pickupNotes && (
        <div className="mb-3">
          <div className="font-medium">Pickup Notes</div>
          <p className="text-sm">{pickupNotes}</p>
        </div>
      )}

      {specialNotes && (
        <div>
          <div className="font-medium">Special Notes</div>
          <p className="text-sm">{specialNotes}</p>
        </div>
      )}
    </div>
  );
};

export default AdditionalInfo;