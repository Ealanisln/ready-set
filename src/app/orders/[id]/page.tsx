"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { OrderStatusUpdater } from "@/components/Driver/OrderStatusUpdater";
import { DriverStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";

interface OrderDetailProps {
  params: Promise<{
    id: string;
  }>;
}

interface Order {
  id: string;
  status: string;
  driverStatus?: DriverStatus | null;
  pickupDateTime?: string | Date | null;
  arrivalDateTime?: string | Date | null;
  completeDateTime?: string | Date | null;
  updatedAt: string | Date;
  orderNumber?: string | null;
}

interface Driver {
  id: string;
  name?: string | null;
  email?: string | null;
  contactNumber?: string | null;
}

export default function OrderDetailPage({ params }: OrderDetailProps) {
  const unwrappedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setIsLoading(true);
        // Fetch order details
        const response = await fetch(`/api/orders/${unwrappedParams.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error(`Failed to fetch order: ${response.statusText}`);
        }
        
        const data = await response.json();
        setOrder(data.order);
        
        // If there's a driver assigned, set driver info
        if (data.order.driver) {
          setDriver(data.order.driver);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching order:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchOrderDetails();
  }, [unwrappedParams.id]);

  const handleStatusUpdate = (updatedData: any) => {
    // Update the local state with the new order data
    if (updatedData.order) {
      setOrder(prev => prev ? { ...prev, driverStatus: updatedData.order.status } : null);
    }
  };

  const testStatusUpdateApi = async () => {
    if (!order) return;
    
    try {
      setApiTestResult("Testing API...");
      
      // Get token from localStorage (requires user to be logged in)
      const token = localStorage.getItem("supabase.auth.token");
      
      if (!token) {
        setApiTestResult("Error: No authentication token found. Please log in first.");
        return;
      }
      
      const response = await fetch("/api/driver/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: order.id,
          status: "ARRIVED_AT_VENDOR", // Test status update
          orderType: "catering"
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setApiTestResult(`API Error: ${data.error || response.statusText}`);
      } else {
        setApiTestResult(`Success! Order status updated to: ${data.order.status}`);
        // Update local state to reflect change
        setOrder(prev => prev ? { ...prev, driverStatus: data.order.status } : null);
      }
    } catch (err) {
      setApiTestResult(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      console.error("Test API error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
        <p className="text-muted-foreground mt-2">
          View and manage details for order #{order.orderNumber}
        </p>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="status">Delivery Status</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="test">API Test</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          {/* Order details content */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Order ID</h3>
                  <p className="text-sm">{order.id}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Order Number</h3>
                  <p className="text-sm">{order.orderNumber || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Status</h3>
                  <p className="text-sm">{order.status}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Driver Status</h3>
                  <p className="text-sm">{order.driverStatus || "Not assigned"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          {/* Use our reusable driver status component */}
          <OrderStatusUpdater
            order={order}
            orderType="catering"
            driverInfo={driver}
            onStatusUpdate={handleStatusUpdate}
            isEditable={true}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium">Order Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Separator />
                {/* Additional history entries would go here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test API Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Test the status update API with the following curl command:
                </p>
                <pre className="bg-slate-100 p-4 rounded-md overflow-x-auto text-xs">
                  {`curl -X POST \\
  http://localhost:3000/api/driver/update-status \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -d '{
    "orderId": "${order?.id}",
    "status": "ARRIVED_AT_VENDOR",
    "orderType": "catering"
  }'`}
                </pre>
                
                <Button 
                  onClick={testStatusUpdateApi}
                  variant="outline" 
                  className="mt-4"
                >
                  Test API in Browser
                </Button>
                
                {apiTestResult && (
                  <div className={`mt-4 p-4 rounded-md ${apiTestResult.includes("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
                    {apiTestResult}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 