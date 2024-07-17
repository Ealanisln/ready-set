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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, SubmitHandler } from "react-hook-form";
import PageHeader from "@/components/Header/PageHeader";
import ProfileCard from "@/components/Dashboard/ProfileCard";
import AddressCard from "@/components/Dashboard/AddressCard";
import VendorClientDetailsCard from "@/components/Dashboard/VendorClientDetailsCard";
import { useToast } from "@/components/ui/use-toast";


interface User {
  id: string;
  name?: string;
  contact_name?: string;
  email: string;
  contact_number: string;
  type: "driver" | "vendor" | "client";
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
  // Add other fields as needed
}

interface UserFormValues extends User {
  displayName: string;
  head_count?: string;
}

export default function EditUser({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
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
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        console.log("Fetched user data:", data);

        // Set form values
        setValue("displayName", data.name || data.contact_name || "");
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

        // Vendor specific fields
        if (data.type === "vendor") {
          setValue(
            "countiesServed",
            data.counties ? data.counties.split(", ") : [],
          );
          setValue("timeNeeded", data.time_needed ? [data.time_needed] : []);
          setValue(
            "cateringBrokerage",
            data.catering_brokerage ? data.catering_brokerage.split(", ") : [],
          );
          setValue("frequency", data.frequency || "");
          setValue("provisions", data.provide ? [data.provide] : []);
        }

        if (data.type === "client") {
          setValue("head_count", data.head_count || "");
          setValue(
            "countiesServed",
            data.counties ? data.counties.split(", ") : [],
          );
          setValue("timeNeeded", data.time_needed ? [data.time_needed] : []);
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
      if (data.type === "driver" || data.type === "vendor") {
        submitData.contact_name = data.displayName;
        delete submitData.name;
      } else {
        submitData.name = data.displayName;
        delete submitData.contact_name;
      }
      delete (submitData as any).displayName;

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
      console.log("User updated successfully:", updatedUser);
      toast({
        description: "User saved successfully!",
        variant: "default",
      });
      router.push("/admin/users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        description: "Failed to save user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const breadcrumbs = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
  ];

  const currentPageTitle = loading
    ? "Loading..."
    : `Editing ${watchedValues.displayName || "User"}`;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <PageHeader
          breadcrumbs={breadcrumbs}
          loading={loading}
          currentPageTitle={currentPageTitle}
        />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Type of account
                </h1>
                <Badge variant="outline" className="ml-auto sm:ml-0">
                  {watchedValues.type}
                </Badge>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button variant="outline" size="sm">
                    Discard
                  </Button>
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
                  <Card x-chunk="dashboard-07-chunk-3">
                    <CardHeader>
                      <CardTitle>User Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="status">Status</Label>
                          <Select>
                            <SelectTrigger
                              id="status"
                              aria-label="Select status"
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Active</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                          src="/placeholder.svg"
                          width="300"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <button>
                            <Image
                              alt="User image"
                              className="aspect-square w-full rounded-md object-cover"
                              height="84"
                              src="/placeholder.svg"
                              width="84"
                            />
                          </button>
                          <button>
                            <Image
                              alt="User image"
                              className="aspect-square w-full rounded-md object-cover"
                              height="84"
                              src="/placeholder.svg"
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
                  <Card x-chunk="dashboard-07-chunk-5">
                    <CardHeader>
                      <CardTitle>Archive User</CardTitle>
                      <CardDescription>
                        Lipsum dolor sit amet, consectetur adipiscing elit.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div></div>
                      <Button size="sm" variant="secondary">
                        Archive User
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:hidden">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm">Save User</Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
