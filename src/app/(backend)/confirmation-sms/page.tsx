"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  driverName: string;
  helpdeskAgent: string;
  date: string;
  orderNumber: string;
  pickupTime: string;
  restaurant: string;
  restaurantAddress: string;
  company: string;
  companyAddress: string;
  headcounts: string;
  totalPay: string;
  dropOffTime: string;
};

export default function Component() {
  const [message, setMessage] = useState(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className="flex h-screen flex-col">
      <div className="mb-10 mt-10 flex-grow">
        {/* <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>SMS Confirmation Tool</CardTitle>
            <CardDescription>
              Enter the drive info to get the text confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                  <Label htmlFor="driverName">Driver name</Label>
                  <input
                    {...register("driverName"), { required: true }}
                      placeholder="John"
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    />
                    {errors.driverName && <span>This fields is mandatory.</span>}

                  </div>

                </div>
              </div>
            </form>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
