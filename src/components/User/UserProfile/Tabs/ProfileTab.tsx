// src/components/Dashboard/UserView/Tabs/ProfileTab.tsx

import { Control } from "react-hook-form";
import { UserFormValues } from "../types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProfileTabProps {
  control: Control<UserFormValues>;
  watchedValues: UserFormValues;
  isUserProfile?: boolean; // Add this prop
}

export default function ProfileTab({ 
  control, 
  watchedValues,
  isUserProfile = false 
}: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Display Name */}
          <FormField
            control={control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {watchedValues.type === "client" || watchedValues.type === "vendor" 
                    ? "Contact Name" 
                    : "Full Name"}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={watchedValues.type === "client" || watchedValues.type === "vendor" 
                      ? "Contact Person Name" 
                      : "Full Name"} 
                    {...field}
                    readOnly={isUserProfile && watchedValues.type === "admin"} // Example of conditional readonly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Email */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Email Address" 
                    {...field} 
                    value={field.value || ""}
                    readOnly={isUserProfile} // Make email readonly for user profile
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Other fields with appropriate isUserProfile conditionals */}
          
        </div>
      </div>
    </div>
  );
}