import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types/order";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DriverAssignmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isDriverAssigned: boolean;
  drivers: Driver[];
  selectedDriver: string | null;
  onDriverSelection: (driverId: string) => void;
  onAssignOrEditDriver: () => void;
}

const DriverAssignmentDialog: React.FC<DriverAssignmentDialogProps> = ({
  isOpen,
  onOpenChange,
  isDriverAssigned,
  drivers,
  selectedDriver,
  onDriverSelection,
  onAssignOrEditDriver,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastDriver = currentPage * itemsPerPage;
  const indexOfFirstDriver = indexOfLastDriver - itemsPerPage;
  const currentDrivers = drivers.slice(indexOfFirstDriver, indexOfLastDriver);

  const totalPages = Math.ceil(drivers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {isDriverAssigned ? "Edit Driver Assignment" : "Assign Driver"}
          </DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDrivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.contact_number}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => onDriverSelection(driver.id)}
                    variant={selectedDriver === driver.id ? "default" : "outline"}
                  >
                    {selectedDriver === driver.id ? "Selected" : "Select"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <DialogFooter>
          <Button onClick={onAssignOrEditDriver} disabled={!selectedDriver}>
            {isDriverAssigned ? "Update Driver" : "Assign Driver"}
          </Button>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DriverAssignmentDialog;