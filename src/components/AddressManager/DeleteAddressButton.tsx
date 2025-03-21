// src/components/AddressManager/DeleteAddressButton.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";

interface DeleteAddressButtonProps {
  addressId: string;
  isShared?: boolean;
  isOwner?: boolean;
  buttonSize?: "default" | "sm" | "lg";
  onDeleted: () => void;
  onError?: (error: string) => void;
}

const DeleteAddressButton: React.FC<DeleteAddressButtonProps> = ({
  addressId,
  isShared = false,
  isOwner = true,
  buttonSize = "default",
  onDeleted,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Determine if the delete button should be disabled
  const isDisabled = !isOwner || isShared || isLoading;

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/addresses?id=${addressId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(
          data.error || `Error ${response.status}: ${response.statusText}`,
        );
      }

      // Success
      setIsOpen(false);
      onDeleted();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete address";
      console.error("Error deleting address:", errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size={buttonSize}
          disabled={isDisabled}
          title={
            isShared
              ? "Shared addresses cannot be deleted"
              : !isOwner
                ? "You can only delete addresses you created"
                : "Delete this address"
          }
        >
          {isLoading ? <Spinner /> : "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            address from your account and remove it from our servers.
            {isShared && (
              <div className="mt-2 font-semibold text-amber-600">
                Note: This address is marked as shared and may be used by other
                users in the system.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {isLoading ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAddressButton;
