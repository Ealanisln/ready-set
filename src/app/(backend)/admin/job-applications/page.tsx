"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ClipboardList,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  Briefcase,
  UserCircle2,
  BarChart4,
  PieChart as PieChartIcon,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingDashboard } from "@/components/ui/loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  JobApplication,
  ApplicationStatus,
  JobApplicationStats,
} from "@/types/job-application";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { approveJobApplication } from '@/app/actions/admin/job-applications';
import { createClient } from "@/utils/supabase/client";


const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#6366f1"];

// Status badge component
const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const statusConfig = {
    [ApplicationStatus.PENDING]: {
      label: "Pending",
      className: "bg-amber-100 text-amber-700 border border-amber-200",
      icon: <Clock className="h-3 w-3 mr-1" />
    },
    [ApplicationStatus.APPROVED]: {
      label: "Approved",
      className: "bg-green-100 text-green-700 border border-green-200",
      icon: <CheckCircle className="h-3 w-3 mr-1" />
    },
    [ApplicationStatus.REJECTED]: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 border border-red-200",
      icon: <XCircle className="h-3 w-3 mr-1" />
    },
    [ApplicationStatus.INTERVIEWING]: {
      label: "Interviewing",
      className: "bg-indigo-100 text-indigo-700 border border-indigo-200",
      icon: <Users className="h-3 w-3 mr-1" />
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={config.className}>
      <span className="flex items-center">
        {config.icon}
        {config.label}
      </span>
    </Badge>
  );
};

// Metric card component
const MetricCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  totalApplications: number;
}> = ({ title, value, icon, color, totalApplications }) => {
  const percentage = totalApplications > 0 ? (value / totalApplications) * 100 : 0;
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col h-full">
      <div className={`h-1 ${color}`}></div>
      <CardContent className="p-6 flex-grow flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className={`rounded-full p-3 ${color} bg-opacity-15 text-white`}>
            {icon}
          </div>
        </div>
        <div className="mt-3 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">{value}</p>
            {value > 0 && totalApplications > 0 && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-50">
                {percentage.toFixed(0)}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">{title}</p>
        </div>
        
        {value > 0 && totalApplications > 0 && (
          <div className="mt-auto w-full">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${color}`} 
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Application detail dialog
const ApplicationDetailDialog: React.FC<{
  application: JobApplication | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  isSubmitting?: boolean;
  error?: string | null;
}> = ({ application, open, onClose, onStatusChange, isSubmitting, error }) => {
  if (!application) return null;

  const handleStatusChange = (status: ApplicationStatus) => {
    onStatusChange(application.id, status);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get the actual file URLs from the fileUploads array if available
  const getDocumentUrl = (fileId: string | null): string => {
    // If it's already a full URL (starts with http or https), use it directly
    if (fileId && (fileId.startsWith('http://') || fileId.startsWith('https://'))) {
      // Check if the URL needs to be transformed to a different format
      if (fileId.includes('/storage/v1/object/public/')) {
        console.log("URL appears to be a standard Supabase URL");
        
        // Try to extract the bucket name and path
        const matches = fileId.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
        if (matches && matches.length === 3) {
          const bucket = matches[1];
          const path = matches[2];
          console.log("Extracted bucket:", bucket, "path:", path);
          
          // Generate a download URL as an alternative
          // This might bypass public access issues in some cases
          console.log("Original URL:", fileId);
          return fileId; // Use original for now
        }
      }
      return fileId;
    }
    
    // Otherwise, try to find the file in the fileUploads array
    if (fileId && application.fileUploads && application.fileUploads.length > 0) {
      const fileUpload = application.fileUploads.find(file => file.id === fileId);
      if (fileUpload?.fileUrl) {
        console.log("Found file URL:", fileUpload.fileUrl);
        return fileUpload.fileUrl;
      }
    }
    
    // If we couldn't find a matching file or there are no fileUploads,
    // this might be a legacy entry with the URL stored directly
    return fileId || '';
  };

  return (
    <Dialog open={open} onOpenChange={onClose} aria-label="Application Details">
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-3xl bg-white"
        role="dialog"
        aria-modal="true"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <UserCircle2 className="h-8 w-8 text-gray-400" aria-hidden="true" />
            Application Details
          </DialogTitle>
          <DialogDescription>
            Submitted on{" "}
            <span className="font-medium">
              {formatDate(application.createdAt)}
            </span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <section aria-labelledby="personal-info-heading">
            <h3 id="personal-info-heading" className="mb-4 text-lg font-semibold">
              Personal Information
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-gray-200 h-12 w-12 flex items-center justify-center text-xl font-bold text-gray-600">
                {application.firstName?.[0]?.toUpperCase() + (application.lastName?.[0]?.toUpperCase() || '')}
              </div>
              <div>
                <div className="text-base font-medium">
                  {application.firstName} {application.lastName}
                </div>
                <div className="text-sm text-gray-500">{application.email}</div>
              </div>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs font-semibold text-gray-500">Phone</dt>
                <dd className="text-sm">{application.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500">Position</dt>
                <dd className="text-sm">{application.position}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500">Status</dt>
                <dd>
                  <StatusBadge status={application.status} />
                </dd>
              </div>
            </dl>
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-gray-500 mb-1">Address</h4>
              <address className="not-italic text-sm text-gray-700">
                {application.addressStreet}
                <br />
                {application.addressCity}, {application.addressState} {application.addressZip}
              </address>
            </div>
          </section>

          {/* Qualifications */}
          <section aria-labelledby="qualifications-heading">
            <h3 id="qualifications-heading" className="mb-4 text-lg font-semibold">
              Qualifications
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-semibold text-gray-500">Education</dt>
                <dd className="text-sm whitespace-pre-wrap">{application.education}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500">Work Experience</dt>
                <dd className="text-sm whitespace-pre-wrap">{application.workExperience}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500">Skills</dt>
                <dd className="text-sm">{application.skills}</dd>
              </div>
              {application.coverLetter && (
                <div>
                  <dt className="text-xs font-semibold text-gray-500">Cover Letter</dt>
                  <dd className="text-sm whitespace-pre-wrap">{application.coverLetter}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        {/* Documents */}
        <section className="mt-8" aria-labelledby="documents-heading">
          <h3 id="documents-heading" className="mb-4 text-lg font-semibold">
            Documents
          </h3>
          <div className="flex flex-wrap gap-3">
            {/* Iterate over fileUploads array */}
            {application.fileUploads && application.fileUploads.length > 0 ? (
              application.fileUploads.map((file) => {
                // Create more descriptive document labels based on category
                let documentLabel = file.category || file.fileName || 'Document';
                
                // Map standard categories to more readable labels
                const categoryLabels: Record<string, string> = {
                  'resume': 'Resume',
                  'license': 'Driver\'s License',
                  'insurance': 'Insurance',
                  'registration': 'Vehicle Registration',
                  'food_handler': 'Food Handler Card',
                  'hipaa': 'HIPAA Certification',
                  'driver_photo': 'Driver Photo',
                  'car_photo': 'Car Photo',
                  'equipment_photo': 'Equipment Photo'
                };
                
                if (file.category && categoryLabels[file.category]) {
                  documentLabel = categoryLabels[file.category];
                } else if (file.category) {
                  // Format any other category string
                  documentLabel = file.category
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                }
                
                return (
                  <Button
                    key={file.id} // Use file.id as the key
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      console.log(`Opening file: ${file.fileName}, URL: ${file.fileUrl}`);
                      // Pass the fileUrl directly, no need for getDocumentUrl here
                      window.open(file.fileUrl || '', '_blank');
                    }}
                    aria-label={`View ${documentLabel}`}
                  >
                    <FileText className="h-4 w-4" />
                    {documentLabel}
                  </Button>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded.</p>
            )}
          </div>
        </section>

        {/* Actions */}
        <section className="mt-8 flex flex-row gap-3 justify-end">
          <Button
            variant="destructive"
            disabled={isSubmitting}
            onClick={() => handleStatusChange(ApplicationStatus.REJECTED)}
            aria-label="Reject Application"
          >
            Reject
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isSubmitting}
            onClick={() => handleStatusChange(ApplicationStatus.APPROVED)}
            aria-label="Approve Application"
          >
            Approve
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  );
};

// Create a reusable function for opening documents with fallback
const openDocumentWithFallback = async (url: string) => {
  console.log("Document URL (resolved, passed to openDocumentWithFallback):", url); // Log URL passed to function

  if (!url) {
    console.error("No URL provided to openDocumentWithFallback.");
    toast({
      title: "Error",
      description: "Document URL is missing.",
      variant: "destructive",
    });
    return;
  }
  
  try {
    // First try to open the file directly
    console.log("Attempting to open URL directly:", url);
    let win = window.open(url, "_blank");
    
    // Check if window.open returned null or if the window was closed immediately (common pop-up blocker behavior)
    if (!win || win.closed || typeof win.closed === 'undefined') { 
        console.warn("window.open might have been blocked or failed. URL:", url);
        
        // If the URL is a Supabase URL and we can extract the path,
        // try to get a signed URL as a fallback
        if (url.includes('/storage/v1/object/public/')) {
            console.log("Direct URL might have failed, trying signed URL...");
            const matches = url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
            
            if (matches && matches.length === 3) {
                const path = matches[2];
                console.log("Trying to get signed URL for path:", path);
                
                try {
                    const supabase = createClient();
                    const { data: { session } } = await supabase.auth.getSession();
                    
                    if (!session?.access_token) {
                      throw new Error("No active session - please log in");
                    }
                    
                    const response = await fetch(`/api/file-uploads?path=${encodeURIComponent(path)}`, {
                      headers: {
                        Authorization: `Bearer ${session.access_token}`
                      }
                    });
                    console.log("Signed URL API response status:", response.status);
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Got signed URL data:", data);
                        if (data.url) {
                            console.log("Attempting to open signed URL:", data.url);
                            window.open(data.url, "_blank");
                        } else {
                            console.error("Signed URL missing in API response.");
                            toast({ title: "Error", description: "Could not retrieve document link.", variant: "destructive" });
                        }
                    } else {
                        const errorText = await response.text();
                        console.error("Failed to get signed URL:", response.status, errorText);
                        toast({ title: "Error", description: `Failed to get document link (${response.status}).`, variant: "destructive" });
                    }
                } catch (fetchError) {
                    console.error("Error fetching signed URL:", fetchError);
                    toast({ title: "Error", description: "Error contacting server for document link.", variant: "destructive" });
                }
            } else {
                console.log("URL doesn't match expected Supabase public path format for signed URL fallback.");
                 toast({ title: "Info", description: "Could not open document directly. Check pop-up blocker.", variant: "default" });
            }
        } else {
             console.log("URL is not a Supabase public URL, not attempting signed URL fallback.");
             toast({ title: "Info", description: "Could not open document directly. Check pop-up blocker.", variant: "default" });
        }
    } else {
        console.log("window.open seemed successful for:", url);
    }
  } catch (error) {
    console.error("Error in openDocumentWithFallback:", error);
    toast({ title: "Error", description: "An error occurred while trying to open the document.", variant: "destructive" });
  }
};

// Helper function to generate pagination items
const getPaginationItems = (currentPage: number, totalPages: number, siblingCount = 1) => {
  const totalPageNumbers = siblingCount + 5; // siblingCount + firstPage + lastPage + currentPage + 2*ellipsis

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', lastPageIndex];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
    return [firstPageIndex, '...', ...rightRange];
  }

  if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  }

  // Should not happen based on the first if condition, but added for completeness
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

// Main page component
export default function JobApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<JobApplicationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [positionFilter, setPositionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wrap fetchStats in useCallback
  const fetchStats = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("No active session - please log in");
      }

      const response = await fetch("/api/admin/job-applications/stats", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      
      const data: JobApplicationStats = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load application statistics");
      toast({
        title: "Error",
        description: "Failed to load application statistics",
        variant: "destructive",
      });
    }
  }, []);

  // Wrap fetchApplications in useCallback
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("No active session - please log in");
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
        position: positionFilter,
      });
      
      const response = await fetch(`/api/admin/job-applications?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data = await response.json();
      setApplications(data.applications);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching applications:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load applications";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, statusFilter, positionFilter]);

  // useEffect for fetching data on initial load and when dependencies change
  useEffect(() => {
    fetchStats();
    fetchApplications();
  }, [fetchStats, fetchApplications]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Optional: Update URL query params if desired
      // const params = new URLSearchParams(searchParams);
      // params.set('page', newPage.toString());
      // router.push(`${pathname}?${params.toString()}`);
    }
  };

  // Handle application status change
  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let resultMessage = "";
      let updatedApp: JobApplication | undefined;

      if (newStatus === ApplicationStatus.APPROVED) {
        console.log(`Attempting to approve application ID: ${id}`);
        const result = await approveJobApplication(id);
        console.log("Server action result:", result);

        resultMessage = result.message || "Application approved successfully.";
        updatedApp = applications.find(app => app.id === id);
        if (updatedApp) {
            updatedApp = { ...updatedApp, status: newStatus };
        }

      } else {
        console.log(`Attempting to update status for ${id} to ${newStatus} via API`);
        
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          throw new Error("No active session - please log in");
        }
        
        const response = await fetch(`/api/admin/job-applications/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ status: newStatus }),
        });
        console.log("API response status:", response.status);

        if (!response.ok) {
          let errorData = { error: `API error ${response.status}` };
          try {
            errorData = await response.json();
          } catch (e) { /* Ignore json parsing error */ }
          console.error("API Error Data:", errorData);
          throw new Error(
            errorData.error || `Failed to update status to ${newStatus}`,
          );
        }
        const responseData = await response.json();
        if (!responseData.success || !responseData.application) {
          throw new Error(
            responseData.error || `Failed to update status to ${newStatus} (API success was false or application missing)`
          );
        }
        updatedApp = responseData.application as JobApplication;
        resultMessage = `Application status updated to ${updatedApp.status}`;
        console.log("API update successful, new status:", updatedApp.status);
      }

      if (updatedApp) {
          const finalUpdatedApp = updatedApp;
          setApplications((prevApps) =>
            prevApps.map((app) =>
              app.id === id ? finalUpdatedApp : app,
            ),
          );
          if (selectedApplication && selectedApplication.id === id) {
              setSelectedApplication(finalUpdatedApp);
          }
      } else {
          setApplications((prevApps) =>
            prevApps.map((app) =>
              app.id === id ? { ...app, status: newStatus } : app,
            ),
          );
          if (selectedApplication && selectedApplication.id === id) {
              setSelectedApplication({ ...selectedApplication, status: newStatus });
          }
      }

      toast({
        title: "Success",
        description: resultMessage,
        variant: "default",
      });

      fetchStats();

      // Close the dialog if the status was changed successfully via the dialog
      if (selectedApplication && selectedApplication.id === id && (newStatus === ApplicationStatus.REJECTED || newStatus === ApplicationStatus.APPROVED)) {
          setIsDetailDialogOpen(false);
      }

    } catch (error: any) {
      console.error("Error updating application status:", error);
      const description = error.message || "An unexpected error occurred. Please try again.";
      setError(description);
      toast({
        title: "Error",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view application details
  const handleViewApplication = (application: JobApplication) => {
    console.log("Viewing application:", application); // Log the entire application object
    setSelectedApplication(application);
    setIsDetailDialogOpen(true);
  };

  // Prepare chart data
  const chartData = stats
    ? [
        { name: "Pending", value: stats.pendingApplications },
        { name: "Approved", value: stats.approvedApplications },
        { name: "Rejected", value: stats.rejectedApplications },
        { name: "Interviewing", value: stats.interviewingApplications },
      ]
    : [];

  // Format date
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const paginationItems = getPaginationItems(page, totalPages);

  if (isLoading && !stats) {
    return <LoadingDashboard />;
  }

  if (!stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Error</h2>
          <p className="mt-2 text-gray-600">Failed to load application statistics</p>
          <Button
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Job Applications</h1>
          <p className="text-gray-500">
            Manage and review candidate applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stats && (
            <div className="rounded-md bg-blue-50 px-3 py-1.5 text-sm text-blue-700 border border-blue-100">
              <span className="font-semibold mr-1.5">{stats.totalApplications}</span>
              Total Applications
            </div>
          )}
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            variant="default" 
            className="flex items-center gap-2"
            onClick={() => {
              fetchStats();
              fetchApplications();
            }}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-white p-4 rounded-md border border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700">Total Applications</h3>
                <div className="rounded-full p-2 bg-blue-100">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{stats?.totalApplications ?? 0}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700">Pending Review</h3>
                <div className="rounded-full p-2 bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{stats?.pendingApplications ?? 0}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-l-4 border-l-green-600">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700">Approved</h3>
                <div className="rounded-full p-2 bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{stats?.approvedApplications ?? 0}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-l-4 border-l-red-600">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700">Rejected</h3>
                <div className="rounded-full p-2 bg-red-100">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{stats?.rejectedApplications ?? 0}</p>
            </div>
          </div>
        </>
      )}

      <Tabs defaultValue="applications" className="w-full mt-6">
        <div className="border-b mb-6">
          <TabsList className="w-auto bg-transparent border-b-0 p-0 mb-0 flex">
            <TabsTrigger 
              value="applications" 
              className="text-sm py-2 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-sm py-2 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
            >
              <BarChart4 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="applications" className="mt-6">
          <Card className="overflow-hidden shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex flex-1 space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search applications..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="p-2">
                        <Select
                          value={statusFilter}
                          onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value={ApplicationStatus.PENDING}>
                              Pending
                            </SelectItem>
                            <SelectItem value={ApplicationStatus.APPROVED}>
                              Approved
                            </SelectItem>
                            <SelectItem value={ApplicationStatus.REJECTED}>
                              Rejected
                            </SelectItem>
                            <SelectItem value={ApplicationStatus.INTERVIEWING}>
                              Interviewing
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-2">
                        <Select
                          value={positionFilter === "all" ? "all" : positionFilter}
                          onValueChange={(value) => setPositionFilter(value === "all" ? "" : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Positions</SelectItem>
                            <SelectItem value="Driver for Catering Deliveries">
                              Driver
                            </SelectItem>
                            <SelectItem value="Virtual Assistant">
                              Virtual Assistant
                            </SelectItem>
                            <SelectItem value="Other Positions">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Date Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center"
                        >
                          No applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.firstName} {application.lastName}
                            <div className="text-sm text-gray-500">
                              {application.email}
                            </div>
                          </TableCell>
                          <TableCell>{application.position}</TableCell>
                          <TableCell>
                            {formatDate(application.createdAt)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={application.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewApplication(application)}
                              >
                                View
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        application.id,
                                        ApplicationStatus.APPROVED
                                      )
                                    }
                                    disabled={isSubmitting || application.status === ApplicationStatus.APPROVED}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        application.id,
                                        ApplicationStatus.REJECTED
                                      )
                                    }
                                    disabled={isSubmitting || application.status === ApplicationStatus.REJECTED}
                                  >
                                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        application.id,
                                        ApplicationStatus.INTERVIEWING
                                      )
                                    }
                                    disabled={isSubmitting || application.status === ApplicationStatus.INTERVIEWING}
                                  >
                                    <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                                    Schedule Interview
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page - 1);
                          }}
                          className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                          aria-disabled={page <= 1}
                        />
                      </PaginationItem>
                      {paginationItems.map((item, index) => (
                        <PaginationItem key={index}>
                          {item === '...' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(item as number);
                              }}
                              isActive={page === item}
                              aria-current={page === item ? "page" : undefined}
                            >
                              {item}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page + 1);
                          }}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                          aria-disabled={page >= totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="mb-5 flex items-center">
                <Briefcase className="h-6 w-6 text-indigo-600 mr-2" />
                <h3 className="text-xl font-medium">Applications by Position</h3>
              </div>
              <div className="space-y-6">
                {stats?.applicationsByPosition &&
                  Object.entries(stats.applicationsByPosition).map(
                    ([position, count]) => (
                      <div key={position}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="h-6 w-6 text-gray-500 mr-2">
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <span className="text-lg">{position}</span>
                          </div>
                          <span className="text-xl font-bold">{count}</span>
                        </div>
                        <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{
                              width: `${Math.min(
                                (count / (stats?.totalApplications ?? 1)) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center">
                <PieChartIcon className="h-6 w-6 text-indigo-600 mr-2" />
                <h3 className="text-xl font-medium">Applications by Status</h3>
              </div>
              <div className="flex flex-col items-center justify-center" style={{ height: 300 }}>
                {chartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} Applications`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
                      {chartData.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center">
                          <div
                            className="w-4 h-4 mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Application Detail Dialog */}
      <ApplicationDetailDialog
        application={selectedApplication}
        open={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onStatusChange={handleStatusChange}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}