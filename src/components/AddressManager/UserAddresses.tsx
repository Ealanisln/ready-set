import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient, User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddressModal from "./AddressModal";

interface Address {
  id: string;
  county: string;
  name: string;
  street1: string;
  street2: string | null;
  city: string;
  state: string;
  zip: string;
  locationNumber: string | null;
  parkingLoading: string | null;
  isRestaurant: boolean;
  isShared: boolean;
}

const UserAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = await createClient();
        setSupabase(client);
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
        setError("Error connecting to the database. Please try again later.");
        setIsLoading(false);
      }
    };

    initSupabase();
  }, []);

  // Get user session from Supabase
  useEffect(() => {
    if (!supabase) return;

    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // Clean up subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const fetchAddresses = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/addresses?isShared=true");
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
      const data = await response.json();
      console.log(data);
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Error fetching addresses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, fetchAddresses]);

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        const response = await fetch(`/api/addresses?id=${addressId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete address");
        }

        await fetchAddresses(); // Refresh the address list after deletion
      } catch (error) {
        console.error("Error deleting address:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Error deleting address. Please try again later."
        );
      }
    }
  };

  const handleAddressUpdated = useCallback(() => {
    fetchAddresses();
    setAddressToEdit(null);
    setIsModalOpen(false);
  }, [fetchAddresses]);

  const handleEditAddress = (address: Address) => {
    setAddressToEdit(address);
    setIsModalOpen(true);
  };

  const handleAddNewAddress = () => {
    setAddressToEdit(null);
    setIsModalOpen(true);
  };

  if (isLoading && (!supabase || !user)) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Please sign in to view addresses.</div>;

  return (
    <div className="pt-8">
      <h2 className="mb-4 text-2xl font-bold">Edit or add your address</h2>
      <Button onClick={handleAddNewAddress} className="mb-4">
        + Add Address
      </Button>
      <Table>
        <TableCaption>A list of your addresses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>County</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Street</TableHead>
            <TableHead>City, State, Zip</TableHead>
            <TableHead>Phone number</TableHead>
            <TableHead>Shared</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address) => (
            <TableRow key={address.id}>
              <TableCell>{address.name}</TableCell>
              <TableCell>{address.county}</TableCell>
              <TableCell>{address.isRestaurant ? 'Restaurant' : 'Address'}</TableCell>
              <TableCell>{`${address.street1}${address.street2 ? `, ${address.street2}` : ""}`}</TableCell>
              <TableCell>{`${address.city}, ${address.state}, ${address.zip}`}</TableCell>
              <TableCell>{`${address.locationNumber || ""} ${address.parkingLoading || ""}`}</TableCell>
              <TableCell>{address.isShared ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => handleEditAddress(address)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAddress(address.id)}
                  disabled={address.isShared} // Disable if address is shared
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && (
        <AddressModal
          onAddressUpdated={handleAddressUpdated}
          addressToEdit={addressToEdit}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserAddresses;