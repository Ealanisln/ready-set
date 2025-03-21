// src/components/AddressManager/UserAddresses.tsx

import React, { useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Address } from "@/types/address";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddressModal from "./AddressModal";

const UserAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "shared" | "private">("all");
  const [deleteConfirmAddress, setDeleteConfirmAddress] = useState<Address | null>(null);
  const router = useRouter();

  // Initialize Supabase client and auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        setUser(user);
        
        // Set up auth listener
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN") {
            setUser(session?.user || null);
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            router.push("/sign-in");
          }
        });
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth error:", error);
        setError("Authentication error. Please sign in again.");
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, [router]);

  // Fetch addresses based on filter
  const fetchAddresses = useCallback(async () => {
    if (!user) {
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
      console.log(`Fetched ${data.length} addresses for user ${user.id} with filter "${filterType}"`);
      setAddresses(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching addresses:", errorMessage);
      setError(`Failed to load addresses: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [user, filterType]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, filterType, fetchAddresses]);

  const handleDeleteAddress = async (addressId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/addresses?id=${addressId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete address");
      }

      // Update the local state to remove the deleted address
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      setDeleteConfirmAddress(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error deleting address:", errorMessage);
      setError(`Failed to delete address: ${errorMessage}`);
    } finally {
      setIsLoading(false);
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

  // Function to check if the current user is the address owner
  const isAddressOwner = (address: Address) => {
    return address.createdBy === user?.id;
  };

  if (isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Spinner  />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold">Please sign in to manage addresses</h2>
        <Button 
          className="mt-4" 
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Addresses</CardTitle>
        <CardDescription>
          Manage your saved addresses for deliveries and pickups
        </CardDescription>
        <div className="flex justify-between items-center mt-4">
          <Tabs defaultValue={filterType} onValueChange={(value) => setFilterType(value as any)}>
            <TabsList>
              <TabsTrigger value="all">All Addresses</TabsTrigger>
              <TabsTrigger value="private">Your Private Addresses</TabsTrigger>
              <TabsTrigger value="shared">Shared Addresses</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleAddNewAddress}>
            + Add New Address
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">
            {error}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)} 
              className="ml-2 h-auto p-1 text-red-700"
            >
              Dismiss
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No addresses found</p>
            <Button onClick={handleAddNewAddress}>Add Your First Address</Button>
          </div>
        ) : (
          <Table>
            <TableCaption>Your saved addresses</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>County</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell className="font-medium">
                    {address.name || "Unnamed Location"}
                    {address.isShared && <Badge className="ml-2 bg-blue-500">Shared</Badge>}
                    {isAddressOwner(address) && <Badge className="ml-2 bg-green-500">Owner</Badge>}
                  </TableCell>
                  <TableCell>
                    {address.street1}
                    {address.street2 && `, ${address.street2}`}
                    <br />
                    {address.city}, {address.state} {address.zip}
                    {address.locationNumber && (
                      <div className="text-xs text-gray-500 mt-1">
                        Phone: {address.locationNumber}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{address.county || "N/A"}</TableCell>
                  <TableCell>
                    {address.isRestaurant ? "Restaurant" : "Standard Address"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAddress(address)}
                        disabled={!isAddressOwner(address)}
                      >
                        Edit
                      </Button>
                      
                      <AlertDialog open={deleteConfirmAddress?.id === address.id} onOpenChange={(open) => {
                        if (!open) setDeleteConfirmAddress(null);
                      }}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteConfirmAddress(address)}
                            disabled={!isAddressOwner(address) || address.isShared}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this address? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {isModalOpen && (
        <AddressModal
          onAddressUpdated={handleAddressUpdated}
          addressToEdit={addressToEdit}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </Card>
  );
};

export default UserAddresses;