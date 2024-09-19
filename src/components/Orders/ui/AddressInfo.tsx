// AddressInfo.tsx
import React from 'react';
import { Address } from '@/types/order';

interface AddressInfoProps {
  address: Address;
  title: string;
}

const AddressInfo: React.FC<AddressInfoProps> = ({ address, title }) => {
  return (
    <div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <address className="text-sm not-italic">
        {address.street1}
        <br />
        {address.street2 && (
          <>
            {address.street2}
            <br />
          </>
        )}
        {address.city}, {address.state} {address.zip}
      </address>
    </div>
  );
};

export default AddressInfo;