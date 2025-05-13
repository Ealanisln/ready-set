"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { deleteCateringOrder, DeleteOrderResult } from "@/app/(backend)/admin/catering-orders/_actions/catering-orders";
import { UserRole } from "./types";

interface DeleteCateringOrderProps {
  orderId: string;
  orderNumber: string;
  userRoles: UserRole;
  onDeleted?: () => void;
}

export const DeleteCateringOrder: React.FC<DeleteCateringOrderProps> = ({
  orderId,
  orderNumber,
  userRoles,
  onDeleted,
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Only render the delete button if the user is an admin or super admin (not helpdesk)
  if (!userRoles.isAdmin && !userRoles.isSuperAdmin) {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result: DeleteOrderResult = await deleteCateringOrder(orderId);
      
      if (result.success) {
        toast({
          title: "Order deleted",
          description: result.message || `Order ${orderNumber} has been successfully deleted.`,
          variant: "default",
        });
        
        // Close the dialog
        setIsOpen(false);
        
        // Call the callback if provided
        if (onDeleted) {
          onDeleted();
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete order. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
          title="Delete order"
          aria-label="Delete order"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete order <strong>{orderNumber}</strong>?
            <br /><br />
            This action is permanent and cannot be undone. All associated data including 
            file uploads and dispatch records will be deleted.
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
            {isDeleting ? "Deleting..." : "Delete Order"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCateringOrder; 