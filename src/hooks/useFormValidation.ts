// src/hooks/useFormValidation.ts

import { useState } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (password: string): boolean => {
    const newErrors: string[] = [];

    // Password validation rules
    if (password.length < 8) {
      newErrors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      newErrors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      newErrors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      newErrors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.push('Password must contain at least one special character');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  return {
    errors,
    validateForm,
  };
};