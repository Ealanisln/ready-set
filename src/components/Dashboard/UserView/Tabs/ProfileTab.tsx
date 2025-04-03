// src/components/Dashboard/UserView/Tabs/ProfileTab.tsx

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserFormValues } from "../types";
import { Control } from "react-hook-form";

interface ProfileTabProps {
  control: Control<UserFormValues>;
  watchedValues: UserFormValues;
}

export default function ProfileTab({ control, watchedValues }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Controller
            name="company_name"
            control={control}
            render={({ field }) => (
              <Input
                id="company_name"
                placeholder="Enter company name"
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">
            {watchedValues.type === "vendor" ||
            watchedValues.type === "client"
              ? "Contact Name"
              : "Full Name"}
          </Label>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <Input
                id="displayName"
                placeholder="Enter name"
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_number">Phone Number</Label>
          <Controller
            name="contact_number"
            control={control}
            render={({ field }) => (
              <Input
                id="contact_number"
                placeholder="Enter phone number"
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <Input
                id="website"
                placeholder="Enter website URL"
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