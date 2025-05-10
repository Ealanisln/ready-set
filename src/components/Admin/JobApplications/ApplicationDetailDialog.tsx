"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Trash2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JobApplication, ApplicationStatus } from "@/types/job-application";
import { StatusBadge } from "./StatusBadge";

type ApplicationDetailDialogProps = {
  application: JobApplication | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDeleteClick: (application: JobApplication) => void;
  isSubmitting: boolean;
  error: string | null;
};

export const ApplicationDetailDialog: React.FC<ApplicationDetailDialogProps> = ({
  application,
  open,
  onClose,
  onStatusChange,
  onDeleteClick,
  isSubmitting,
  error,
}) => {
  if (!application) return null;

  // Format date helper
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Open document utility function
  const openDocument = (url: string | null) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  // Get document sources from both legacy fields and new fileUploads
  const getDocumentSources = () => {
    const sources: { label: string; url: string | null; category?: string }[] = [];
    
    // Add resume
    if (application.resumeUrl) {
      sources.push({ label: "Resume", url: application.resumeUrl });
    }
    
    // Add driver's license if applicable
    if (application.driversLicenseUrl) {
      sources.push({ label: "Driver's License", url: application.driversLicenseUrl });
    }
    
    // Add insurance if applicable
    if (application.insuranceUrl) {
      sources.push({ label: "Insurance", url: application.insuranceUrl });
    }
    
    // Add vehicle registration if applicable
    if (application.vehicleRegUrl) {
      sources.push({ label: "Vehicle Registration", url: application.vehicleRegUrl });
    }
    
    // Add food handler if applicable
    if (application.foodHandlerUrl) {
      sources.push({ label: "Food Handler Certificate", url: application.foodHandlerUrl });
    }
    
    // Add HIPAA if applicable
    if (application.hipaaUrl) {
      sources.push({ label: "HIPAA Certificate", url: application.hipaaUrl });
    }
    
    // Add photos if applicable
    if (application.driverPhotoUrl) {
      sources.push({ label: "Driver Photo", url: application.driverPhotoUrl });
    }
    
    if (application.carPhotoUrl) {
      sources.push({ label: "Vehicle Photo", url: application.carPhotoUrl });
    }
    
    if (application.equipmentPhotoUrl) {
      sources.push({ label: "Equipment Photo", url: application.equipmentPhotoUrl });
    }
    
    // Add any file uploads
    if (application.fileUploads?.length) {
      application.fileUploads.forEach(upload => {
        sources.push({
          label: upload.category || upload.fileName,
          url: upload.fileUrl,
          category: upload.category
        });
      });
    }
    
    return sources;
  };

  const documentSources = getDocumentSources();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && !isSubmitting) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Application Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {application.firstName} {application.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {application.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {application.phone || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span> {application.addressStreet}, {application.addressCity}, {application.addressState} {application.addressZip}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Application Details</h3>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="font-medium">Position:</span> {application.position}
                  </div>
                  <div>
                    <span className="font-medium">Date Applied:</span> {formatDate(application.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> <StatusBadge status={application.status} />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Documents</h3>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {documentSources.length === 0 ? (
                    <div className="text-gray-500">No documents available</div>
                  ) : (
                    documentSources.map((doc, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="justify-start"
                        onClick={() => doc.url && openDocument(doc.url)}
                        disabled={!doc.url}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="truncate">{doc.label}</span>
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </Button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Qualifications</h3>
                <div className="mt-2 space-y-3">
                  <div>
                    <span className="font-medium">Education:</span>
                    <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                      {application.education || "N/A"}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Work Experience:</span>
                    <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                      {application.workExperience || "N/A"}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Skills:</span>
                    <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                      {application.skills || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              
              {application.coverLetter && (
                <div>
                  <h3 className="text-lg font-medium">Cover Letter</h3>
                  <div className="mt-2 text-sm text-gray-700 whitespace-pre-line border rounded-md p-3 max-h-48 overflow-y-auto">
                    {application.coverLetter}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <DialogFooter className="mt-6 flex-col sm:flex-row gap-2 sm:justify-between sm:gap-0">
          <Button
            variant="destructive"
            onClick={() => onDeleteClick(application)}
            disabled={isSubmitting}
            className="sm:order-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Application
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Close
            </Button>
            
            <Button
              variant="default"
              onClick={() => onStatusChange(application.id, ApplicationStatus.APPROVED)}
              disabled={isSubmitting || application.status === ApplicationStatus.APPROVED}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
            
            <Button
              variant="default"
              onClick={() => onStatusChange(application.id, ApplicationStatus.REJECTED)}
              disabled={isSubmitting || application.status === ApplicationStatus.REJECTED}
              className="bg-red-600 hover:bg-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            
            <Button
              variant="default"
              onClick={() => onStatusChange(application.id, ApplicationStatus.INTERVIEWING)}
              disabled={isSubmitting || application.status === ApplicationStatus.INTERVIEWING}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Interview
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 