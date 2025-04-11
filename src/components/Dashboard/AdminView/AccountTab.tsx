"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";

interface AccountTabProps {
  userId: string;
}

interface AccountFormData {
  name: string;
  email: string;
  contactNumber: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
}

export const AccountTab: React.FC<AccountTabProps> = ({ userId }) => {
  const [formData, setFormData] = useState<AccountFormData>({
    name: "",
    email: "",
    contactNumber: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
  });

  const [originalData, setOriginalData] = useState<AccountFormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const fetchUserData = useCallback(async () => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        const userData: AccountFormData = {
          name: data.name || "",
          email: data.email || "",
          contactNumber: data.contact_number || "",
          street1: data.street1 || "",
          street2: data.street2 || "",
          city: data.city || "",
          state: data.state || "",
          zip: data.zip || "",
        };
        setFormData(userData);
        setOriginalData(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    // Check if the form data has changed from the original data
    if (originalData) {
      const changed = Object.keys(formData).some(
        (key) => formData[key as keyof AccountFormData] !== originalData[key as keyof AccountFormData]
      );
      setHasChanges(changed);
    }
  }, [formData, originalData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const supabase = await createClient();
      
      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          contactNumber: formData.contactNumber,
          street1: formData.street1,
          street2: formData.street2,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      toast.success("Account details saved successfully");
      setOriginalData(formData);
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("Failed to save account data");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Manage your personal account details
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled
              placeholder="Your email"
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed. Contact support for assistance.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="Phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="street1">Address Line 1</Label>
          <Input
            id="street1"
            name="street1"
            value={formData.street1}
            onChange={handleInputChange}
            placeholder="Street address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="street2">Address Line 2</Label>
          <Input
            id="street2"
            name="street2"
            value={formData.street2}
            onChange={handleInputChange}
            placeholder="Apt, suite, etc. (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              placeholder="ZIP code"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
        <Button
          variant="outline"
          onClick={fetchUserData}
          disabled={isLoading || isSaving}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}; 