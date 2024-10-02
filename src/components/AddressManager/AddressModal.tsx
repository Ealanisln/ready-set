import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { COUNTIES } from "@/components/Auth/SignUp/ui/FormData";

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
  const { control, register, handleSubmit, setValue, reset } =
    useForm<Address>();

  useEffect(() => {
    if (addressToEdit) {
      Object.entries(addressToEdit).forEach(([key, value]) => {
        setValue(key as keyof Address, value);
      });
      setSelectedCounty(addressToEdit.county);
    } else {
      reset({
        isRestaurant: false,
        isShared: false,
      });
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
          isRestaurant: Boolean(data.isRestaurant),
          isShared: Boolean(data.isShared),
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
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" {...register("name")} />
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
              <Label htmlFor="locationNumber" className="text-right">
                Location Phone Number
              </Label>
              <Input
                id="locationNumber"
                className="col-span-3"
                {...register("locationNumber")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parkingLoading" className="text-right">
                Parking / Loading
              </Label>
              <Input
                id="parkingLoading"
                className="col-span-3"
                {...register("parkingLoading")}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="isRestaurant"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox
                    id="isRestaurant"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isRestaurant">Is this a restaurant?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="isShared"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox
                    id="isShared"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isShared">Is this a shared address?</Label>
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
