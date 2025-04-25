import { UploadedFile } from "@/hooks/use-upload-file";

export interface FormData {
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
  resume: File | null;
  driversLicense: File | null;
  insurance: File | null;
  vehicleRegistration: File | null;
  foodHandler?: File | null;
  hipaa?: File | null;
  driverPhoto?: File | null;
  carPhoto?: File | null;
  equipmentPhoto?: File | null;
}

export interface SubmissionData {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  education: string;
  workExperience: string;
  skills: string[];
  coverLetter: string | null;
  resumeFileId: string | null;
  driversLicenseFileId: string | null;
  insuranceFileId: string | null;
  vehicleRegFileId: string | null;
  foodHandlerFileId: string | null;
  hipaaFileId: string | null;
  driverPhotoFileId: string | null;
  carPhotoFileId: string | null;
  equipmentPhotoFileId: string | null;
}

export interface JobApplicationResponse {
  success: boolean;
  id: string;
  message?: string;
  error?: string;
} 