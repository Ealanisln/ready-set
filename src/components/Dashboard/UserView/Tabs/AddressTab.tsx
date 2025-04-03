// src/components/Dashboard/UserView/Tabs/AddressTab.tsx

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserFormValues } from "../types";
import { Control } from "react-hook-form";

interface AddressTabProps {
  control: Control<UserFormValues>;
}

export default function AddressTab({ control }: AddressTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="street1">Street Address 1</Label>
          <Controller
            name="street1"
            control={control}
            render={({ field }) => (
              <Input
                id="street1"
                placeholder="Enter street address"
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="street2">Street Address 2</Label>
          <Controller
            name="street2"
            control={control}
            render={({ field }) => (
              <Input
                id="street2"
                placeholder="Apt, Suite, Unit, etc."
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input
                id="city"
                placeholder="Enter city"
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Input
                id="state"
                placeholder="Enter state"
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zip">Zip Code</Label>
          <Controller
            name="zip"
            control={control}
            render={({ field }) => (
              <Input
                id="zip"
                placeholder="Enter zip code"
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parking_loading">
            Parking/Loading Notes
          </Label>
          <Controller
            name="parking_loading"
            control={control}
            render={({ field }) => (
              <Input
                id="parking_loading"
                placeholder="Enter parking or loading details"
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}