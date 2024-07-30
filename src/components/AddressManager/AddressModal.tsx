import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { COUNTIES } from "@/components/Auth/SignUp/ui/FormData";

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

interface AddressModalProps {
  onAddressUpdated: () => void;
  addressToEdit: Address | null;
  isOpen: boolean;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  onAddressUpdated,
  addressToEdit,
  isOpen,
  onClose,
}) => {
  const [selectedCounty, setSelectedCounty] = useState<string>(
    addressToEdit?.county || "",
  );
  const { register, handleSubmit, setValue, reset } = useForm<Address>();

  useEffect(() => {
    if (addressToEdit) {
      Object.entries(addressToEdit).forEach(([key, value]) => {
        setValue(key as keyof Address, value);
      });
      setSelectedCounty(addressToEdit.county);
      setValue("vendor", addressToEdit.vendor || "");  // Set vendor field

    } else {
      reset();
      setSelectedCounty("");
    }
  }, [addressToEdit, setValue, reset]);

  const handleCountySelect = (county: string) => {
    setSelectedCounty(county);
    setValue("county", county);
  };

  const onSubmit = async (data: Address) => {

    try {
      const url = addressToEdit
        ? `/api/addresses?id=${addressToEdit.id}`
        : "/api/addresses";
      const method = addressToEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          county: selectedCounty,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${addressToEdit ? "update" : "add"} address`,
        );
      }

      const updatedAddress = await response.json();
      console.log(
        `Address ${addressToEdit ? "updated" : "added"}:`,
        updatedAddress,
      );

      reset();
      setSelectedCounty("");
      onAddressUpdated();
      onClose();
    } catch (error) {
      console.error(
        `Error ${addressToEdit ? "updating" : "adding"} address:`,
        error,
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {addressToEdit ? "Edit Address" : "Add Address"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="county" className="text-right">
                County
              </Label>
              <Select onValueChange={handleCountySelect} value={selectedCounty}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTIES.map((county) => (
                    <SelectItem key={county.value} value={county.value}>
                      {county.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vendor" className="text-right">
                Vendor
              </Label>
              <Input
                id="vendor"
                className="col-span-3"
                {...register("vendor")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street1" className="text-right">
                Street Address 1
              </Label>
              <Input
                id="street1"
                className="col-span-3"
                {...register("street1")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street2" className="text-right">
                Street Address 2
              </Label>
              <Input
                id="street2"
                className="col-span-3"
                {...register("street2")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input id="city" className="col-span-3" {...register("city")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">
                State
              </Label>
              <Input id="state" className="col-span-3" {...register("state")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zip" className="text-right">
                Zip
              </Label>
              <Input id="zip" className="col-span-3" {...register("zip")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location_number" className="text-right">
                Location Phone Number
              </Label>
              <Input
                id="location_number"
                className="col-span-3"
                {...register("location_number")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parking_loading" className="text-right">
                Parking / Loading
              </Label>
              <Input
                id="parking_loading"
                className="col-span-3"
                {...register("parking_loading")}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">{addressToEdit ? "Update" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
