// src/components/Apply/ApplyForm.tsx

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { useJobApplicationUpload } from "@/hooks/use-job-application-upload";
import { toast } from "@/components/ui/use-toast";
import { FileUpload } from "./FileUpload";
import { FormData, SubmissionData, JobApplicationResponse } from "./types";
import { v4 as uuidv4 } from "uuid";

// Helper to generate accept string from allowed file types
const generateAcceptString = (types: string[]): string => types.join(",");

// Define allowed file types
const RESUME_TYPES = [".pdf", ".doc", ".docx"];
const IMAGE_PDF_TYPES = [".pdf", ".jpg", ".jpeg", ".png"];

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
  const tempEntityId = `temp_${uuidv4()}`;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting: formIsSubmitting, isDirty, isValid },
    trigger,
  } = useForm<FormData>({
    mode: "onChange",  // Enable real-time validation
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
      // Initialize file fields (even though they are managed by hooks, RHF needs keys)
      resume: null,
      driversLicense: null,
      insurance: null,
      vehicleRegistration: null,
      foodHandler: null,
      hipaa: null,
      driverPhoto: null,
      carPhoto: null,
      equipmentPhoto: null,
    },
  });

  const selectedRole = watch("role");
  const isDriverRole = selectedRole === "Driver for Catering Deliveries";

  const resumeUpload = useJobApplicationUpload({
    bucketName: "user-assets",
    category: "resume",
    entityType: "job_application",
    entityId: tempEntityId,
    allowedFileTypes: RESUME_TYPES,
    maxFileCount: 1,
  });

  const licenseUpload = useJobApplicationUpload({
    bucketName: "user-assets",
    category: "license",
    entityType: "job_application",
    entityId: tempEntityId,
    allowedFileTypes: IMAGE_PDF_TYPES,
    maxFileCount: 1,
  });

  const insuranceUpload = useJobApplicationUpload({
    bucketName: "user-assets",
    category: "insurance",
    entityType: "job_application",
    entityId: tempEntityId,
    allowedFileTypes: IMAGE_PDF_TYPES,
    maxFileCount: 1,
  });

  const registrationUpload = useJobApplicationUpload({
    bucketName: "user-assets",
    category: "registration",
    entityType: "job_application",
    entityId: tempEntityId,
    allowedFileTypes: IMAGE_PDF_TYPES,
    maxFileCount: 1,
  });

  const foodHandlerUpload = useJobApplicationUpload({
    bucketName: "user-assets",
    category: "food_handler",
    entityType: "job_application",
    entityId: tempEntityId,
    allowedFileTypes: IMAGE_PDF_TYPES,
    maxFileCount: 1,
  });

  const hipaaUpload = useJobApplicationUpload({
    bucketName: "user-assets",
    category: "hipaa",
    entityType: "job_application",
    entityId: tempEntityId,
    allowedFileTypes: IMAGE_PDF_TYPES,
    maxFileCount: 1,
  });

  const driverPhotoUpload = useJobApplicationUpload({
    bucketName: "user-assets",
    category: "driver_photo",
    entityType: "job_application",
    entityId: tempEntityId,
    allowedFileTypes: [".jpg", ".jpeg", ".png"],
    maxFileCount: 1,
  });

  const carPhotoUpload = useJobApplicationUpload({
    bucketName: "user-assets",
    category: "car_photo",
    entityType: "job_application",
    entityId: tempEntityId,
    allowedFileTypes: [".jpg", ".jpeg", ".png"],
    maxFileCount: 1,
  });

  const equipmentPhotoUpload = useJobApplicationUpload({
    bucketName: "user-assets",
    category: "equipment_photo",
    entityType: "job_application",
    entityId: tempEntityId,
    allowedFileTypes: [".jpg", ".jpeg", ".png"],
    maxFileCount: 1,
  });

  // Watch for role changes to trigger validation
  React.useEffect(() => {
    if (isDirty) {
      trigger();  // Re-validate form when role changes
    }
  }, [selectedRole, isDirty, trigger]);

  const renderError = (
    error: { message?: string } | undefined,
  ): React.ReactNode => {
    if (error) {
      return <p className="mt-1 text-sm text-red-600">{error.message}</p>;
    }
    return null;
  };

  const onSubmit = async (formData: FormData) => {
    console.log("Form submission started", { formData });
    
    // Validate required files based on role
    const fileValidationErrors = validateFiles(formData.role);
    if (fileValidationErrors.length > 0) {
      fileValidationErrors.forEach(error => {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { address, role, ...otherData } = formData;

      // Filter out empty skills
      const filteredSkills = otherData.skills.filter(skill => skill.trim() !== "");

      const submissionData: SubmissionData = {
        ...otherData,
        skills: filteredSkills,
        role,
        address: {
          street: address?.street || "",
          city: address?.city || "",
          state: address?.state || "",
          zip: address?.zip || ""
        },
        resumeFileId: resumeUpload.uploadedFiles[0]?.key || null,
        driversLicenseFileId: licenseUpload.uploadedFiles[0]?.key || null,
        insuranceFileId: insuranceUpload.uploadedFiles[0]?.key || null,
        vehicleRegFileId: registrationUpload.uploadedFiles[0]?.key || null,
        // Add the file IDs for the new uploads
        foodHandlerFileId: foodHandlerUpload.uploadedFiles[0]?.key || null,
        hipaaFileId: hipaaUpload.uploadedFiles[0]?.key || null,
        driverPhotoFileId: driverPhotoUpload.uploadedFiles[0]?.key || null,
        carPhotoFileId: carPhotoUpload.uploadedFiles[0]?.key || null,
        equipmentPhotoFileId: equipmentPhotoUpload.uploadedFiles[0]?.key || null,
      };

      console.log("Submitting application data:", submissionData);

      const response = await fetch("/api/job-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || `Failed to submit application: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("API response:", responseData);

      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      });

      // Reset form and uploaded files
      reset();
      resumeUpload.setUploadedFiles([]);
      licenseUpload.setUploadedFiles([]);
      insuranceUpload.setUploadedFiles([]);
      registrationUpload.setUploadedFiles([]);
      foodHandlerUpload.setUploadedFiles([]);
      hipaaUpload.setUploadedFiles([]);
      driverPhotoUpload.setUploadedFiles([]);
      carPhotoUpload.setUploadedFiles([]);
      equipmentPhotoUpload.setUploadedFiles([]);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to validate required files
  const validateFiles = (role: string): string[] => {
    const errors: string[] = [];

    // Only require resume if NOT a driver role
    if (role !== "Driver for Catering Deliveries" && resumeUpload.uploadedFiles.length === 0) {
      errors.push("Please upload your resume");
    }

    // Driver-specific file requirements
    if (role === "Driver for Catering Deliveries") {
      if (licenseUpload.uploadedFiles.length === 0) {
        errors.push("Please upload your driver's license");
      }
      if (insuranceUpload.uploadedFiles.length === 0) {
        errors.push("Please upload your insurance");
      }
      if (registrationUpload.uploadedFiles.length === 0) {
        errors.push("Please upload your vehicle registration");
      }
      if (driverPhotoUpload.uploadedFiles.length === 0) {
        errors.push("Please upload your driver photo");
      }
      if (carPhotoUpload.uploadedFiles.length === 0) {
        errors.push("Please upload your car photo");
      }
    }

    return errors;
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

          <form 
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6"
            noValidate
          >
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

              {/* Resume field - only show if NOT Driver for Catering Deliveries */}
              {!isDriverRole && (
                <div>
                  <FileUpload
                    name="resume"
                    label="Resume"
                    required
                    error={errors.resume}
                    startUpload={resumeUpload.onUpload}
                    deleteFile={resumeUpload.deleteFile}
                    file={resumeUpload.uploadedFiles[0] || null}
                    isUploading={resumeUpload.isUploading}
                    progresses={resumeUpload.progresses}
                    accept={generateAcceptString(RESUME_TYPES)}
                  />
                </div>
              )}

              {isDriverRole && (
                <div className="space-y-4">
                  <FileUpload
                    name="driversLicense"
                    label="Driver's License"
                    required
                    error={errors.driversLicense}
                    startUpload={licenseUpload.onUpload}
                    deleteFile={licenseUpload.deleteFile}
                    file={licenseUpload.uploadedFiles[0] || null}
                    isUploading={licenseUpload.isUploading}
                    progresses={licenseUpload.progresses}
                    accept={generateAcceptString(IMAGE_PDF_TYPES)}
                  />

                  <FileUpload
                    name="insurance"
                    label="Insurance Document"
                    required
                    error={errors.insurance}
                    startUpload={insuranceUpload.onUpload}
                    deleteFile={insuranceUpload.deleteFile}
                    file={insuranceUpload.uploadedFiles[0] || null}
                    isUploading={insuranceUpload.isUploading}
                    progresses={insuranceUpload.progresses}
                    accept={generateAcceptString(IMAGE_PDF_TYPES)}
                  />

                  <FileUpload
                    name="vehicleRegistration"
                    label="Vehicle Registration"
                    required
                    error={errors.vehicleRegistration}
                    startUpload={registrationUpload.onUpload}
                    deleteFile={registrationUpload.deleteFile}
                    file={registrationUpload.uploadedFiles[0] || null}
                    isUploading={registrationUpload.isUploading}
                    progresses={registrationUpload.progresses}
                    accept={generateAcceptString(IMAGE_PDF_TYPES)}
                  />

                  {/* Food Handler Certificate */}
                  <FileUpload
                    name="foodHandler"
                    label="Food Handler Certificate"
                    required={false}
                    error={errors.foodHandler}
                    startUpload={foodHandlerUpload.onUpload}
                    deleteFile={foodHandlerUpload.deleteFile}
                    file={foodHandlerUpload.uploadedFiles[0] || null}
                    isUploading={foodHandlerUpload.isUploading}
                    progresses={foodHandlerUpload.progresses}
                    accept={generateAcceptString(IMAGE_PDF_TYPES)}
                  />

                  {/* HIPAA Certificate */}
                  <FileUpload
                    name="hipaa"
                    label="HIPAA Certificate"
                    required={false}
                    error={errors.hipaa}
                    startUpload={hipaaUpload.onUpload}
                    deleteFile={hipaaUpload.deleteFile}
                    file={hipaaUpload.uploadedFiles[0] || null}
                    isUploading={hipaaUpload.isUploading}
                    progresses={hipaaUpload.progresses}
                    accept={generateAcceptString(IMAGE_PDF_TYPES)}
                  />

                  {/* Driver Photo (mandatory) */}
                  <FileUpload
                    name="driverPhoto"
                    label="Driver Photo"
                    required
                    error={errors.driverPhoto}
                    startUpload={driverPhotoUpload.onUpload}
                    deleteFile={driverPhotoUpload.deleteFile}
                    file={driverPhotoUpload.uploadedFiles[0] || null}
                    isUploading={driverPhotoUpload.isUploading}
                    progresses={driverPhotoUpload.progresses}
                    accept={generateAcceptString([".jpg", ".jpeg", ".png"])}
                  />

                  {/* Car Photo (mandatory) */}
                  <FileUpload
                    name="carPhoto"
                    label="Car Photo"
                    required
                    error={errors.carPhoto}
                    startUpload={carPhotoUpload.onUpload}
                    deleteFile={carPhotoUpload.deleteFile}
                    file={carPhotoUpload.uploadedFiles[0] || null}
                    isUploading={carPhotoUpload.isUploading}
                    progresses={carPhotoUpload.progresses}
                    accept={generateAcceptString([".jpg", ".jpeg", ".png"])}
                  />

                  {/* Equipment Photo (optional) */}
                  <FileUpload
                    name="equipmentPhoto"
                    label="Equipment Photo (Optional)"
                    required={false}
                    error={errors.equipmentPhoto}
                    startUpload={equipmentPhotoUpload.onUpload}
                    deleteFile={equipmentPhotoUpload.deleteFile}
                    file={equipmentPhotoUpload.uploadedFiles[0] || null}
                    isUploading={equipmentPhotoUpload.isUploading}
                    progresses={equipmentPhotoUpload.progresses}
                    accept={generateAcceptString([".jpg", ".jpeg", ".png"])}
                  />
                </div>
              )}

              {/* Hide these fields for Driver for Catering Deliveries */}
              {!isDriverRole && (
                <>
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
                </>
              )}
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
