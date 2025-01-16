// src/components/Logistics/QuoteRequest/Quotes/Form/VendorInfoFields.tsx

import { UseFormRegister } from "react-hook-form";

interface RegisterProps {
  register: UseFormRegister<any>;
}

export const VendorInfoFields = ({ register }: RegisterProps) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="font-medium">Client's Information</h3>
      <input
        {...register("name")}
        className="w-full rounded border p-2"
        placeholder="Name"
      />
      <input
        {...register("email")}
        type="email"
        className="w-full rounded border p-2"
        placeholder="Email Address"
      />
      <input
        {...register("companyName")}
        className="w-full rounded border p-2"
        placeholder="Company Name"
      />
      <input
        {...register("contactName")}
        className="w-full rounded border p-2"
        placeholder="Contact Name"
      />
      <input
        {...register("website")}
        className="w-full rounded border p-2"
        placeholder="Website (Optional)"
      />
    </div>

    <div className="space-y-2">
      <h3 className="font-medium">Address</h3>
      <input
        {...register("phone")}
        className="w-full rounded border p-2"
        placeholder="Phone Number"
      />
      <input
        {...register("pickupAddress.street", {
          required: "Street address is required",
        })}
        className="w-full rounded border p-2"
        placeholder="Street Address"
      />
      <input
        {...register("pickupAddress.city", { required: "City is required" })}
        className="w-full rounded border p-2"
        placeholder="City"
      />
      <input
        {...register("pickupAddress.state", { required: "State is required" })}
        className="w-full rounded border p-2"
        placeholder="State"
      />
      <input
        {...register("pickupAddress.zip", { required: "ZIP code is required" })}
        className="w-full rounded border p-2"
        placeholder="ZIP Code"
      />
    </div>

    <div className="space-y-2">
      <h3 className="font-medium">Additional Information</h3>
      <textarea
        {...register("additionalComments")}
        className="w-full rounded border p-2"
        placeholder="Additional Comments (Optional)"
        maxLength={1000}
        rows={4}
      />
      <p className="text-sm text-gray-500">Maximum 1000 characters</p>
    </div>
  </div>
);
