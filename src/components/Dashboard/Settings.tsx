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
import toast from "react-hot-toast";

interface UserData {
  accountName: string;
  email: string;
  type?: 'admin' | 'driver' | 'vendor' | 'client'; // Add this line
}


export function SettingsUser() {
  const [userData, setUserData] = useState<UserData>({
    accountName: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
  
        setUserData({
          accountName: data.name || data.contact_name || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
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
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountName: userData.accountName,
          email: userData.email,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to update user");
      }
  
      const updatedUser = await response.json();
      console.log("Updated user:", updatedUser);
      toast.success("User saved successfully!");
      setUserData(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      toast.error("Failed to save user. Please try again.");
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="bg-muted/40 flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="text-muted-foreground grid gap-4 text-sm"
            x-chunk="dashboard-04-chunk-0"
          >
            <Link href="#" className="font-semibold text-primary">
              General
            </Link>
            <Link href="#">Security</Link>
            <Link href="#">Integrations</Link>
            <Link href="#">Support</Link>
            <Link href="#">Organizations</Link>
            <Link href="#">Advanced</Link>
          </nav>
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>This is your account name</CardDescription>
              </CardHeader>
              <CardContent>
              <Input 
                placeholder="Account Name" 
                name="accountName"
                value={userData.accountName}
                onChange={handleInputChange}
              />
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSave}>Save</Button>
            </CardFooter>
            </Card>
            <Card x-chunk="dashboard-04-chunk-2">
              <CardHeader>
                <CardTitle>E-mail</CardTitle>
                <CardDescription>This is your admin e-mail.</CardDescription>
              </CardHeader>
              <CardContent>
              <form className="flex flex-col gap-4">
                <Input
                  placeholder="Email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSave}>Save</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
