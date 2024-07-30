import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AddressManager, { Address } from "../AddressManager/index";

interface CatererDeliveryFormData {
  pickUpLocation: string;
  brokerageOrDirect: string;
  orderNumber: string;
  date: string;
  pickUpTime: string;
  arrivalTime: string;
  completeTime: string;
  headcount: number;
  needHost: 'yes' | 'no';
  clientAttention: string;
  deliveryAddress: string;
  orderTotal: number;
  tip: number;
}

const CatererDeliveryRequestForm: React.FC = () => {
  const { control, handleSubmit } = useForm<CatererDeliveryFormData>();

  const onSubmit = (data: CatererDeliveryFormData) => {
    console.log(data);
    // Handle form submission
  };

  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleAddressesLoaded = (loadedAddresses: Address[]) => {
    setAddresses(loadedAddresses);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Caterer Delivery Request</h1>

      <AddressManager onAddressesLoaded={handleAddressesLoaded} />

      <div className="mb-4">
        <label className="block mb-2">Brokerage / Direct</label>
        <Controller
          name="brokerageOrDirect"
          control={control}
          render={({ field }) => (
            <select {...field} className="w-full p-2 border rounded">
              <option value="">Please Select</option>
              <option value="direct">Direct Delivery</option>
              <option value="brokerage">Brokerage</option>
            </select>
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Order Number</label>
        <Controller
          name="orderNumber"
          control={control}
          render={({ field }) => (
            <input {...field} type="text" className="w-full p-2 border rounded" placeholder="Order Number" />
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Date</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <input {...field} type="date" className="w-full p-2 border rounded" />
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Pick Up Time</label>
        <Controller
          name="pickUpTime"
          control={control}
          render={({ field }) => (
            <input {...field} type="time" className="w-full p-2 border rounded" />
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Arrival Time</label>
        <Controller
          name="arrivalTime"
          control={control}
          render={({ field }) => (
            <input {...field} type="time" className="w-full p-2 border rounded" />
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Complete Time (optional)</label>
        <Controller
          name="completeTime"
          control={control}
          render={({ field }) => (
            <input {...field} type="time" className="w-full p-2 border rounded" />
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Headcount</label>
        <Controller
          name="headcount"
          control={control}
          render={({ field }) => (
            <input {...field} type="number" className="w-full p-2 border rounded" />
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Do you need a Host?</label>
        <Controller
          name="needHost"
          control={control}
          render={({ field }) => (
            <div>
              <label className="mr-4">
                <input {...field} type="radio" value="yes" /> Yes
              </label>
              <label>
                <input {...field} type="radio" value="no" /> No
              </label>
            </div>
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Client / Attention</label>
        <Controller
          name="clientAttention"
          control={control}
          render={({ field }) => (
            <input {...field} type="text" className="w-full p-2 border rounded" />
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Delivery Address</label>
        <Controller
          name="deliveryAddress"
          control={control}
          render={({ field }) => (
            <textarea {...field} className="w-full p-2 border rounded" rows={3} />
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Order Total</label>
        <Controller
          name="orderTotal"
          control={control}
          render={({ field }) => (
            <input {...field} type="number" step="0.01" className="w-full p-2 border rounded" />
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Tip (optional)</label>
        <Controller
          name="tip"
          control={control}
          render={({ field }) => (
            <input {...field} type="number" step="0.01" className="w-full p-2 border rounded" />
          )}
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Request
      </button>
    </form>
  );
};

export default CatererDeliveryRequestForm;