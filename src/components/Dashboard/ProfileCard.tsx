// src/components/Dashboard/ProfileCard.tsx

"use client";

import React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileCardProps {
  control: any;
  errors: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ control, errors }) => {
  const userType = useWatch({
    control,
    name: "type",
    defaultValue: "vendor",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update basic user information</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-6">
          {userType !== "driver" && (
            <div className="grid gap-3">
              <Label htmlFor="company_name">Company name</Label>
              <Controller
                name="company_name"
                control={control}
                defaultValue=""
                rules={{
                  required:
                    userType !== "driver" && userType !== "helpdesk"
                      ? "Company name is required"
                      : false,
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      id="company_name"
                      type="text"
                      className={`w-full ${error ? "border-red-500" : ""}`}
                      {...field}
                      value={field.value || ""}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="displayName">Name / Contact name</Label>
          <Controller
            name="displayName"
            control={control}
            defaultValue=""
            rules={{ required: "Name is required" }}
            render={({ field: { value, ...fieldProps }, fieldState: { error } }) => (
              <>
                <Input
                  id="displayName"
                  type="text"
                  className={`w-full ${error ? "border-red-500" : ""}`}
                  {...fieldProps}
                  value={value ?? ""}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">
                    {error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="contact_number">Contact phone number</Label>
          <Controller
            name="contact_number"
            control={control}
            defaultValue=""
            rules={{ required: "Contact number is required" }}
            render={({
              field: { value, ...fieldProps },
              fieldState: { error },
            }) => (
              <>
                <Input
                  id="contact_number"
                  type="tel"
                  className={`w-full ${error ? "border-red-500" : ""}`}
                  placeholder="Phone number"
                  {...fieldProps}
                  value={value ?? ""}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({
              field: { value, ...fieldProps },
              fieldState: { error },
            }) => (
              <>
                <Input
                  id="email"
                  type="email"
                  className={`w-full ${error ? "border-red-500" : ""}`}
                  placeholder="Email"
                  {...fieldProps}
                  value={value ?? ""}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="website">Website</Label>
          <Controller
            name="website"
            control={control}
            defaultValue=""
            rules={{
              pattern: {
                value:
                  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                message: "Invalid website URL",
              },
            }}
            render={({
              field: { value, ...fieldProps },
              fieldState: { error },
            }) => (
              <>
                <Input
                  id="website"
                  type="url"
                  className={`w-full ${error ? "border-red-500" : ""}`}
                  placeholder="Website"
                  {...fieldProps}
                  value={value ?? ""}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;