import { Address, CateringFormData } from "@/types/catering";
import { Control, Controller } from "react-hook-form";

// components/CateringForm/AddressSection.tsx
interface AddressSectionProps {
    control: Control<CateringFormData>;
    addresses: Address[];
    onAddressSelected: (address: Address) => void;
  }
  
  export const AddressSection: React.FC<AddressSectionProps> = ({
    control,
    addresses,
    onAddressSelected,
  }) => {
    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Delivery Address
        </label>
        <Controller
          name="delivery_address"
          control={control}
          rules={{ required: "Delivery Address is required" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <select
                onChange={(e) => {
                  const selectedAddress = addresses.find(addr => addr.id === e.target.value);
                  if (selectedAddress) {
                    onAddressSelected(selectedAddress);
                  }
                }}
                className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select delivery address</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {`${address.street1}, ${address.city}, ${address.state} ${address.zip}`}
                    {address.isRestaurant ? " (Restaurant)" : ""}
                    {address.isShared ? " (Shared)" : ""}
                  </option>
                ))}
              </select>
              {error && <span className="text-sm text-red-500">{error.message}</span>}
            </>
          )}
        />
      </div>
    );
  };