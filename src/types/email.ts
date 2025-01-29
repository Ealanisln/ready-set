// types/email.ts
export interface BaseEmailData {
    email: string;
    name: string;
  }
  
  export interface JobApplicationData extends BaseEmailData {
    message: string;
    subject?: string;
  }
  
  export interface UserRegistrationData extends BaseEmailData {
    userType: 'client' | 'vendor';
    company: string;
  }
  
  export interface QuoteRequestData extends BaseEmailData {
    phone: string;
    company: string;
    website?: string;
    counties: string[];
    pickupAddress: string;
    specifications: any;
    additionalInfo?: string;
    submissionId: string;
  }
  
  export type EmailType = 'jobApplication' | 'userRegistration' | 'quoteRequest';