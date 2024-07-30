import React from 'react';
import { Button } from "@/components/ui/button";

interface DeleteAddressButtonProps {
  addressId: string;
  onDelete: () => void;
}

const DeleteAddressButton: React.FC<DeleteAddressButtonProps> = ({ addressId, onDelete }) => {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await fetch(`/api/addresses/${addressId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete address');
        }

        onDelete();
      } catch (error) {
        console.error('Error deleting address:', error);
        // Handle the error (e.g., show an error message to the user)
      }
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
  );
};

export default DeleteAddressButton;