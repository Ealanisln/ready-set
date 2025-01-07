import { useState, FormEvent } from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  industry: string;
}

export default function NewsletterForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    industry: ''
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Newsletter Alert and Discounts
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-gray-800 text-white py-2 px-4 rounded-full hover:bg-gray-700 transition-colors"
            >
              Subscribe Now
            </button>
          </form>
        </div>
        
        <div className="w-full md:w-1/3 flex flex-col items-center">
  <img 
    src="/images/logo/logo-white.png" 
    alt="Penguin Logo" 
    className="h-10 object-contain mb-4" // Añadimos mb-4 para separar el logo del texto
  />
  <div className="text-gray-600 mb-6 text-center"> {/* Añadimos text-center para centrar el texto */}
    Explore our{' '}
    <span className="font-medium">free guides, resources,</span> and{' '}
    <span className="font-medium">blogs</span>.
  </div>
          
          <div className="flex gap-4">
            <Facebook className="w-6 h-6 text-gray-600" />
            <Instagram className="w-6 h-6 text-gray-600" />
            <Linkedin className="w-6 h-6 text-gray-600" />
            <Twitter className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
}