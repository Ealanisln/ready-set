'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { Address } from '@/components/AddressManager/'; // Import the Address interface

interface CateringRequestFormProps {
  addresses: Address[];
}

interface FormData {
  pickUpLocation: string;
  brokerage: string;
  orderNumber: string;
  date: string;
  pickUpTime: string;
  arrivalTime: string;
  completeTime?: string;
  headcount: string;
  needHost: 'yes' | 'no';
  clientAttention: string;
  deliveryAddress: string;
  orderTotal: string;
  tip?: string;
  pickUpNotes?: string;
  specialNotes?: string;
}

const CateringRequestForm: React.FC<CateringRequestFormProps> = ({ addresses }) => {
  const { data: session } = useSession();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id) {
      console.error('User not authenticated');
      return;
    }
    try {
      const response = await fetch('/api/catering-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: session.user.id }),
      });
      if (response.ok) {
        console.log('Catering request created successfully');
        // Reset form or show success message
      } else {
        console.error('Failed to create catering request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="brokerage">Brokerage / Direct</label>
        <Controller
          name="brokerage"
          control={control}
          rules={{ required: 'Brokerage is required' }}
          render={({ field }) => (
            <select {...field}>
              <option value="">Please Select</option>
              <option value="Foodee">Foodee</option>
              <option value="Ez Cater">Ez Cater</option>
              <option value="Grubhub">Grubhub</option>
              <option value="Cater Cow">Cater Cow</option>
              <option value="Zero Cater">Zero Cater</option>
              <option value="Platterz">Platterz</option>
              <option value="Direct Delivery">Direct Delivery</option>
              <option value="Other">Other</option>
            </select>
          )}
        />
        {errors.brokerage && <span>{errors.brokerage.message}</span>}
      </div>

      <div>
        <label htmlFor="orderNumber">Order Number</label>
        <Controller
          name="orderNumber"
          control={control}
          rules={{ required: 'Order Number is required' }}
          render={({ field }) => <input {...field} type="text" />}
        />
        {errors.orderNumber && <span>{errors.orderNumber.message}</span>}
      </div>

      <div>
        <label htmlFor="date">Date</label>
        <Controller
          name="date"
          control={control}
          rules={{ required: 'Date is required' }}
          render={({ field }) => <input {...field} type="date" />}
        />
        {errors.date && <span>{errors.date.message}</span>}
      </div>

      <div>
        <label htmlFor="pickUpTime">Pick Up Time</label>
        <Controller
          name="pickUpTime"
          control={control}
          rules={{ required: 'Pick Up Time is required' }}
          render={({ field }) => <input {...field} type="time" />}
        />
        {errors.pickUpTime && <span>{errors.pickUpTime.message}</span>}
      </div>

      <div>
        <label htmlFor="arrivalTime">Arrival Time</label>
        <Controller
          name="arrivalTime"
          control={control}
          rules={{ required: 'Arrival Time is required' }}
          render={({ field }) => <input {...field} type="time" />}
        />
        {errors.arrivalTime && <span>{errors.arrivalTime.message}</span>}
      </div>

      <div>
        <label htmlFor="completeTime">Complete Time (optional)</label>
        <Controller
          name="completeTime"
          control={control}
          render={({ field }) => <input {...field} type="time" />}
        />
      </div>

      <div>
        <label htmlFor="headcount">Headcount</label>
        <Controller
          name="headcount"
          control={control}
          rules={{ required: 'Headcount is required' }}
          render={({ field }) => <input {...field} type="number" />}
        />
        {errors.headcount && <span>{errors.headcount.message}</span>}
      </div>

      <div>
        <label>Do you need a Host?</label>
        <Controller
          name="needHost"
          control={control}
          rules={{ required: 'Please select if you need a host' }}
          render={({ field }) => (
            <>
              <label>
                <input
                  type="radio"
                  {...field}
                  value="yes"
                  checked={field.value === 'yes'}
                /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  {...field}
                  value="no"
                  checked={field.value === 'no'}
                /> No
              </label>
            </>
          )}
        />
        {errors.needHost && <span>{errors.needHost.message}</span>}
      </div>

      <div>
        <label htmlFor="clientAttention">Client / Attention</label>
        <Controller
          name="clientAttention"
          control={control}
          rules={{ required: 'Client / Attention is required' }}
          render={({ field }) => <input {...field} type="text" />}
        />
        {errors.clientAttention && <span>{errors.clientAttention.message}</span>}
      </div>

      <div>
        <label htmlFor="deliveryAddress">Delivery Address</label>
        <Controller
          name="deliveryAddress"
          control={control}
          rules={{ required: 'Delivery Address is required' }}
          render={({ field }) => <textarea {...field} />}
        />
        {errors.deliveryAddress && <span>{errors.deliveryAddress.message}</span>}
      </div>

      <div>
        <label htmlFor="orderTotal">Order Total</label>
        <Controller
          name="orderTotal"
          control={control}
          rules={{ required: 'Order Total is required' }}
          render={({ field }) => <input {...field} type="number" step="0.01" />}
        />
        {errors.orderTotal && <span>{errors.orderTotal.message}</span>}
      </div>

      <div>
        <label htmlFor="tip">Tip (optional)</label>
        <Controller
          name="tip"
          control={control}
          render={({ field }) => <input {...field} type="number" step="0.01" />}
        />
      </div>

      <div>
        <label htmlFor="pickUpNotes">Pick Up Notes (optional)</label>
        <Controller
          name="pickUpNotes"
          control={control}
          render={({ field }) => <textarea {...field} />}
        />
      </div>

      <div>
        <label htmlFor="specialNotes">Special Notes (optional)</label>
        <Controller
          name="specialNotes"
          control={control}
          render={({ field }) => <textarea {...field} />}
        />
      </div>

      <button type="submit">Submit Catering Request</button>
    </form>
  );
};

export default CateringRequestForm;