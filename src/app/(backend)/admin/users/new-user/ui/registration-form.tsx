"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type UserType = "driver" | "helpdesk";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  userType: UserType | "";
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
  password?: string;
  generateTemporaryPassword: boolean;
}

const DriverHelpdeskRegistrationForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    userType: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
    password: "",
    generateTemporaryPassword: true,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: UserType) => {
    setFormData((prev) => ({ ...prev, userType: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ 
      ...prev, 
      generateTemporaryPassword: checked,
      // Clear password field if using generated password
      password: checked ? "" : prev.password 
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    
    try {
      // Validate password if not using temporary password
      if (!formData.generateTemporaryPassword && (!formData.password || formData.password.length < 6)) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      const response = await fetch("/api/register/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error("You must be logged in to perform this action");
          return;
        }
        if (response.status === 403) {
          toast.error("You do not have permission to perform this action");
          return;
        }
        throw new Error(
          errorData.error || "An error occurred during registration"
        );
      }

      toast.success(
        "Successfully registered. Check email for login instructions."
      );
      router.push("/admin/users");
    } catch (err) {
      console.error("Registration error:", err);
      setGeneralError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New User Account</CardTitle>
        <CardDescription>
          Register a new driver or helpdesk staff member
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {generalError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* User Information Section */}
          <div className="space-y-4 p-4 border rounded-md bg-slate-50/50">
            <h4 className="text-md font-semibold mb-3">User Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <Select onValueChange={handleSelectChange} required>
                  <SelectTrigger id="userType">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="helpdesk">Helpdesk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Password Section */}
          <div className="space-y-4 p-4 border rounded-md bg-slate-50/50">
            <h4 className="text-md font-semibold mb-3">Password Settings</h4>
            
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="generatePassword" 
                checked={formData.generateTemporaryPassword}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="generatePassword" className="cursor-pointer">
                Generate a temporary password (user will be prompted to change it)
              </Label>
            </div>
            
            {!formData.generateTemporaryPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required={!formData.generateTemporaryPassword}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long.
                </p>
              </div>
            )}
          </div>
          
          {/* Address Section */}
          <div className="space-y-4 p-4 border rounded-md bg-slate-50/50">
            <h4 className="text-md font-semibold mb-3">Address Information</h4>
            
            <div className="space-y-2">
              <Label htmlFor="street1">Street Address</Label>
              <Input
                id="street1"
                name="street1"
                value={formData.street1}
                onChange={handleChange}
                placeholder="123 Main St"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="street2">Apartment, Suite, etc. (Optional)</Label>
              <Input
                id="street2"
                name="street2"
                value={formData.street2}
                onChange={handleChange}
                placeholder="Apt 4B"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="10001"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Additional Information Section */}
          <div className="space-y-4 p-4 border rounded-md bg-slate-50/50">
            <h4 className="text-md font-semibold mb-3">Additional Information</h4>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes or special instructions"
                rows={3}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DriverHelpdeskRegistrationForm;
