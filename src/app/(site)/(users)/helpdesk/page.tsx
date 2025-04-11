"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  BarChart4, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  MessageSquare, 
  Truck, 
  Filter, 
  PlusCircle, 
  ChevronRight,
  Phone,
  FileText,
  HelpCircle,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import Breadcrumb from '@/components/Common/Breadcrumb';

// Types based on your schema
interface SupportRequest {
  id: string;
  orderNumber: string;
  type: 'catering' | 'on_demand';
  status: string;
  clientName: string;
  requestDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface ClientOverview {
  id: string;
  name: string;
  email: string;
  type: string;
  activeOrders: number;
  status: string;
}

const HelpDeskPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [clients, setClients] = useState<ClientOverview[]>([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    averageResponseTime: '0h',
    clientSatisfaction: 0
  });

  // Simulate data loading
  useEffect(() => {
    // This would be replaced with actual API calls
    setTimeout(() => {
      setSupportRequests([
        {
          id: '1',
          orderNumber: 'CR-2023012',
          type: 'catering',
          status: 'open',
          clientName: 'Acme Corp',
          requestDate: '2023-04-12T10:30:00Z',
          priority: 'high'
        },
        {
          id: '2',
          orderNumber: 'OD-2023045',
          type: 'on_demand',
          status: 'in_progress',
          clientName: 'Global Tech',
          requestDate: '2023-04-11T14:20:00Z',
          priority: 'medium'
        },
        {
          id: '3',
          orderNumber: 'CR-2023011',
          type: 'catering',
          status: 'resolved',
          clientName: 'City Foods',
          requestDate: '2023-04-10T09:15:00Z',
          priority: 'low'
        },
        {
          id: '4',
          orderNumber: 'OD-2023044',
          type: 'on_demand',
          status: 'open',
          clientName: 'First Bank',
          requestDate: '2023-04-09T16:45:00Z',
          priority: 'high'
        },
        {
          id: '5',
          orderNumber: 'CR-2023010',
          type: 'catering',
          status: 'waiting_info',
          clientName: 'Modern Office',
          requestDate: '2023-04-08T11:30:00Z',
          priority: 'medium'
        }
      ]);

      setClients([
        {
          id: '1',
          name: 'Acme Corp',
          email: 'support@acmecorp.com',
          type: 'client',
          activeOrders: 3,
          status: 'active'
        },
        {
          id: '2',
          name: 'Global Tech',
          email: 'help@globaltech.com',
          type: 'client',
          activeOrders: 1,
          status: 'active'
        },
        {
          id: '3',
          name: 'City Foods',
          email: 'orders@cityfoods.com',
          type: 'client',
          activeOrders: 2,
          status: 'pending'
        },
        {
          id: '4',
          name: 'First Bank',
          email: 'catering@firstbank.com',
          type: 'client',
          activeOrders: 4,
          status: 'active'
        }
      ]);

      setStats({
        totalTickets: 28,
        openTickets: 12,
        averageResponseTime: '1.5h',
        clientSatisfaction: 92
      });

      setIsLoading(false);
    }, 1000);
  }, []);

  // Helper function to render status badges with appropriate colors
  const renderStatusBadge = (status: string) => {
    const statusStyles = {
      open: 'bg-red-100 text-red-800 border-red-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      waiting_info: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  // Helper function to render priority badges
  const renderPriorityBadge = (priority: string) => {
    const priorityStyles = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };

    return (
      <Badge className={priorityStyles[priority as keyof typeof priorityStyles]}>
        {priority}
      </Badge>
    );
  };

  // Helper function to render date in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
    <Breadcrumb pageName="Helpdesk Dashboard" />
    <div className="flex min-h-screen flex-col bg-slate-50 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Helpdesk Dashboard</h1>
        <p className="text-muted-foreground">Manage support requests and client inquiries</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats.totalTickets}</div>
                )}
                <p className="text-xs text-muted-foreground">+5 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats.openTickets}</div>
                )}
                <p className="text-xs text-muted-foreground">-2 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats.averageResponseTime}</div>
                )}
                <p className="text-xs text-muted-foreground">-30m from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.clientSatisfaction}%</div>
                    <Progress value={stats.clientSatisfaction} className="mt-2" />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Support Requests */}
          <Card className="col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Support Requests</CardTitle>
                  <CardDescription>Manage outstanding support tickets</CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href="/helpdesk/tickets">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.orderNumber}</TableCell>
                        <TableCell>
                          {request.type === 'catering' ? (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <ShoppingBag className="h-3 w-3" /> Catering
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Truck className="h-3 w-3" /> On-Demand
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{request.clientName}</TableCell>
                        <TableCell>{renderStatusBadge(request.status)}</TableCell>
                        <TableCell>{renderPriorityBadge(request.priority)}</TableCell>
                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/helpdesk/tickets/${request.id}`}>
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions and Client Overview */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Commonly used helpdesk functions</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Support Ticket
                </Button>
                <Button variant="outline" className="justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Client
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Follow-up
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Overview</CardTitle>
                <CardDescription>Recent client activity</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-[220px]">
                    <div className="space-y-4">
                      {clients.map((client) => (
                        <div key={client.id} className="flex items-center justify-between">
                          <div className="flex flex-col space-y-1">
                            <span className="font-medium">{client.name}</span>
                            <span className="text-sm text-muted-foreground">{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {client.activeOrders} active
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>View Orders</DropdownMenuItem>
                                <DropdownMenuItem>Contact</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs would be implemented with similar patterns */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Manage and track all client support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Input placeholder="Search tickets..." className="max-w-sm" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Status</DropdownMenuItem>
                    <DropdownMenuItem>Priority</DropdownMenuItem>
                    <DropdownMenuItem>Date</DropdownMenuItem>
                    <DropdownMenuItem>Client</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Ticket
                </Button>
              </div>
              <p className="text-muted-foreground text-center py-10">Detailed ticket view will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>View and manage client details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">Client management interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Track and manage catering and on-demand orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">Order management interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
};

export default HelpDeskPage;