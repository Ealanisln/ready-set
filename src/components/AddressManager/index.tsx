"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import AddAddressForm from "./AddAddressForm";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [allowedCounties, setAllowedCounties] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addressesLoaded, setAddressesLoaded] = useState(false);

  const { control } = useForm();

  const fetchAddresses = useCallback(async () => {
    if (!session?.user?.id || addressesLoaded) return;

    try {
      const response = await fetch(`/api/addresses?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
        onAddressesLoaded(data);
        setAddressesLoaded(true);
      } else {
        console.error("Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, [session?.user?.id, addressesLoaded, onAddressesLoaded]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const fetchAllowedCounties = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/user-counties`);
      if (response.ok) {
        const data = await response.json();
        setAllowedCounties(data.counties);
      } else {
        throw new Error("Failed to fetch allowed counties");
      }
    } catch (error) {
      console.error("Error fetching allowed counties:", error);
      setError("Failed to load counties. Please try again later.");
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchAllowedCounties();
  }, [fetchAllowedCounties]);

  const handleAddAddress = useCallback(
    async (newAddress: Partial<Address>) => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newAddress, userId: session.user.id }),
        });

        if (response.ok) {
          setShowAddForm(false);
          fetchAddresses();
        } else {
          console.error("Failed to add address");
        }
      } catch (error) {
        console.error("Error adding address:", error);
      }
    },
    [session?.user?.id, fetchAddresses],
  );

  return (
    <div className="container mx-auto min-h-[calc(100vh-400px)] p-4">
    <h2 className="text-2xl font-bold mb-4">Pick Up Location</h2>
    {error && <p className="text-red-500 mb-4">{error}</p>}
    <div className="flex items-center mb-4">
      <Controller
        name="pickUpLocation"
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className="flex-grow p-2 border rounded-l"
          >
            <option value="">Please Select</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {`${address.county} - ${address.vendor}`}
                {`\n${address.street1}${address.street2 ? `, ${address.street2}` : ""}, ${address.city}, ${address.state}, ${address.zip}`}
              </option>
            ))}
          </select>
        )}
      />
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded-r"
        onClick={() => setShowAddForm(true)}
      >
        Manage Addresses
      </button>
    </div>
    
    {showAddForm && (
      <AddAddressForm
        onSubmit={handleAddAddress}
        onClose={() => setShowAddForm(false)}
        allowedCounties={allowedCounties}
      />
    )}
  </div>
);
};

export default AddressManager;