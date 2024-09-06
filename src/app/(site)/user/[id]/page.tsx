// src/app/(site)/user/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import PageHeader from "@/components/Header/PageHeader";
import ProfileCard from "@/components/Dashboard/ProfileCard";
import AddressCard from "@/components/Dashboard/AddressCard";
import VendorClientDetailsCard from "@/components/Dashboard/VendorClientDetailsCard";
import UserStatusCard from "@/components/Dashboard/UserStatusCard";
import toast from "react-hot-toast";
import { UnsavedChangesAlert } from "@/components/Dashboard/UnsavedChangesAlert";

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  email: string;
  contact_number: string;
  type: "driver" | "vendor" | "client" | "helpdesk";
  company_name?: string;
  website?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  parking_loading?: string;
  countiesServed?: string[];
  timeNeeded?: string[];
  cateringBrokerage?: string[];
  frequency?: string;
  provisions?: string[];
  head_count?: string;
  status?: "active" | "pending" | "deleted";
}

interface UserFormValues extends User {
  displayName: string;
  head_count?: string;
}

export default function EditUser({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    defaultValues: {
      countiesServed: [],
      timeNeeded: [],
      cateringBrokerage: [],
      frequency: "",
      provisions: [],
      displayName: "",
      head_count: "",
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Unauthorized. Please login as an admin.");
            return;
          }
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();

        // Set form values
        setValue(
          "displayName",
          data.displayName || data.contact_name || data.name || "",
        );
        setValue("company_name", data.company_name || "");
        setValue("contact_number", data.contact_number || "");
        setValue("email", data.email || "");
        setValue("website", data.website || "");
        setValue("street1", data.street1 || "");
        setValue("street2", data.street2 || "");
        setValue("city", data.city || "");
        setValue("state", data.state || "");
        setValue("zip", data.zip || "");
        setValue("parking_loading", data.parking_loading || "");
        setValue("type", data.type || "");
        setValue("status", data.status || "pending");

        // Only set timeNeeded and countiesServed if the user is a vendor or client
        if (data.type === "vendor" || data.type === "client") {
          setValue("timeNeeded", data.timeNeeded || []);
          setValue("countiesServed", data.countiesServed || []);
        }

        // Vendor specific fields
        if (data.type === "vendor") {
          setValue("cateringBrokerage", data.cateringBrokerage || []);
          setValue("frequency", data.frequency || "");
          setValue("provisions", data.provide ? data.provide.split(", ") : []);
        }

        if (data.type === "client") {
          setValue("head_count", data.head_count || "");
          setValue("frequency", data.frequency || "");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id, setValue]);

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    try {
      const submitData: User = { ...data };

      delete (submitData as any).displayName;

      if (data.type === "driver" || data.type === "helpdesk") {
        submitData.name = data.displayName;
        delete submitData.contact_name;
        delete submitData.company_name;
      } else if (data.type === "vendor" || data.type === "client") {
        submitData.contact_name = data.displayName;
        delete submitData.name;
      }

      if (data.type === "client") {
        submitData.head_count = data.head_count;
      }

      const response = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      const updatedUser = await response.json();
      console.log("Updated user:", updatedUser);

      toast.success("User saved successfully!");
      reset(updatedUser);

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to save user. Please try again.");
    }
  };

  const currentPageTitle = loading
    ? "Loading..."
    : `Editing ${watchedValues.displayName || "User"}`;

  const handleBack = () => {
    reset(); // Reset the form
    setHasUnsavedChanges(false);
    toast("Changes discarded", { icon: "🔄" });
    router.push("/admin/users");
  };

  const handleDiscard = () => {
    reset(); // Reset the form
    setHasUnsavedChanges(false);
    toast("Changes discarded", { icon: "🔄" });
    router.push("/admin/users");
  };

  async function updateUserStatus(
    userId: string,
    newStatus: "active" | "pending" | "deleted",
  ): Promise<void> {
    const response = await fetch("/api/users/updateUserStatus", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, newStatus }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Response status:", response.status);
      console.error("Response text:", text);
      throw new Error(
        `Failed to update user status: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  }

  const handleStatusChange = async (
    newStatus: "active" | "pending" | "deleted",
  ) => {
    try {
      await updateUserStatus(params.id, newStatus);
      // Update local state
      setValue("status", newStatus);
      toast.success("User status updated successfully!");
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col pt-24">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                {hasUnsavedChanges ? (
                  <UnsavedChangesAlert
                    onConfirm={handleBack}
                    triggerButton={
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                      </Button>
                    }
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleBack}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Button>
                )}
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Type of account
                </h1>
                <Badge variant="outline" className="ml-auto sm:ml-0">
                  {watchedValues.type}
                </Badge>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  {hasUnsavedChanges ? (
                    <UnsavedChangesAlert
                      onConfirm={handleDiscard}
                      triggerButton={
                        <Button variant="outline" size="sm">
                          Discard
                        </Button>
                      }
                    />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDiscard}
                      type="button"
                    >
                      Discard
                    </Button>
                  )}
                  <Button size="sm">Save User</Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <ProfileCard control={control} errors={errors} />
                  <AddressCard control={control} errors={errors} />
                  {(watchedValues.type === "vendor" ||
                    watchedValues.type === "client") && (
                    <VendorClientDetailsCard
                      control={control}
                      errors={errors}
                      userType={watchedValues.type}
                      watchedValues={watchedValues}
                    />
                  )}
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <UserStatusCard
                    user={{ ...watchedValues, id: params.id }}
                    onStatusChange={handleStatusChange}
                  />
                  <Card
                    className="overflow-hidden"
                    x-chunk="dashboard-07-chunk-4"
                  >
                    <CardHeader>
                      <CardTitle>User Images</CardTitle>
                      <CardDescription>
                        Lipsum dolor sit amet, consectetur adipiscing elit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <Image
                          alt="User image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="300"
                          src="/images/placeholder.svg"
                          width="300"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <button>
                            <Image
                              alt="User image"
                              className="aspect-square w-full rounded-md object-cover"
                              height="84"
                              src="/images/placeholder.svg"
                              width="84"
                            />
                          </button>
                          <button>
                            <Image
                              alt="User image"
                              className="aspect-square w-full rounded-md object-cover"
                              height="84"
                              src="/images/placeholder.svg"
                              width="84"
                            />
                          </button>
                          <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                            <Upload className="text-muted-foreground h-4 w-4" />
                            <span className="sr-only">Upload</span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:hidden">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm" type="submit">
                  Save User
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
