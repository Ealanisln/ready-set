"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CheckboxGroup,
  RadioGroup,
} from "@/components/Auth/SignUp/ui/FormComponents";
import {
  COUNTIES,
  TIME_NEEDED,
  CATERING_BROKERAGE,
  FREQUENCY,
  PROVISIONS,
  HEAD_COUNT,
} from "@/components/Auth/SignUp/ui/FormData";

interface VendorClientDetailsCardProps {
  control: any;
  errors: any;
  userType: "vendor" | "client";
  watchedValues: any;
}

const VendorClientDetailsCard: React.FC<VendorClientDetailsCardProps> = ({
  control,
  errors,
  userType,
  watchedValues,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {userType === "vendor" ? "Vendor" : "Client"} Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Controller
              name="countiesServed"
              control={control}
              rules={{
                required: "Please select at least one county",
              }}
              render={({ field }) => (
                <>
                  <CheckboxGroup
                    {...field}
                    control={control}
                    options={COUNTIES}
                    label="Counties Served"
                  />
                  {errors.countiesServed && (
                    <p className="mt-2 text-red-500">
                      {errors.countiesServed.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <Controller
              name="timeNeeded"
              control={control}
              rules={{
                required: "Please select at least one time option",
              }}
              render={({ field }) => {
                return (
                  <>
                    <CheckboxGroup
                      {...field}
                      control={control}
                      options={TIME_NEEDED}
                      label="Time Needed"
                    />
                    {errors.timeNeeded && (
                      <p className="mt-2 text-red-500">
                        {errors.timeNeeded.message}
                      </p>
                    )}
                  </>
                );
              }}
            />
          </div>

          {userType === "vendor" && (
            <div>
              <Controller
                name="cateringBrokerage"
                control={control}
                rules={{
                  required: "Please select a catering brokerage option",
                }}
                render={({ field }) => (
                  <>
                    <CheckboxGroup
                      {...field}
                      control={control}
                      options={CATERING_BROKERAGE}
                      label="Catering Brokerage"
                    />
                    {errors.cateringBrokerage && (
                      <p className="mt-2 text-red-500">
                        {errors.cateringBrokerage.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          )}

          <div>
            <Controller
              name="frequency"
              control={control}
              rules={{ required: "Please select a frequency" }}
              render={({ field }) => (
                <>
                  <RadioGroup
                    {...field}
                    control={control}
                    options={FREQUENCY}
                    label="Frequency"
                  />
                  {errors.frequency && (
                    <p className="mt-2 text-red-500">
                      {errors.frequency.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {userType === "vendor" && (
  <div>
    <Controller
      name="provisions"
      control={control}
      rules={{
        required: "Please select at least one provision",
      }}
      render={({ field }) => (
        <>
          <CheckboxGroup
            name={field.name}
            control={control}
            options={PROVISIONS}
            label="Do you provide"
          />
          {errors.provisions && (
            <p className="mt-2 text-red-500">
              {errors.provisions.message}
            </p>
          )}
        </>
      )}
    />
  </div>
)}

          {userType === "client" && (
            <div>
              <Controller
                name="head_count"
                control={control}
                rules={{ required: "Please select a headcount" }}
                render={({ field }) => (
                  <>
                    <RadioGroup
                      {...field}
                      control={control}
                      options={HEAD_COUNT}
                      label="Headcount"
                    />
                    {errors.head_count && (
                      <p className="mt-2 text-red-500">
                        {errors.head_count.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorClientDetailsCard;
