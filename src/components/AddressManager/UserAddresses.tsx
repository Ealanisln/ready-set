import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
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
  company?: string;
  vendor?: string;
  street1: string;
  street2: string | null;
  city: string;
  state: string;
  zip: string;
  location_number: string | null;
  parking_loading: string | null;
}

const UserAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/addresses");
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Error fetching addresses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

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
            : "Error deleting address. Please try again later.",
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!session) return <div>Please sign in to view addresses.</div>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Pick Up Location</h2>
      <Button onClick={handleAddNewAddress} className="mb-4">
        + Add Address
      </Button>
      <Table>
        <TableCaption>A list of your pickup addresses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>County</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Street</TableHead>
            <TableHead>City, State, Zip</TableHead>
            <TableHead>Location Number, Parking / Loading</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address) => (
            <TableRow key={address.id}>
              <TableCell>{address.county}</TableCell>
              <TableCell>{address.vendor}</TableCell>
              <TableCell>{`${address.street1}${address.street2 ? `, ${address.street2}` : ""}`}</TableCell>
              <TableCell>{`${address.city}, ${address.state}, ${address.zip}`}</TableCell>
              <TableCell>{`${address.location_number || ""}, ${address.parking_loading || ""}`}</TableCell>
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
