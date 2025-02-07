"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Package2, AlertCircle, UserPlus, ArrowUpDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobApplication {
  id: string;
  name: string;
  email: string;
  positionType: 'helpdesk' | 'driver';
  status: 'pending' | 'approved' | 'rejected' | 'account_created';
  applicationDate: string;
}

type ApplicationStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'account_created';

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  approved: "bg-green-100 text-green-800 hover:bg-green-200",
  rejected: "bg-red-100 text-red-800 hover:bg-red-200",
  account_created: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

const positionStyles = {
  helpdesk: "bg-purple-100 text-purple-800",
  driver: "bg-orange-100 text-orange-800",
};

const getStatusStyle = (status: string) => {
  return statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800";
};

const getPositionStyle = (position: string) => {
  return positionStyles[position as keyof typeof positionStyles] || "bg-gray-100 text-gray-800";
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    <div className="h-10 bg-gray-100 rounded animate-pulse" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-50 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
    ))}
  </div>
);

const JobApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>("all");
  const [totalPages, setTotalPages] = useState(1);
  const [nameSort, setNameSort] = useState<'asc' | 'desc'>('asc');
  const [emailFilter, setEmailFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState<'all' | 'helpdesk' | 'driver'>('all');

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `/api/applications?page=${page}&limit=${limit}${
          statusFilter !== "all" ? `&status=${statusFilter}` : ""
        }${emailFilter ? `&email=${emailFilter}` : ""}${
          positionFilter !== "all" ? `&position=${positionFilter}` : ""
        }`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error("Failed to fetch job applications");
        }
        
        const data = await response.json();
        const applicationsData = Array.isArray(data) ? data : data.applications || [];
        
        // Client-side sorting
        const sortedData = [...applicationsData].sort((a, b) => {
          return nameSort === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        });

        setApplications(sortedData);
        
        const totalCount = Array.isArray(data) 
          ? data.length 
          : data.totalCount || applicationsData.length;
        setTotalPages(Math.ceil(totalCount / limit));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [page, limit, statusFilter, nameSort, emailFilter, positionFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusFilter = (status: ApplicationStatus) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleEmailFilter = (value: string) => {
    setEmailFilter(value);
    setPage(1);
  };

  const handlePositionFilter = (value: string) => {
    setPositionFilter(value as 'all' | 'helpdesk' | 'driver');
    setPage(1);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-muted-foreground">
            Manage and review all job applications for helpdesk and driver positions.
          </p>
        </div>
        <Link 
          href="/create-account" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create Account
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Tabs 
            defaultValue="all" 
            className="space-y-4"
            onValueChange={(value) => handleStatusFilter(value as ApplicationStatus)}
          >
            <TabsList className="grid grid-cols-5 gap-2 bg-muted/50 p-1 w-full">
              <TabsTrigger value="all" className="data-[state=active]:bg-white truncate">
                All
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900">
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="account_created" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 truncate">
                Account Created
              </TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="space-y-4">
              {isLoading ? (
                <LoadingSkeleton />
              ) : error ? (
                <Alert variant="destructive">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                  </div>
                  <AlertDescription className="mt-2">
                    {error}
                    <Button 
                      variant="outline" 
                      className="ml-4 mt-2"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : applications.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[20%] min-w-[150px]">
                          <div className="flex items-center gap-1">
                            Name 
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-1"
                              onClick={() => setNameSort(nameSort === 'asc' ? 'desc' : 'asc')}
                            >
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead className="w-[25%]">
                          <div className="flex items-center gap-2">
                            <span>Email</span>
                            <Input 
                              placeholder="Filter..." 
                              className="h-8 max-w-[200px]"
                              value={emailFilter}
                              onChange={(e) => handleEmailFilter(e.target.value)}
                            />
                          </div>
                        </TableHead>
                        <TableHead className="w-[15%]">
                          <Select onValueChange={handlePositionFilter} value={positionFilter}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Position Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Positions</SelectItem>
                              <SelectItem value="helpdesk">Helpdesk</SelectItem>
                              <SelectItem value="driver">Driver</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableHead>
                        <TableHead className="w-[15%]">Status</TableHead>
                        <TableHead className="w-[20%] text-right">Applied Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Link
                              href={`/admin/applications/${application.id}`}
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline truncate block"
                            >
                              {application.name}
                            </Link>
                          </TableCell>
                          <TableCell className="truncate">{application.email}</TableCell>
                          <TableCell>
                            <Badge className={getPositionStyle(application.positionType)}>
                              {application.positionType.charAt(0).toUpperCase() + application.positionType.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusStyle(application.status)}>
                              {application.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {new Date(application.applicationDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No applications found</h3>
                  <p className="text-muted-foreground">
                    No {statusFilter !== 'all' ? statusFilter.replace('_', ' ') : ''} applications are currently available.
                  </p>
                </div>
              )}

              {!isLoading && applications.length > 0 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(page - 1)} 
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink 
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={page === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(page + 1)} 
                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicationsPage;