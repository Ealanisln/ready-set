// src/components/AddressManager/index.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import AddAddressForm from "./AddAddressForm";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export interface Address {
  id: string;
  street1: string;
  street2: string | null;
  city: string;
  state: string;
  zip: string;
  locationNumber: string | null;
  parkingLoading: string | null;
  county: string;
  isRestaurant: boolean;
  isShared: boolean;
}

interface AddressManagerProps {
  onAddressesLoaded: (addresses: Address[]) => void;
  onAddressSelected: (addressId: string) => void;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  onAddressesLoaded,
  onAddressSelected,
}) => {
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [allowedCounties, setAllowedCounties] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const { control } = useForm();

  // Get user from Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        setUser(user);
      }
    };

    getUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    // Clean up subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) {
      return;
    }
    if (addressesLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/addresses?isShared=all`);
      if (response.ok) {
        const data = await response.json();
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
  }, [user?.id, addressesLoaded, onAddressesLoaded]);

  const fetchAllowedCounties = useCallback(async () => {
    if (!user?.id) return;

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
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchAddresses();
      fetchAllowedCounties();
    }
  }, [user?.id, fetchAddresses, fetchAllowedCounties]);

  const handleAddAddress = useCallback(
    async (newAddress: Partial<Address>) => {
      if (!user?.id) return;

      try {
        const response = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAddress),
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
    [user?.id, fetchAddresses],
  );

  return (
    <div>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p className="text-gray-600">Loading addresses...</p>
      ) : (
        <div className="mb-6">
          <Controller
            name="pickUpLocation"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                onChange={(e) => {
                  field.onChange(e);
                  onAddressSelected(e.target.value);
                }}
              >
                <option value="">Please Select</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {`${address.county} - ${address.isRestaurant ? 'Restaurant' : 'Address'}`}
                    {`\n${address.street1}${
                      address.street2 ? `, ${address.street2}` : ""
                    }, ${address.city}, ${address.state}, ${address.zip}`}
                    {address.isShared ? ' (Shared)' : ''}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      )}
      <div className="pb-6">
        <Link
          href="/addresses"
          className="inline-block rounded-md bg-blue-500 px-6 py-3 text-white transition hover:bg-blue-600"
        >
          Manage Addresses
        </Link>
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