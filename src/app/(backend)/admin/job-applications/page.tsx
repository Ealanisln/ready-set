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
  JobApplication,
  ApplicationStatus,
  JobApplicationStats,
} from "@/types/job-application";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { approveJobApplication } from '@/app/actions/admin/job-applications';


const COLORS = ["#4f46e5", "#10b981", "#ef4444", "#f59e0b"];

// Status badge component
const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const statusConfig = {
    [ApplicationStatus.PENDING]: {
      label: "Pending",
      variant: "default",
      className: "bg-yellow-500 hover:bg-yellow-600",
    },
    [ApplicationStatus.APPROVED]: {
      label: "Approved",
      variant: "default",
      className: "bg-green-500 hover:bg-green-600",
    },
    [ApplicationStatus.REJECTED]: {
      label: "Rejected",
      variant: "default",
      className: "bg-red-500 hover:bg-red-600",
    },
    [ApplicationStatus.INTERVIEWING]: {
      label: "Interviewing",
      variant: "default",
      className: "bg-blue-500 hover:bg-blue-600",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

// Metric card component
const MetricCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card>
    <CardContent className="flex flex-row items-center p-6">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}
      >
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

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
            {application.resumeUrl && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  console.log("Resume URL (original):", application.resumeUrl);
                  const url = getDocumentUrl(application.resumeUrl);
                  openDocumentWithFallback(url);
                }}
                aria-label="View Resume"
              >
                <FileText className="h-4 w-4" />
                Resume
              </Button>
            )}
            {application.driversLicenseUrl && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  const url = getDocumentUrl(application.driversLicenseUrl);
                  openDocumentWithFallback(url);
                }}
                aria-label="View Driver's License"
              >
                <FileText className="h-4 w-4" />
                Driver's License
              </Button>
            )}
            {application.insuranceUrl && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  const url = getDocumentUrl(application.insuranceUrl);
                  openDocumentWithFallback(url);
                }}
                aria-label="View Insurance"
              >
                <FileText className="h-4 w-4" />
                Insurance
              </Button>
            )}
            {application.vehicleRegUrl && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  const url = getDocumentUrl(application.vehicleRegUrl);
                  openDocumentWithFallback(url);
                }}
                aria-label="View Vehicle Registration"
              >
                <FileText className="h-4 w-4" />
                Vehicle Registration
              </Button>
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
  console.log("Document URL (resolved):", url);
  
  try {
    // First try to open the file directly
    let win = window.open(url, "_blank");
    
    // If the URL is a Supabase URL and we can extract the path,
    // also try to get a signed URL as a fallback
    if (url.includes('/storage/v1/object/public/') && !win) {
      console.log("Direct URL might have failed, trying signed URL...");
      const matches = url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
      
      if (matches && matches.length === 3) {
        const path = matches[2];
        console.log("Trying to get signed URL for path:", path);
        
        // Call our API to get a signed URL
        const response = await fetch(`/api/file-uploads?path=${encodeURIComponent(path)}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Got signed URL:", data.url);
          window.open(data.url, "_blank");
        } else {
          console.error("Failed to get signed URL:", await response.text());
        }
      }
    }
  } catch (error) {
    console.error("Error opening file:", error);
  }
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
      const response = await fetch("/api/admin/job-applications/stats");
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
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
        position: positionFilter,
      });
      const response = await fetch(`/api/admin/job-applications?${params.toString()}`);
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
        const response = await fetch(`/api/admin/job-applications/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
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
        updatedApp = (await response.json()) as JobApplication;
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
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={<ClipboardList className="h-6 w-6 text-white" />}
            color="bg-blue-600"
          />
          <MetricCard
            title="Pending Review"
            value={stats.pendingApplications}
            icon={<Clock className="h-6 w-6 text-white" />}
            color="bg-yellow-500"
          />
          <MetricCard
            title="Approved"
            value={stats.approvedApplications}
            icon={<CheckCircle className="h-6 w-6 text-white" />}
            color="bg-green-600"
          />
          <MetricCard
            title="Rejected"
            value={stats.rejectedApplications}
            icon={<XCircle className="h-6 w-6 text-white" />}
            color="bg-red-600"
          />
        </div>
      )}

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-6">
          <Card>
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
                          value={positionFilter}
                          onValueChange={setPositionFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Positions</SelectItem>
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
                <div className="mt-4 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">
                  Application Status Distribution
                </h3>
                <div className="h-64">
                  {stats && (
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
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} applications`, ""]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">
                  Applications by Position
                </h3>
                <div className="space-y-4">
                  {stats?.applicationsByPosition &&
                    Object.entries(stats.applicationsByPosition).map(
                      ([position, count]) => (
                        <div key={position}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                              <span>{position}</span>
                            </div>
                            <span className="font-medium">{count}</span>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-blue-600"
                              style={{
                                width: `${Math.min(
                                  (count / stats.totalApplications) * 100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </CardContent>
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