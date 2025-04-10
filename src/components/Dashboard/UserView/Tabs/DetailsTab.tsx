// src/components/Dashboard/UserView/Tabs/DetailsTab.tsx

import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  UserFormValues, 
  COUNTIES, 
  TIME_NEEDED, 
  CATERING_BROKERAGES, 
  PROVISIONS, 
  FREQUENCIES,
  HEADCOUNT
} from "../types";
import { Control } from "react-hook-form";

interface DetailsTabProps {
  userType: UserFormValues["type"];
  control: Control<UserFormValues>;
  isUserProfile?: boolean;
}

export default function DetailsTab({ userType, control, isUserProfile = false }: DetailsTabProps) {
  if (userType === "vendor") {
    return <VendorDetails control={control} isUserProfile={isUserProfile} />;
  }

  if (userType === "client") {
    return <ClientDetails control={control} isUserProfile={isUserProfile} />;
  }

  return <div>No additional details for this user type.</div>;
}

interface VendorDetailsProps {
  control: Control<UserFormValues>;
  isUserProfile: boolean;
}

function VendorDetails({ control, isUserProfile }: VendorDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Counties Served */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800">
          Counties Served
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {COUNTIES.map((county) => (
            <div
              key={county}
              className="flex items-center space-x-2"
            >
              <Controller
                name="countiesServed"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={`county-${county}`}
                    checked={field.value?.includes(county)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, county]);
                      } else {
                        field.onChange(
                          currentValue.filter(
                            (v) => v !== county,
                          ),
                        );
                      }
                    }}
                  />
                )}
              />
              <Label
                htmlFor={`county-${county}`}
                className="text-sm font-normal"
              >
                {county}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Time Needed */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800">
          Time Needed
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIME_NEEDED.map((time) => (
            <div
              key={time}
              className="flex items-center space-x-2"
            >
              <Controller
                name="timeNeeded"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={`time-${time}`}
                    checked={field.value?.includes(time)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, time]);
                      } else {
                        field.onChange(
                          currentValue.filter((v) => v !== time),
                        );
                      }
                    }}
                  />
                )}
              />
              <Label
                htmlFor={`time-${time}`}
                className="text-sm font-normal"
              >
                {time}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Catering Brokerage */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800">
          Catering Brokerage
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {CATERING_BROKERAGES.map((brokerage) => (
            <div
              key={brokerage}
              className="flex items-center space-x-2"
            >
              <Controller
                name="cateringBrokerage"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={`brokerage-${brokerage}`}
                    checked={field.value?.includes(brokerage)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([
                          ...currentValue,
                          brokerage,
                        ]);
                      } else {
                        field.onChange(
                          currentValue.filter(
                            (v) => v !== brokerage,
                          ),
                        );
                      }
                    }}
                  />
                )}
              />
              <Label
                htmlFor={`brokerage-${brokerage}`}
                className="text-sm font-normal"
              >
                {brokerage}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Frequency */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800">
          Frequency
        </h3>
        <Controller
          name="frequency"
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value ?? undefined}
              className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4"
            >
              {FREQUENCIES.map((freq) => (
                <div
                  key={freq}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={freq}
                    id={`freq-${freq}`}
                  />
                  <Label
                    htmlFor={`freq-${freq}`}
                    className="text-sm font-normal"
                  >
                    {freq}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      </div>

      {/* Do you provide */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800">
          Do you provide
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PROVISIONS.map((provision) => (
            <div
              key={provision}
              className="flex items-center space-x-2"
            >
              <Controller
                name="provisions"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={`provision-${provision}`}
                    checked={field.value?.includes(provision)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([
                          ...currentValue,
                          provision,
                        ]);
                      } else {
                        field.onChange(
                          currentValue.filter(
                            (v) => v !== provision,
                          ),
                        );
                      }
                    }}
                  />
                )}
              />
              <Label
                htmlFor={`provision-${provision}`}
                className="text-sm font-normal"
              >
                {provision}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ClientDetailsProps {
  control: Control<UserFormValues>;
  isUserProfile: boolean;
}

function ClientDetails({ control, isUserProfile }: ClientDetailsProps) {
  return (
    <div className="space-y-6">
      {/* County Location */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800">
          County Location
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {COUNTIES.map((county) => (
            <div key={county} className="flex items-center space-x-2">
              <Controller
                name="countiesServed"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={`admin-county-${county}`}
                    checked={field.value?.includes(county)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, county]);
                      } else {
                        field.onChange(currentValue.filter((v) => v !== county));
                      }
                    }}
                  />
                )}
              />
              <Label htmlFor={`admin-county-${county}`} className="text-sm font-normal">
                {county}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Time Needed */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800">
          Time Needed
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIME_NEEDED.map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <Controller
                name="timeNeeded"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={`admin-time-${time}`}
                    checked={field.value?.includes(time)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, time]);
                      } else {
                        field.onChange(currentValue.filter((v) => v !== time));
                      }
                    }}
                  />
                )}
              />
              <Label htmlFor={`admin-time-${time}`} className="text-sm font-normal">
                {time}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Headcount */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800">
          Headcount
        </h3>
        <Controller
          name="headCount"
          control={control}
          render={({ field }) => {
            // Convert number to range string for display
            let displayValue = undefined;
            if (field.value !== null && field.value !== undefined) {
              const numValue = Number(field.value);
              displayValue = HEADCOUNT.find(range => {
                if (range.startsWith('+')) {
                  return numValue >= 300;
                }
                const [min, max] = range.split('-').map(Number);
                return numValue >= min && numValue <= (max || min); // If no max, use min as max
              });
              console.log('[ClientDetails Headcount Render] field.value:', field.value, ' | Calculated displayValue:', displayValue);
            }
            
            return (
              <RadioGroup
                onValueChange={(value) => {
                  let numValue;
                  if (value.startsWith('+')) {
                    numValue = 300; // For +300, store as 300
                  } else {
                    const [min] = value.split('-').map(Number);
                    numValue = min;
                  }
                  console.log('Setting headcount to:', numValue);
                  field.onChange(numValue);
                }}
                value={displayValue}
                className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
              >
                {HEADCOUNT.map((count: string) => (
                  <div key={count} className="flex items-center space-x-2">
                    <RadioGroupItem value={count} id={`client-headcount-${count}`} />
                    <Label htmlFor={`client-headcount-${count}`} className="text-sm font-normal">
                      {count}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            );
          }}
        />
      </div>

      {/* Frequency */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800">
          Frequency
        </h3>
        <Controller
          name="frequency"
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value ?? undefined}
              className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4"
            >
              {FREQUENCIES.map((freq) => (
                <div key={freq} className="flex items-center space-x-2">
                  <RadioGroupItem value={freq} id={`client-freq-${freq}`} />
                  <Label htmlFor={`client-freq-${freq}`} className="text-sm font-normal">
                    {freq}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      </div>
    </div>
  );
}