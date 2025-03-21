// src/components/AddressManager/index.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Address } from "@/types/address";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AddAddressForm from "./AddAddressForm";
import { Spinner } from "@/components/ui/spinner";

interface AddressManagerProps {
  onAddressesLoaded?: (addresses: Address[]) => void;
  onAddressSelected: (addressId: string) => void;
  defaultFilter?: "all" | "shared" | "private";
  showFilters?: boolean;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  onAddressesLoaded,
  onAddressSelected,
  defaultFilter = "all",
  showFilters = true,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<Address[]>([]);
  const [filterType, setFilterType] = useState<"all" | "shared" | "private">(defaultFilter);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const { control } = useForm();

  // Initialize Supabase client and set up auth
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = await createClient();
        
        // Get current user
        const { data: { user }, error } = await client.auth.getUser();
        if (error) throw error;
        
        setUser(user);
        
        // Set up auth state listener
        const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
          setUser(session?.user || null);
        });
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Error initializing auth:", err);
        setError("Authentication error. Please try logging in again.");
        setIsLoading(false);
      }
    };
    
    initSupabase();
  }, []);

  // Fetch addresses whenever user or filter changes
  const fetchAddresses = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`/api/addresses?filter=${filterType}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Fetched ${data.length} addresses with filter "${filterType}"`);
      
      setAddresses(data);
      setFilteredAddresses(data);
      
      if (onAddressesLoaded) {
        onAddressesLoaded(data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error fetching addresses:", errorMessage);
      setError(`Error fetching addresses: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, filterType, onAddressesLoaded]);

  useEffect(() => {
    if (user?.id) {
      fetchAddresses();
    }
  }, [user?.id, filterType, fetchAddresses]);

  const handleAddAddress = useCallback(
    async (newAddress: Partial<Address>) => {
      if (!user?.id) {
        setError("You must be logged in to add an address");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAddress),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const addedAddress = await response.json();
        console.log("Successfully added address:", addedAddress);
        
        setShowAddForm(false);
        await fetchAddresses();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error adding address:", errorMessage);
        setError(`Failed to add address: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, fetchAddresses],
  );

  const handleToggleAddForm = () => {
    setShowAddForm((prev) => !prev);
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    onAddressSelected(addressId);
  };

  // Function to filter addresses by type (shared, private, or all)
  const handleFilterChange = (value: string) => {
    setFilterType(value as "all" | "shared" | "private");
  };

  // Badge display for address type
  const getAddressBadge = (address: Address) => {
    if (address.isShared) {
      return <Badge className="ml-1 bg-blue-500">Shared</Badge>;
    }
    if (address.createdBy === user?.id) {
      return <Badge className="ml-1 bg-green-500">Your Address</Badge>;
    }
    return null;
  };

  return (
    <div className="address-manager w-full space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-red-500">
          <p>{error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError(null)}
            className="mt-2 text-red-700 hover:text-red-900 hover:bg-red-100"
          >
            Dismiss
          </Button>
        </div>
      )}
      
      {showFilters && (
        <Tabs defaultValue={filterType} onValueChange={handleFilterChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Addresses</TabsTrigger>
            <TabsTrigger value="private">Your Addresses</TabsTrigger>
            <TabsTrigger value="shared">Shared Addresses</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Spinner />
          <p className="ml-2 text-gray-600">Loading addresses...</p>
        </div>
      ) : (
        <div className="mb-6">
          <Controller
            name="pickUpLocation"
            control={control}
            render={({ field }) => (
              <Select
                value={selectedAddressId}
                onValueChange={handleAddressSelection}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an address" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Addresses</SelectLabel>
                    {addresses
                      .filter(a => !a.isShared && a.createdBy === user?.id)
                      .map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          <div className="flex items-center">
                            <span>
                              {address.name ? `${address.name} - ` : ''}
                              {address.street1}
                              {address.street2 ? `, ${address.street2}` : ""}
                              {`, ${address.city}, ${address.state} ${address.zip}`}
                            </span>
                            {getAddressBadge(address)}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectGroup>
                  {addresses.some(a => a.isShared) && (
                    <SelectGroup>
                      <SelectLabel>Shared Addresses</SelectLabel>
                      {addresses
                        .filter(a => a.isShared)
                        .map((address) => (
                          <SelectItem key={address.id} value={address.id}>
                            <div className="flex items-center">
                              <span>
                                {address.name ? `${address.name} - ` : ''}
                                {address.street1}
                                {address.street2 ? `, ${address.street2}` : ""}
                                {`, ${address.city}, ${address.state} ${address.zip}`}
                              </span>
                              {getAddressBadge(address)}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}
      
      <div className="flex space-x-4 pb-6">
        <Link
          href="/addresses"
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          Manage Addresses
        </Link>
        
        <Button
          onClick={handleToggleAddForm}
          variant={showAddForm ? "destructive" : "default"}
          className={showAddForm ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
        >
          {showAddForm ? "Cancel" : "Add New Address"}
        </Button>
      </div>

      {showAddForm && (
        <AddAddressForm
          onSubmit={handleAddAddress}
          onClose={() => setShowAddForm(false)}
          initialValues={{
            isShared: false,
            isRestaurant: false,
          }}
        />
      )}
    </div>
  );
};

export default AddressManager;