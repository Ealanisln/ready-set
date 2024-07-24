import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface Address {
  id: string;
  county: string;
  vendor: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  location_number: string;
  parking_loading: string;
}

interface AddressManagerProps {
  onAddressesLoaded: (addresses: Address[]) => void;
}


const AddressManager: React.FC<AddressManagerProps> = ({ onAddressesLoaded }) => {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  useEffect(() => {
    if (session?.user?.id) {
      const fetchAddresses = async () => {
        try {
          const response = await fetch(`/api/addresses?userId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setAddresses(data);
            onAddressesLoaded(data); // Pass the loaded addresses to the parent component
          } else {
            console.error('Failed to fetch addresses');
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      };

      fetchAddresses();
    }
  }, [session, onAddressesLoaded]);
  
  const fetchAddresses = async () => {
    try {
      const response = await fetch(`/api/addresses?userId=${session?.user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      } else {
        console.error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAddress, userId: session.user.id }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewAddress({});
        fetchAddresses();
      } else {
        console.error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
    <div>
      <label htmlFor="pickUpLocation">Pick Up Location</label>
      <select
        id="pickUpLocation"
        value={selectedAddress}
        onChange={(e) => setSelectedAddress(e.target.value)}
      >
        <option value="">Please Select</option>
        {addresses.map((address) => (
          <option key={address.id} value={address.id}>
            {`${address.street1}, ${address.city}, ${address.state}, ${address.zip}`}
          </option>
        ))}
      </select>
      <button onClick={() => setShowAddressManager(true)}>Manage Addresses</button>
    </div>

    {showAddressManager && (
      <div>
        <h3>Manage Addresses</h3>
        <table>
          <thead>
            <tr>
              <th>County</th>
              <th>Vendor</th>
              <th>Address</th>
              <th>Location Number, Parking / Loading</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addresses.length === 0 ? (
              <tr>
                <td colSpan={5}>No records found.</td>
              </tr>
            ) : (
              addresses.map((address) => (
                <tr key={address.id}>
                  <td>{address.county}</td>
                  <td>{address.vendor}</td>
                  <td>{`${address.street1}${address.street2 ? `, ${address.street2}` : ''}, ${address.city}, ${address.state}, ${address.zip}`}</td>
                  <td>{`${address.location_number}, ${address.parking_loading}`}</td>
                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <button onClick={() => setShowAddressManager(false)}>Close</button>
      </div>
    )}
  </div>
  );
};

export default AddressManager;