// src/components/Dashboard/UserView/Tabs/AddressTab.tsx

import { Control } from "react-hook-form";
import { UserFormValues } from "../types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AddressTabProps {
  control: Control<UserFormValues>;
  isUserProfile?: boolean; // Add this prop
}

export default function AddressTab({ 
  control,
  isUserProfile = false
}: AddressTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Address Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Street 1 */}
          <FormField
            control={control}
            name="street1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street Address" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Street 2 */}
          <FormField
            control={control}
            name="street2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address Line 2</FormLabel>
                <FormControl>
                  <Input placeholder="Apt, Suite, Building (optional)" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* City */}
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* State */}
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* ZIP Code */}
          <FormField
            control={control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP / Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="ZIP / Postal Code" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}