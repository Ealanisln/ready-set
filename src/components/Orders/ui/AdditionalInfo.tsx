// src/components/Orders/ui/AdditionalInfo.tsx
import React from 'react';
import { MessageCircle, Truck, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdditionalInfoProps {
  clientAttention?: string | null;
  pickupNotes?: string | null;
  specialNotes?: string | null;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  clientAttention,
  pickupNotes,
  specialNotes,
}) => {
  // Check if any information is available
  const hasAdditionalInfo = clientAttention || pickupNotes || specialNotes;

  if (!hasAdditionalInfo) {
    return (
      <div className="text-center py-4 text-slate-500 italic">
        No additional information provided for this order.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clientAttention && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 font-medium">Client Attention</AlertTitle>
          <AlertDescription className="text-amber-700 mt-1">
            {clientAttention}
          </AlertDescription>
        </Alert>
      )}

      {pickupNotes && (
        <Alert className="bg-blue-50 border-blue-200">
          <Truck className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800 font-medium">Pickup Notes</AlertTitle>
          <AlertDescription className="text-blue-700 mt-1">
            {pickupNotes}
          </AlertDescription>
        </Alert>
      )}

      {specialNotes && (
        <Alert className="bg-slate-50 border-slate-200">
          <MessageCircle className="h-5 w-5 text-slate-600" />
          <AlertTitle className="text-slate-800 font-medium">Special Notes</AlertTitle>
          <AlertDescription className="text-slate-700 mt-1">
            {specialNotes}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdditionalInfo;