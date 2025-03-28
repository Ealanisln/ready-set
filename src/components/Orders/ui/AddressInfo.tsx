// src/components/Orders/ui/AddressInfo.tsx
import React from 'react';
import { MapPin, Navigation, Building, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Address } from '@/types/order';

interface AddressInfoProps {
  address: Address;
  title: string;
}

const AddressInfo: React.FC<AddressInfoProps> = ({ address, title }) => {
  // Generate Google Maps URL for this address
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.street1} ${address.street2 || ''} ${address.city}, ${address.state} ${address.zip}`
  )}`;

  return (
    <div className="h-full">
      {title && (
        <h3 className="mb-3 font-semibold text-slate-800 flex items-center">
          <MapPin className="h-4 w-4 mr-1.5 text-slate-500" />
          {title}
        </h3>
      )}
      
      <div className="flex flex-col space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <Building className="h-4 w-4 text-slate-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-700">{address.street1}</p>
            {address.street2 && (
              <p className="text-slate-600">{address.street2}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-slate-500" />
          <p className="text-slate-700">
            {address.city}, {address.state} {address.zip}
          </p>
        </div>
        
        <div className="pt-2">
          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Navigation className="h-3.5 w-3.5 mr-1" />
            View on Google Maps
          </a>
        </div>
        
        {/* Using isRestaurant property from schema */}
        {address.isRestaurant && (
          <Badge variant="outline" className="w-fit mt-1 bg-slate-100">
            Restaurant
          </Badge>
        )}
        
        {/* Display parking/loading info if available */}
        {address.parkingLoading && (
          <div className="mt-2 text-sm text-slate-600">
            <span className="font-medium">Parking/Loading:</span> {address.parkingLoading}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressInfo;