import React from 'react'

const DriverForm: React.FC<{ register: any; errors: any }> = ({ register, errors }) => (
  <>
    <input {...register("name")} placeholder="Name" />
    {errors.name && <p>{errors.name.message}</p>}
    
    <input {...register("licenseNumber")} placeholder="License Number" />
    {errors.licenseNumber && <p>{errors.licenseNumber.message}</p>}
    
    {/* Add more fields as needed */}
  </>
);

export default DriverForm