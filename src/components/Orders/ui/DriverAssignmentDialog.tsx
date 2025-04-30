// src/components/Orders/ui/DriverAssignmentDialog.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Driver } from "@/types/order";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Truck, Phone, CheckCircle, RadioTower, X, Info, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(drivers);
  const itemsPerPage = 5;

  // Filter drivers when search term or drivers array changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDrivers(drivers);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = drivers.filter(
        (driver) =>
          (driver.name?.toLowerCase().includes(lowercaseSearch) ?? false) ||
          (driver.contactNumber && driver.contactNumber.includes(searchTerm)),
      );
      setFilteredDrivers(filtered);
    }
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, drivers]);

  const indexOfLastDriver = currentPage * itemsPerPage;
  const indexOfFirstDriver = indexOfLastDriver - itemsPerPage;
  const currentDrivers = filteredDrivers.slice(
    indexOfFirstDriver,
    indexOfLastDriver,
  );
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get initials for avatar
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle clearing the search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Get the selected driver object
  const getSelectedDriver = (): Driver | undefined => {
    return drivers.find((driver) => driver.id === selectedDriver);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] bg-white border-none shadow-xl rounded-xl overflow-hidden p-0 gap-0">
        <DialogHeader className="pt-6 px-6 pb-4 bg-gradient-to-r from-amber-50 to-white border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            <Truck className="h-5 w-5 text-amber-500" />
            {isDriverAssigned ? "Update Driver Assignment" : "Assign Driver"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {isDriverAssigned
              ? "Select a different driver to update the current assignment."
              : "Select a driver to assign to this order."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          {/* Show selected driver at the top if one is selected */}
          <AnimatePresence>
            {selectedDriver && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-4"
              >
                <div className="mb-2 text-sm font-medium text-slate-500 flex items-center">
                  <UserCheck className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  Selected Driver
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50 p-3 shadow-sm">
                  <Avatar className="h-10 w-10 border shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                      {getInitials(getSelectedDriver()?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">
                      {getSelectedDriver()?.name}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Phone className="h-3 w-3" />
                      {getSelectedDriver()?.contactNumber || "No phone"}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-100 text-amber-800 shadow-sm"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Selected
                  </Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search drivers by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9 border-slate-200 focus:border-amber-300 focus:ring-amber-300 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {currentDrivers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="py-8 text-center"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Truck className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                No drivers found
              </h3>
              <p className="mx-auto mt-1 max-w-xs text-slate-500">
                {searchTerm
                  ? `No drivers match "${searchTerm}". Try a different search term.`
                  : "There are no drivers available to assign."}
              </p>
            </motion.div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
              <ScrollArea className="h-[320px]">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-slate-50 to-white sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[280px] font-semibold">Driver</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {currentDrivers.map((driver, index) => (
                        <motion.tr
                          key={driver.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className={
                            selectedDriver === driver.id 
                              ? "bg-gradient-to-r from-amber-50 to-white border-l-2 border-l-amber-500" 
                              : ""
                          }
                        >
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className={`h-8 w-8 border ${selectedDriver === driver.id ? 'shadow-sm' : ''}`}>
                                <AvatarFallback
                                  className={
                                    selectedDriver === driver.id
                                      ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                                      : "bg-slate-100 text-slate-600"
                                  }
                                >
                                  {getInitials(driver.name ?? "")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{driver.name}</div>
                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                  <Phone className="h-3 w-3" />
                                  {driver.contactNumber || "No phone"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-green-100 bg-green-50 text-green-700 shadow-sm"
                            >
                              <RadioTower className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => onDriverSelection(driver.id)}
                              variant={
                                selectedDriver === driver.id ? "default" : "outline"
                              }
                              size="sm"
                              className={
                                selectedDriver === driver.id
                                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm"
                                  : "border-slate-200 text-slate-600 hover:border-amber-200 hover:text-amber-600 transition-colors"
                              }
                            >
                              {selectedDriver === driver.id ? (
                                <>
                                  <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                                  Selected
                                </>
                              ) : (
                                "Select"
                              )}
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </ScrollArea>

              {totalPages > 1 && (
                <div className="border-t bg-gradient-to-r from-slate-50 to-white p-2">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
                          }
                          className={`cursor-pointer transition-colors hover:text-amber-600 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className={`cursor-pointer transition-all ${currentPage === page ? "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 hover:from-amber-200 hover:to-amber-300 shadow-sm" : "hover:bg-amber-50 hover:text-amber-600"}`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(
                              Math.min(totalPages, currentPage + 1),
                            )
                          }
                          className={`cursor-pointer transition-colors hover:text-amber-600 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm">
            <Info className="h-4 w-4 flex-shrink-0 text-blue-500" />
            <p>Assigned drivers will be notified immediately about the order details and pickup information.</p>
          </div>
        </div>

        <DialogFooter className="bg-gradient-to-r from-slate-50 to-white p-6 border-t flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={onAssignOrEditDriver}
            disabled={!selectedDriver}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm transition-all hover:shadow"
          >
            {isDriverAssigned ? "Update Driver" : "Assign Driver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DriverAssignmentDialog;
