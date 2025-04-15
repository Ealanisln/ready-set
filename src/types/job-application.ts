import { FileUpload } from "./file";

export enum ApplicationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  INTERVIEWING = "INTERVIEWING"
}

export interface JobApplication {
  id: string;
  profileId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  position: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  education: string;
  workExperience: string;
  skills: string;
  coverLetter: string | null;
  resumeUrl: string;
  driversLicenseUrl: string | null;
  insuranceUrl: string | null;
  vehicleRegUrl: string | null;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  fileUploads?: FileUpload[];
}

export interface JobApplicationsResponse {
  applications: JobApplication[];
  totalCount: number;
  totalPages: number;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  feedbackNote?: string;
}

export interface JobApplicationStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  interviewingApplications: number;
  applicationsByPosition: Record<string, number>;
  recentApplications: JobApplication[];
} 