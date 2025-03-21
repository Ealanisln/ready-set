// src/components/Dashboard/AdminView/Settings.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { PasswordChange } from "./PasswordChange";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  type: string;
  contact_number: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
}

export function SettingsUser() {
  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "",
    email: "",
    type: "",
    contact_number: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Assuming the user ID is 1, adjust if needed
        const response = await fetch("/api/user/1");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setUserData({
          id: data.id,
          name: data.name || "",
          email: data.email || "",
          type: data.type || "",
          contact_number: data.contact_number || "",
          street1: data.street1 || "",
          street2: data.street2 || "",
          city: data.city || "",
          state: data.state || "",
          zip: data.zip || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/user/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      const updatedUser = await response.json();
      toast.success("User saved successfully!");
      setUserData(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save user. Please try again.",
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="bg-muted/40 flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="text-muted-foreground grid gap-4 text-sm">
            <Link href="#" className="font-semibold text-primary">
              General
            </Link>
            <Link href="#security">Security</Link>
            {/* <Link href="#">Integrations</Link>
            <Link href="#">Support</Link>
            <Link href="#">Organizations</Link>
            <Link href="#">Advanced</Link> */}
          </nav>
          <div className="grid gap-6">
            <Card id="general">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact_number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contact Number
                    </label>
                    <Input
                      id="contact_number"
                      name="contact_number"
                      value={userData.contact_number}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="street1"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street 1
                    </label>
                    <Input
                      id="street1"
                      name="street1"
                      value={userData.street1}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="street2"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street 2
                    </label>
                    <Input
                      id="street2"
                      name="street2"
                      value={userData.street2}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={userData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State
                    </label>
                    <Input
                      id="state"
                      name="state"
                      value={userData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zip"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP Code
                    </label>
                    <Input
                      id="zip"
                      name="zip"
                      value={userData.zip}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
