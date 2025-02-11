"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react"; // Añadimos useState
import toast from "react-hot-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  industry: string;
  newsletterConsent: boolean; // Added newsletter consent field
}

export default function NewsletterForm() {
  const [isLoading, setIsLoading] = useState(false);

  // Usamos useForm para manejar el formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      toast.success("Successfully registered.");
      reset(); // Reset the form after successful submission
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while submitting the form",
      );
    } finally {
      setIsLoading(false); // Desactivamos el loading al terminar
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
        <div className="w-full md:w-2/3">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-700">
              Newsletter Alert and Discounts
            </h2>
          </div>

          {/* Formulario con React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Campo: First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.firstName && (
                  <span className="text-sm text-red-500">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              {/* Campo: Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Campo: Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.lastName && (
                  <span className="text-sm text-red-500">
                    {errors.lastName.message}
                  </span>
                )}
              </div>

              {/* Campo: Industry */}
              <div>
                <label
                  htmlFor="industry"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Industry
                </label>
                <input
                  type="text"
                  id="industry"
                  {...register("industry", {
                    required: "Industry is required",
                  })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.industry && (
                  <span className="text-sm text-red-500">
                    {errors.industry.message}
                  </span>
                )}
              </div>
            </div>

            {/* Campo: Newsletter Consent */}
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("newsletterConsent")}
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to receive newsletters and promotional emails.
                </span>
              </label>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-6 w-full rounded-full px-4 py-2 transition-colors ${
                isLoading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-gray-800 hover:bg-gray-700"
              } flex items-center justify-center text-white`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                "Subscribe Now"
              )}
            </button>
          </form>
        </div>

        {/* Sección de redes sociales */}
        <div className="flex w-full flex-col items-center justify-center pt-10 md:w-1/3">
  <img
    src="/images/logo/logo-white.png"
    alt="Penguin Logo"
    className="mb-4 h-10 object-contain"
  />
  <div className="mb-6 text-center text-gray-600">
    Explore our{" "}
    <Link href="/free-resources" className="font-medium hover:text-gray-900 transition-colors">
      free guides resources
    </Link>{" "}
    and{" "}
    <Link href="/blog" className="font-medium hover:text-gray-900 transition-colors">
      blogs
    </Link>
    .
  </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              aria-label="Facebook"
              href="https://www.facebook.com/ReadySetCoGroup/"
              target="_blank"
              className="text-gray-400 hover:text-yellow"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <path d="M16.294 8.86875H14.369H13.6815V8.18125V6.05V5.3625H14.369H15.8128C16.1909 5.3625 16.5003 5.0875 16.5003 4.675V1.03125C16.5003 0.653125 16.2253 0.34375 15.8128 0.34375H13.3034C10.5878 0.34375 8.69714 2.26875 8.69714 5.12187V8.1125V8.8H8.00964H5.67214C5.19089 8.8 4.74402 9.17812 4.74402 9.72812V12.2031C4.74402 12.6844 5.12214 13.1313 5.67214 13.1313H7.94089H8.62839V13.8188V20.7281C8.62839 21.2094 9.00652 21.6562 9.55652 21.6562H12.7878C12.994 21.6562 13.1659 21.5531 13.3034 21.4156C13.4409 21.2781 13.544 21.0375 13.544 20.8312V13.8531V13.1656H14.2659H15.8128C16.2596 13.1656 16.6034 12.8906 16.6721 12.4781V12.4438V12.4094L17.1534 10.0375C17.1878 9.79688 17.1534 9.52187 16.9471 9.24687C16.8784 9.075 16.569 8.90312 16.294 8.86875Z" />
              </svg>
            </Link>
            <Link
              aria-label="tiktok"
              href="https://www.tiktok.com/@readyset.co"
              target="_blank"
              className="mx-2 px-3 text-gray-400 hover:text-yellow"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z" />
              </svg>
            </Link>
            <Link
              aria-label="instagram"
              href="https://www.instagram.com/readyset.co/"
              target="_blank"
              className="mx-2 px-3 text-gray-400 hover:text-yellow"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <path d="M11.0297 14.4305C12.9241 14.4305 14.4598 12.8948 14.4598 11.0004C14.4598 9.10602 12.9241 7.57031 11.0297 7.57031C9.13529 7.57031 7.59958 9.10602 7.59958 11.0004C7.59958 12.8948 9.13529 14.4305 11.0297 14.4305Z" />
                <path d="M14.7554 1.8335H7.24463C4.25807 1.8335 1.83334 4.25823 1.83334 7.24479V14.6964C1.83334 17.7421 4.25807 20.1668 7.24463 20.1668H14.6962C17.7419 20.1668 20.1667 17.7421 20.1667 14.7555V7.24479C20.1667 4.25823 17.7419 1.8335 14.7554 1.8335ZM11.0296 15.4948C8.51614 15.4948 6.53496 13.4545 6.53496 11.0002C6.53496 8.54586 8.54571 6.50554 11.0296 6.50554C13.4839 6.50554 15.4946 8.54586 15.4946 11.0002C15.4946 13.4545 13.5134 15.4948 11.0296 15.4948ZM17.2393 6.91952C16.9436 7.24479 16.5 7.42221 15.9973 7.42221C15.5538 7.42221 15.1102 7.24479 14.7554 6.91952C14.4301 6.59425 14.2527 6.18027 14.2527 5.67758C14.2527 5.17489 14.4301 4.79049 14.7554 4.43565C15.0807 4.08081 15.4946 3.90339 15.9973 3.90339C16.4409 3.90339 16.914 4.08081 17.2393 4.40608C17.535 4.79049 17.7419 5.23403 17.7419 5.70715C17.7124 6.18027 17.535 6.59425 17.2393 6.91952Z" />
                <path d="M16.0276 4.96777C15.6432 4.96777 15.318 5.29304 15.318 5.67745C15.318 6.06186 15.6432 6.38713 16.0276 6.38713C16.412 6.38713 16.7373 6.06186 16.7373 5.67745C16.7373 5.29304 16.4416 4.96777 16.0276 4.96777Z" />
              </svg>
            </Link>

            <Link
              aria-label="LinkedIn"
              href="http://linkedin.com/company/ready-set-group-llc/"
              target="_blank"
              className="mx-2 px-3 text-gray-400 hover:text-yellow"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.3763 0H1.62375C0.726562 0 0 0.726562 0 1.62375V20.3763C0 21.2734 0.726562 22 1.62375 22H20.3763C21.2734 22 22 21.2734 22 20.3763V1.62375C22 0.726562 21.2734 0 20.3763 0ZM6.81094 18.7688H3.47969V8.25469H6.81094V18.7688ZM5.14531 6.81094C4.07656 6.81094 3.20625 5.94063 3.20625 4.87188C3.20625 3.80313 4.07656 2.93281 5.14531 2.93281C6.21406 2.93281 7.08438 3.80313 7.08438 4.87188C7.08438 5.94063 6.21406 6.81094 5.14531 6.81094ZM18.7688 18.7688H15.4375V13.6531C15.4375 12.4469 15.4375 10.8906 13.7719 10.8906C12.1063 10.8906 11.8328 12.2063 11.8328 13.5219V18.7688H8.50156V8.25469H11.6688V9.69844H11.7781C12.2063 8.86719 13.3125 8.00781 14.9781 8.00781C18.3594 8.00781 18.7688 10.2094 18.7688 13.0156V18.7688Z"
                    fill="currentColor"
                  />
                </svg>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
