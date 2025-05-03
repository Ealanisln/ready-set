// src/components/AddressManager/index.tsx

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  onError?: (error: string) => void;
  defaultFilter?: "all" | "shared" | "private";
  showFilters?: boolean;
  showManagementButtons?: boolean;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  onAddressesLoaded,
  onAddressSelected,
  onError,
  defaultFilter = "all",
  showFilters = true,
  showManagementButtons = true,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<Address[]>([]);
  const [filterType, setFilterType] = useState<"all" | "shared" | "private">(defaultFilter);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const isRequestPending = useRef(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchAttempts = useRef(0);
  const MAX_FETCH_ATTEMPTS = 3;

  const supabase = createClient();
  const { control } = useForm();

  useEffect(() => {
    let isMounted = true;
    
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setUser(session?.user ?? null);
          if (!session) {
            setError("Authentication required to load addresses.");
            if (onError) {
              onError("Authentication required to load addresses.");
            }
            setIsLoading(false); 
          }
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        if (isMounted) {
          setError("Error fetching session.");
          if (onError) {
            onError("Error fetching session.");
          }
          setIsLoading(false);
        }
      }
    };
    
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      const newUser = session?.user ?? null;
      setUser(newUser);
      
      if (event === 'SIGNED_IN' && newUser) {
        setError(null);
      } else if (event === 'SIGNED_OUT') {
        setAddresses([]);
        setError("Authentication required to load addresses.");
        if (onError) {
          onError("Authentication required to load addresses.");
        }
      }
    });

    return () => {
      isMounted = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      authListener.subscription.unsubscribe();
    };
  }, [supabase, onError]);

  const debouncedFetch = useCallback((fn: () => Promise<void>) => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    if (fetchAttempts.current >= MAX_FETCH_ATTEMPTS) {
      console.warn(`Maximum fetch attempts (${MAX_FETCH_ATTEMPTS}) reached. Stopping further requests.`);
      return;
    }
    
    fetchTimeoutRef.current = setTimeout(() => {
      fn();
      fetchTimeoutRef.current = null;
    }, 500);
  }, []);

  const fetchAddresses = useCallback(async () => {
    if (isRequestPending.current) {
      console.log("Request already pending, skipping fetchAddresses call");
      return;
    }

    if (!user) {
      console.log("No user available, skipping fetchAddresses call");
      return;
    }
    
    fetchAttempts.current += 1;
    console.log(`Fetch attempt ${fetchAttempts.current} of ${MAX_FETCH_ATTEMPTS}`);
    
    if (fetchAttempts.current > MAX_FETCH_ATTEMPTS) {
      console.warn(`Maximum fetch attempts (${MAX_FETCH_ATTEMPTS}) reached. Stopping.`);
      setError(`Address loading failed after ${MAX_FETCH_ATTEMPTS} attempts. Please try again later or enter address manually.`);
      if (onError) {
        onError(`Address loading failed after ${MAX_FETCH_ATTEMPTS} attempts. Please try again later or enter address manually.`);
      }
      return;
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      setIsLoading(false);
      setError("Authentication required to load addresses.");
      if (onError) {
        onError("Authentication required to load addresses.");
      }
      return;
    }

    isRequestPending.current = true;
    setIsLoading(true);
    setError(null);
  
    try {
      console.log(`Fetching addresses with filter=${filterType}`);
      const response = await fetch(`/api/addresses?filter=${filterType}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized: Please log in again.");
          if (onError) {
            onError("Unauthorized: Please log in again.");
          }
        } else {
          setError(`Error fetching addresses: ${response.statusText}`);
          if (onError) {
            onError(`Error fetching addresses: ${response.statusText}`);
          }
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const validAddresses = Array.isArray(data) ? data : [];
      setAddresses(validAddresses);
      
      fetchAttempts.current = 0;
      
      if (onAddressesLoaded) {
        onAddressesLoaded(validAddresses);
      }
    } catch (err) {
      console.error("Fetch Addresses Catch Block:", err);
      setAddresses([]);
    } finally {
      setIsLoading(false);
      isRequestPending.current = false;
    }
  }, [user, filterType, onAddressesLoaded, onError, MAX_FETCH_ATTEMPTS]);

  useEffect(() => {
    if (user) {
      debouncedFetch(fetchAddresses);
    }
  }, [user, filterType, fetchAddresses, debouncedFetch]);

  const handleAddAddress = useCallback(
    async (newAddress: Partial<Address>) => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setError("Authentication required to add an address.");
        if (onError) {
          onError("Authentication required to add an address.");
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/addresses", {
          method: "POST",
          headers: {
             "Content-Type": "application/json",
             'Authorization': `Bearer ${session.access_token}`,
           },
          body: JSON.stringify({ ...newAddress, createdBy: session.user.id }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized: Please log in again to add address.");
            if (onError) {
              onError("Unauthorized: Please log in again to add address.");
            }
            setUser(null);
          } else {
            setError(`Failed to add address: ${response.statusText}`);
            if (onError) {
              onError(`Failed to add address: ${response.statusText}`);
            }
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const addedAddress = await response.json();
        console.log("Successfully added address:", addedAddress);
        setShowAddForm(false);
        await fetchAddresses();
      } catch (err) {
        console.error("Add Address Catch Block:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, supabase.auth, fetchAddresses, onError],
  );

  const handleToggleAddForm = () => {
    setShowAddForm((prev) => !prev);
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    onAddressSelected(addressId);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value as "all" | "shared" | "private");
  };

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
                    {Array.isArray(addresses) && addresses
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
                  {Array.isArray(addresses) && addresses.some(a => a.isShared) && (
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
      
      {showManagementButtons && (
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
      )}

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