import React from 'react'

const VendorForm: React.FC<{ register: any; errors: any }> = ({ register, errors }) => (
  <>
    <input {...register("company")} placeholder="Company" />
    {errors.company && <p>{errors.company.message}</p>}
    
    <input {...register("contactPhone")} placeholder="Contact Phone" />
    {errors.contactPhone && <p>{errors.contactPhone.message}</p>}
    
    <input {...register("address")} placeholder="Address" />
    {errors.address && <p>{errors.address.message}</p>}
    
    <input {...register("website")} placeholder="Website" />
    {errors.website && <p>{errors.website.message}</p>}
    
    {/* Add more fields as needed */}
  </>
);


export default VendorForm