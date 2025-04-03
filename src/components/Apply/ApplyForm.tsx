// src/components/Apply/ApplyForm.tsx

"use client";

import React, { useState, JSX } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { FileUpload } from "./FileUpload";
import { FileUpload as FileUploadType } from "@/types/file";

interface FormData {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  education: string;
  workExperience: string;
  skills: string[];
  coverLetter: string;
  resume: FileList | null;
  driversLicense?: FileList | null;
  insurance?: FileList | null;
  vehicleRegistration?: FileList | null;
}

interface SubmissionData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  education: string;
  workExperience: string;
  skills: string[];
  coverLetter: string;
  resumeUrl: string | null;
  driversLicenseUrl: string | null;
  insuranceUrl: string | null;
  vehicleRegUrl: string | null;
  tempEntityId: string;
}

interface JobApplicationResponse {
  id: string;
  // Add other response fields as needed
}

const positions = [
  {
    title: "Driver for Catering Deliveries",
    description:
      "Join our team and help us deliver exceptional dining experiences to our clients.",
  },
  {
    title: "Virtual Assistant",
    description:
      "Help businesses achieve sustainable growth and success across the US.",
  },
  {
    title: "Other Positions",
    description: "Interested in other opportunities at Ready Set? Let us know!",
  },
];

const JobApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, FileUploadType[]>>({});
  const tempEntityId = `temp_${Date.now()}`;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      education: "",
      workExperience: "",
      skills: ["", "", ""],
      coverLetter: "",
      resume: null,
      driversLicense: null,
      insurance: null,
      vehicleRegistration: null,
    },
  });

  const selectedRole = watch("role");
  const isDriverRole = selectedRole === "Driver for Catering Deliveries";

  const handleUploadComplete = (fieldName: string) => (files: FileUploadType[]) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fieldName]: files,
    }));
  };

  const renderError = (error: { message?: string } | undefined): JSX.Element | null => {
    if (error) {
      return <p className="mt-1 text-sm text-red-600">{error.message}</p>;
    }
    return null;
  };

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      // Destructure address and role from formData
      const { address, role, ...otherData } = formData;

      // Construct submission data with flattened address fields
      const submissionData: SubmissionData = {
        ...otherData,
        position: role,
        addressStreet: address?.street || "",
        addressCity: address?.city || "",
        addressState: address?.state || "",
        addressZip: address?.zip || "",
        resumeUrl: uploadedFiles.resume?.[0]?.fileUrl || null,
        driversLicenseUrl: uploadedFiles.driversLicense?.[0]?.fileUrl || null,
        insuranceUrl: uploadedFiles.insurance?.[0]?.fileUrl || null,
        vehicleRegUrl: uploadedFiles.vehicleRegistration?.[0]?.fileUrl || null,
        tempEntityId: tempEntityId,
      };

      console.log("Submitting application with data:", submissionData);

      const response = await fetch("/api/job-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit application: ${response.statusText}`);
      }

      const result = (await response.json()) as JobApplicationResponse;

      // Clear the form
      reset();
      setUploadedFiles({});

      // Show success toast
      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-400 p-6">
            <h1 className="text-2xl font-bold text-white">
              Ready Set Career Application
            </h1>
            <p className="mt-2 text-white opacity-90">
              Join our growing team and make an impact
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Position *
              </label>
              <div className="relative">
                <select
                  className={`block w-full rounded-md border ${
                    errors.role ? "border-red-500" : "border-gray-300"
                  } appearance-none bg-white px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  {...register("role", {
                    required: "Please select a position",
                  })}
                >
                  <option value="">Choose a position</option>
                  {positions.map((pos, idx) => (
                    <option key={idx} value={pos.title}>
                      {pos.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {renderError(errors.role)}
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                    })}
                  />
                  {renderError(errors.firstName)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                    })}
                  />
                  {renderError(errors.lastName)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {renderError(errors.email)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  {...register("phone", {
                    pattern: {
                      value: /^[\d\s-+()]*$/,
                      message: "Invalid phone number format",
                    },
                  })}
                />
                {renderError(errors.phone)}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <input
                  type="text"
                  placeholder="Street Address"
                  className={`block w-full rounded-md border ${
                    errors.address?.street
                      ? "border-red-500"
                      : "border-gray-300"
                  } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  {...register("address.street", {
                    required: "Street address is required",
                  })}
                />
                {renderError(errors.address?.street)}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      className={`block w-full rounded-md border ${
                        errors.address?.city
                          ? "border-red-500"
                          : "border-gray-300"
                      } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                      {...register("address.city", {
                        required: "City is required",
                      })}
                    />
                    {renderError(errors.address?.city)}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="State"
                      className={`block w-full rounded-md border ${
                        errors.address?.state
                          ? "border-red-500"
                          : "border-gray-300"
                      } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                      {...register("address.state", {
                        required: "State is required",
                      })}
                    />
                    {renderError(errors.address?.state)}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="ZIP Code"
                  className={`block w-full rounded-md border ${
                    errors.address?.zip ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  {...register("address.zip", {
                    required: "ZIP code is required",
                    pattern: {
                      value: /^\d{5}(-\d{4})?$/,
                      message: "Invalid ZIP code format",
                    },
                  })}
                />
                {renderError(errors.address?.zip)}
              </div>

              <div>
                <FileUpload
                  name="resume"
                  label="Resume"
                  required
                  error={errors.resume}
                  uploadConfig={{
                    category: "resume",
                    entityType: "job_application",
                    entityId: tempEntityId,
                    allowedFileTypes: [".pdf", ".doc", ".docx"],
                  }}
                  onUploadComplete={handleUploadComplete("resume")}
                />
              </div>

              {isDriverRole && (
                <div className="space-y-4">
                  <FileUpload
                    name="driversLicense"
                    label="Driver's License"
                    required
                    error={errors.driversLicense}
                    uploadConfig={{
                      category: "license",
                      entityType: "job_application",
                      entityId: tempEntityId,
                      allowedFileTypes: [".pdf", ".jpg", ".jpeg", ".png"],
                    }}
                    onUploadComplete={handleUploadComplete("driversLicense")}
                  />

                  <FileUpload
                    name="insurance"
                    label="Insurance Document"
                    required
                    error={errors.insurance}
                    uploadConfig={{
                      category: "insurance",
                      entityType: "job_application",
                      entityId: tempEntityId,
                      allowedFileTypes: [".pdf", ".jpg", ".jpeg", ".png"],
                    }}
                    onUploadComplete={handleUploadComplete("insurance")}
                  />

                  <FileUpload
                    name="vehicleRegistration"
                    label="Vehicle Registration"
                    required
                    error={errors.vehicleRegistration}
                    uploadConfig={{
                      category: "registration",
                      entityType: "job_application",
                      entityId: tempEntityId,
                      allowedFileTypes: [".pdf", ".jpg", ".jpeg", ".png"],
                    }}
                    onUploadComplete={handleUploadComplete("vehicleRegistration")}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cover Letter
                </label>
                <textarea
                  className={`mt-1 block w-full rounded-md border ${
                    errors.coverLetter ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  rows={4}
                  placeholder="Tell us why you're interested in this position..."
                  {...register("coverLetter")}
                />
                {renderError(errors.coverLetter)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Education *
                </label>
                <textarea
                  className={`mt-1 block w-full rounded-md border ${
                    errors.education ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  rows={3}
                  placeholder="List your educational background..."
                  {...register("education", {
                    required: "Education information is required",
                    minLength: {
                      value: 10,
                      message:
                        "Please provide more detail about your education",
                    },
                  })}
                />
                {renderError(errors.education)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Work Experience *
                </label>
                <textarea
                  className={`mt-1 block w-full rounded-md border ${
                    errors.workExperience ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  rows={4}
                  placeholder="Describe your relevant work experience..."
                  {...register("workExperience", {
                    required: "Work experience is required",
                    minLength: {
                      value: 20,
                      message:
                        "Please provide more detail about your work experience",
                    },
                  })}
                />
                {renderError(errors.workExperience)}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Main Skills *
                </label>
                {[0, 1, 2].map((index) => (
                  <div key={index}>
                    <input
                      type="text"
                      className={`block w-full rounded-md border ${
                        errors.skills?.[index]
                          ? "border-red-500"
                          : "border-gray-300"
                      } px-3 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                      placeholder={`Skill ${index + 1} (e.g., ${
                        index === 0
                          ? "Customer Service"
                          : index === 1
                            ? "Time Management"
                            : "Problem Solving"
                      })`}
                      {...register(`skills.${index}`, {
                        required: "This skill is required",
                        minLength: {
                          value: 2,
                          message: "Skill must be at least 2 characters",
                        },
                      })}
                    />
                    {errors.skills?.[index] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.skills[index].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gradient-to-r from-yellow-400 to-amber-400 px-4 py-3 text-white transition-colors duration-200 hover:from-yellow-500 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;