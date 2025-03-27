import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface BulkDeleteOrdersProps {
  selectedOrderIds: string[];
  onDeleteSuccess: () => void;
  isDisabled?: boolean;
}

const BulkDeleteOrders: React.FC<BulkDeleteOrdersProps> = ({
  selectedOrderIds,
  onDeleteSuccess,
  isDisabled = false,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (selectedOrderIds.length === 0) {
      toast.error("No orders selected for deletion");
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/orders/bulk-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNumbers: selectedOrderIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete orders");
      }

      const result = await response.json();
      
      if (result.results.deleted.length > 0) {
        toast.success(`Successfully deleted ${result.results.deleted.length} orders`);
      }
      
      if (result.results.failed.length > 0) {
        toast.error(`Failed to delete ${result.results.failed.length} orders`);
        console.error("Failed deletions:", result.results.failed);
      }
      
      onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting orders"
      );
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isDisabled || isDeleting || selectedOrderIds.length === 0}
        className="ml-2"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Selected ({selectedOrderIds.length})
      </Button>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk Delete Orders</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedOrderIds.length} orders?
              <p className="font-semibold text-destructive mt-2">
                This action is irreversible. All associated files and dispatch
                information will be permanently deleted.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? `Deleting ${selectedOrderIds.length} orders...` : `Delete ${selectedOrderIds.length} Orders`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkDeleteOrders;