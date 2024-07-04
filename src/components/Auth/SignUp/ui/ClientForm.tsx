import React from 'react'

const ClientForm: React.FC<{ register: any; errors: any }> = ({ register, errors }) => (
  <>
    <input {...register("name")} placeholder="Name" />
    {errors.name && <p>{errors.name.message}</p>}
    
    <input {...register("email")} placeholder="Email" />
    {errors.email && <p>{errors.email.message}</p>}
    
    {/* Add more fields as needed */}
  </>
);

export default ClientForm