'use client';

import { useState, FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  industry: string;
  newsletterConsent: boolean;
}

export default function PopupGuideForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    industry: '',
    newsletterConsent: false,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Here you would typically send the data to your API
        console.log('Form submitted:', formData);
        // Reset form and close dialog after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          industry: '',
          newsletterConsent: false,
        });
        setOpen(false);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition-colors duration-200">
          Get Your Free Guide
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <img 
              src="/images/logo/logo-white.png" 
              alt="Ready Set Logo" 
              className="h-8"
            />
          </div>
          <DialogTitle className="text-3xl font-semibold text-center text-gray-800">
            Get Your Free Guide!
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="firstName" 
              className="block text-gray-700 text-lg mb-2"
            >
              First name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="lastName" 
              className="block text-gray-700 text-lg mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="email" 
              className="block text-gray-700 text-lg mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="industry" 
              className="block text-gray-700 text-lg mb-2"
            >
              Industry
            </label>
            <input
              type="text"
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.industry ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.industry && (
              <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
            )}
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="newsletterConsent"
              checked={formData.newsletterConsent}
              onChange={(e) => setFormData({...formData, newsletterConsent: e.target.checked})}
              className="mt-1"
            />
            <label 
              htmlFor="newsletterConsent" 
              className="text-gray-600 text-sm italic"
            >
              I agree to receive newsletters, updates, and promotional emails from Ready Set. I can unsubscribe at any time.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            Submit Now
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}