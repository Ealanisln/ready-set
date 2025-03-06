// src/components/Dashboard/AddressCard.tsx

"use client";

import React from "react";
import { Controller } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddressCardProps {
  control: any;
  errors: any;
}

const AddressCard: React.FC<AddressCardProps> = ({ control, errors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address</CardTitle>
        <CardDescription>
          Lipsum dolor sit amet, consectetur adipiscing elit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="street1">Street Address 1</Label>
            <Controller
              name="street1"
              control={control}
              defaultValue=""
              rules={{ required: "Street Address 1 is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="street1"
                    className={`w-full ${error ? "border-red-500" : ""}`}
                    placeholder="Street"
                    {...field}
                    value={field.value || ""} // Handle null/undefined values
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="street2">Street Address 2</Label>
            <Controller
              name="street2"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  id="street2"
                  className="w-full"
                  placeholder="Street 2"
                  {...field}
                />
              )}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="city">City</Label>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{ required: "City is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="city"
                    className={`w-full ${error ? "border-red-500" : ""}`}
                    placeholder="City"
                    {...field}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="state">State</Label>
            <Controller
              name="state"
              control={control}
              defaultValue=""
              rules={{ required: "State is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="state"
                    className={`w-full ${error ? "border-red-500" : ""}`}
                    placeholder="State"
                    {...field}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="zip">Zip Code</Label>
            <Controller
              name="zip"
              control={control}
              defaultValue=""
              rules={{
                required: "Zip Code is required",
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: "Invalid ZIP code format",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="zip"
                    className={`w-full ${error ? "border-red-500" : ""}`}
                    placeholder="Zip"
                    {...field}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="parking_loading">Parking / Loading</Label>
            <Controller
              name="parking_loading"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  id="parking_loading"
                  className="w-full"
                  placeholder="Parking Loading"
                  {...field}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
