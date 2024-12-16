import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverSchema } from "@/components/Auth/SignUp/FormSchemas";
import { useUploadFile, type UploadThingFile } from "@/hooks/use-upload-file";
import { FileUploader } from "@/components/Uploader/file-uploader";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import type { FileWithPath } from "react-dropzone";

interface DriverFormData {
  userType: "driver";
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

interface DriverFormProps {
  onSubmit: (data: DriverFormData) => Promise<void>;
}

interface UploadField {
  name: string;
  label: string;
  required: boolean;
}

const requiredUploads: UploadField[] = [
  { name: "driver_photo", label: "Driver Photo", required: false },
  { name: "insurance_photo", label: "Insurance Photo", required: true },
  { name: "vehicle_photo", label: "Vehicle Photo", required: true },
  { name: "license_photo", label: "Driver License Photo", required: true },
];

const DriverForm: React.FC<DriverFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadThingFile[]>>({});
  const tempEntityId = `temp_signup_${Date.now()}`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      userType: "driver",
    }
  });

  // Create upload hooks for each required document
  const fileUploader = useUploadFile("fileUploader", {
    defaultUploadedFiles: [],
    maxFileCount: 1,
    maxFileSize: 3 * 1024 * 1024,
    allowedFileTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
    category: "driver_documents",
    entityType: "user",
    entityId: tempEntityId,
  });

  const handleFileUpload = async (category: string, files: FileWithPath[]) => {
    try {
      const uploadedFilesList = await fileUploader.onUpload(files);
      setUploadedFiles(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), ...uploadedFilesList]
      }));
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error(`Error uploading ${category}:`, error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const areRequiredUploadsComplete = () => {
    return requiredUploads.every(upload => 
      !upload.required || (uploadedFiles[upload.name]?.length ?? 0) > 0
    );
  };

  const onSubmitWrapper = async (data: DriverFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      // After successful submission, you can update the entity IDs if needed
      // await fileUploader.updateEntityId(newUserId);
    } catch (error) {
      console.error('Error during submission:', error);
      toast({
        title: "Error",
        description: "Failed to submit form",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWrapper)} className="space-y-8">
      {/* Personal Information Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter your full name"
                className="w-full"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Create a password"
                className="w-full"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                placeholder="Enter your phone number"
                className="w-full"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message as string}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address Information</h3>

            <div className="space-y-2">
              <Label htmlFor="street1">Street Address</Label>
              <Input
                id="street1"
                {...register("street1")}
                placeholder="Enter your street address"
                className="w-full"
              />
              {errors.street1 && (
                <p className="text-sm text-red-500">{errors.street1.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="street2">Street Address 2 (Optional)</Label>
              <Input
                id="street2"
                {...register("street2")}
                placeholder="Apartment, suite, etc."
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="City"
                  className="w-full"
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...register("state")}
                  placeholder="State"
                  className="w-full"
                />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  {...register("zip")}
                  placeholder="ZIP"
                  className="w-full"
                />
                {errors.zip && (
                  <p className="text-sm text-red-500">{errors.zip.message as string}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Documents</h3>
            
            {requiredUploads.map((upload) => (
              <div key={upload.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    {upload.label}
                    {upload.required ? (
                      <span className="text-red-500 ml-1">*</span>
                    ) : (
                      <span className="text-gray-500 ml-1">(Optional)</span>
                    )}
                  </Label>
                  {uploadedFiles[upload.name]?.length > 0 && (
                    <span className="text-sm text-green-500">✓ Uploaded</span>
                  )}
                </div>
                <FileUploader
                  onUpload={(files) => handleFileUpload(upload.name, files)}
                  progresses={fileUploader.progresses}
                  isUploading={fileUploader.isUploading}
                  accept={{
                    "image/*": [],
                    "application/pdf": [],
                  }}
                  maxSize={3 * 1024 * 1024}
                  maxFileCount={1}
                  category={upload.name}
                  entityType="user"
                  entityId={tempEntityId}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={isLoading || !areRequiredUploadsComplete()}
          className="hover:bg-primary-dark w-full rounded-md bg-primary px-5 py-3 text-base font-semibold text-white transition disabled:opacity-50"
        >
          {isLoading ? "Registering..." : "Register as Driver"}
        </button>
        
        {!areRequiredUploadsComplete() && (
          <p className="text-center text-sm text-red-500">
            Please upload all required documents marked with * before submitting
          </p>
        )}
      </div>
    </form>
  );
};

export default DriverForm;