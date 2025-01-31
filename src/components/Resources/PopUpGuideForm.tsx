'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

  // Inicializar React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  // Función para manejar el envío del formulario
  const onSubmit = async (data: FormData) => {
    console.log('Iniciando envío del formulario...');
    console.log('Datos del formulario:', data);

    try {
      // Aquí enviarías los datos a tu API
      console.log('Form submitted:', data);
      console.log('Limpiando formulario y cerrando diálogo...');

      // Restablecer el formulario y cerrar el diálogo
      reset();
      setOpen(false);
      console.log('Envío completado exitosamente');
    } catch (error) {
      console.error('Error submitting form:', error);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              {...register("firstName", { required: "First name is required" })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
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
              {...register("lastName", { required: "Last name is required" })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email",
                },
              })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
              {...register("industry", { required: "Industry is required" })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.industry ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.industry && (
              <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="newsletterConsent"
              {...register("newsletterConsent")}
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