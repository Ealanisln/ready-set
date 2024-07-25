import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface AddressFormData {
  county: string;
  vendor: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  location_number: string;
  parking_loading: string;
}

interface AddAddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  onClose: () => void;
  allowedCounties: string[];
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({ onSubmit, onClose, allowedCounties }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>();

  const submitHandler: SubmitHandler<AddressFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Address</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="county">
              County
            </label>
            <select
              {...register('county', { required: 'County is required' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Please Select</option>
              {allowedCounties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
            {errors.county && <p className="text-red-500 text-xs italic">{errors.county.message}</p>}
          </div>
          
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressForm;