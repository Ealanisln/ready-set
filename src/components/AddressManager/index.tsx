"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import AddAddressForm from "./AddAddressForm";
import Link from "next/link";

export interface Address {
  id: string;
  vendor: string;
  street1: string;
  street2: string | null;
  city: string;
  state: string;
  zip: string;
  location_number: string | null;
  parking_loading: string | null;
  county: string; // Note: This might be a comma-separated string
}

interface AddressManagerProps {
  onAddressesLoaded: (addresses: Address[]) => void;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  onAddressesLoaded,
}) => {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [allowedCounties, setAllowedCounties] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control } = useForm();

  const fetchAddresses = useCallback(async () => {
    if (!session?.user?.id) {
      console.log("No user ID available");
      return;
    }
    if (addressesLoaded) {
      console.log("Addresses already loaded");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/addresses`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched addresses:", data);
        setAddresses(data);
        onAddressesLoaded(data);
        setAddressesLoaded(true);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch addresses:", response.status, errorText);
        setError(`Failed to fetch addresses: ${response.status} ${errorText}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching addresses:", error);
        setError(`Error fetching addresses: ${error.message}`);
      } else {
        console.error("Unknown error fetching addresses:", error);
        setError("An unknown error occurred while fetching addresses");
      }
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, addressesLoaded, onAddressesLoaded]);

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
    console.log("Session user ID:", session?.user?.id);
    if (session?.user?.id) {
      fetchAddresses();
      fetchAllowedCounties();
    }
  }, [session?.user?.id, fetchAddresses, fetchAllowedCounties]);

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
      <h2 className="mb-4 text-2xl font-bold">Pick Up Location</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading addresses...</p>
      ) : (
        <div className="mb-4 flex items-center">
          <Controller
            name="pickUpLocation"
            control={control}
            render={({ field }) => (
              <select {...field} className="flex-grow rounded-l border p-2">
                <option value="">Please Select</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {`${address.county} - ${address.vendor}`}
                    {`\n${address.street1}${
                      address.street2 ? `, ${address.street2}` : ""
                    }, ${address.city}, ${address.state}, ${address.zip}`}
                  </option>
                ))}
              </select>
            )}
          />
           <Link href="/addresses" className="bg-blue-500 text-white px-4 py-2 rounded-r">
            Manage Addresses
          </Link>
        </div>
      )}

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
