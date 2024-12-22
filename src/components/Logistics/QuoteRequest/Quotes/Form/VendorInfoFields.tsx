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
        {...register("streetAddress")}
        className="w-full rounded border p-2"
        placeholder="Street Address"
      />
      <input
        {...register("city")}
        className="w-full rounded border p-2"
        placeholder="City"
      />
      <input
        {...register("state")}
        className="w-full rounded border p-2"
        placeholder="State"
      />
      <input
        {...register("zipCode")}
        className="w-full rounded border p-2"
        placeholder="Zip Code"
      />
    </div>
  </div>
);
