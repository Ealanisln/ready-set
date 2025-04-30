// Admin Side

'use client';

import React, { useState, useTransition, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { createCateringOrder } from '@/app/(backend)/admin/catering-orders/_actions/catering-orders'; // Import only action
// Import schema and types from the new schemas file
import {
  createCateringOrderSchema,
  CreateCateringOrderInput,
  ClientListItem,
} from '@/app/(backend)/admin/catering-orders/_actions/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CalendarIcon, Loader2, Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils"; // For conditional classes
import AddressManager from "@/components/AddressManager";
import { Address, AddressFormData } from "@/types/address";
import AddAddressForm from "@/components/AddressManager/AddAddressForm"; 
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog"; 
import { createClient } from '@/utils/supabase/client';
import { useUploadFile, UploadedFile } from "@/hooks/use-upload-file"; // Import the upload hook
import { FileWithPath } from "react-dropzone"; // Import FileWithPath type

interface CreateCateringOrderFormProps {
  clients: ClientListItem[];
}

// Custom AddressManager Wrapper component with better error handling
interface AddressManagerWrapperProps {
  onAddressesLoaded: (addresses: Address[]) => void;
  onAddressSelected: (addressId: string) => void;
  onError: (error: string) => void;
  errorState: string | null;
  setErrorState: (error: string | null) => void;
  onSwitchToManual: () => void;
  onAddNewAddress: () => void;
}

const AddressManagerWrapper: React.FC<AddressManagerWrapperProps> = ({
  onAddressesLoaded,
  onAddressSelected,
  onError,
  errorState,
  setErrorState,
  onSwitchToManual,
  onAddNewAddress
}) => {
  // Maintain a local error state to avoid unnecessary re-renders
  const [localErrorState, setLocalErrorState] = useState<string | null>(errorState);
  
  // Use an effect to sync parent error state with local error state only when parent changes
  useEffect(() => {
    setLocalErrorState(errorState);
  }, [errorState]);

  // Create a custom onAddressesLoaded handler
  const handleAddressesLoaded = useCallback((addresses: Address[]) => {
    if (addresses.length === 0) {
      setErrorState("No saved addresses found.");
    } else {
      setErrorState(null);
    }
    onAddressesLoaded(addresses);
  }, [onAddressesLoaded, setErrorState]);

  // Custom onError handler to update local state
  const handleAddressManagerError = useCallback((errorMessage: string) => {
    setLocalErrorState(errorMessage);
    setErrorState(errorMessage);
    onError(errorMessage);
  }, [onError, setErrorState]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">Select an existing address or add a new one</span>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={onAddNewAddress}
          className="gap-1"
        >
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>
      
      <AddressManager
        onAddressesLoaded={handleAddressesLoaded}
        onAddressSelected={onAddressSelected}
        onError={handleAddressManagerError}
        defaultFilter="all"
        showFilters={true}
        showManagementButtons={false}
      />
      
      {localErrorState && (
        <div className="mt-4">
          <p className="text-amber-600 mb-2">{localErrorState}</p>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSwitchToManual}
            size="sm"
          >
            Enter Address Manually
          </Button>
        </div>
      )}
    </>
  );
};

// Define Bay Area counties
const bayAreaCountyValues = [
  "Alameda", 
  "Contra Costa", 
  "Marin", 
  "Napa", 
  "San Francisco", 
  "San Mateo", 
  "Santa Clara", 
  "Solano", 
  "Sonoma"
];

// Define brokerage options to match user form
const BROKERAGE_OPTIONS = [
  { value: "Foodee", label: "Foodee" },
  { value: "Ez Cater", label: "Ez Cater" },
  { value: "Grubhub", label: "Grubhub" },
  { value: "Cater Cow", label: "Cater Cow" },
  { value: "Cater2me", label: "Cater2me" },
  { value: "Zero Cater", label: "Zero Cater" },
  { value: "Platterz", label: "Platterz" },
  { value: "Direct Delivery", label: "Direct Delivery" },
  { value: "Other", label: "Other" },
];

export const CreateCateringOrderForm: React.FC<CreateCateringOrderFormProps> = ({ clients }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [clientComboboxOpen, setClientComboboxOpen] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [pickupAddresses, setPickupAddresses] = useState<Address[]>([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState<Address[]>([]);
  const [pickupAddressError, setPickupAddressError] = useState<string | null>(null);
  const [deliveryAddressError, setDeliveryAddressError] = useState<string | null>(null);
  const [showManualPickupEntry, setShowManualPickupEntry] = useState(false);
  const [showManualDeliveryEntry, setShowManualDeliveryEntry] = useState(false);
  
  // State for address dialog
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressDialogType, setAddressDialogType] = useState<'pickup' | 'delivery'>('pickup');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // File upload state
  const [uploadedFileKeys, setUploadedFileKeys] = useState<string[]>([]);

  // Initialize Supabase client
  const supabase = createClient();
  
  // Get and store the session for userId in useUploadFile
  const [session, setSession] = useState<any>(null);
  
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();
  }, [supabase.auth]);

  // Initialize file upload hook
  const {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
    tempEntityId,
    updateEntityId,
    deleteFile,
  } = useUploadFile({
    bucketName: "fileUploader",
    maxFileCount: 5,
    maxFileSize: 10 * 1024 * 1024,
    allowedFileTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    category: "catering",
    entityType: "catering_order",
    userId: session?.user?.id,
  });

  const form = useForm<CreateCateringOrderInput>({
    resolver: zodResolver(createCateringOrderSchema),
    defaultValues: {
      needHost: 'NO', // Default value
      pickupAddress: { street1: '', city: '', state: '', zip: '' },
      deliveryAddress: { street1: '', city: '', state: '', zip: '' },
      pickupDateTime: undefined,
      arrivalDateTime: undefined,
      orderNumber: '', // Add order number
      brokerage: '', // Add brokerage field
      userId: undefined, // Initialize userId
    },
  });

  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = form;

  // Watch needHost to conditionally show host-related fields
  const needHostValue = watch("needHost");
  const currentUserId = watch("userId");

  // Wrap prop handlers in useCallback
  const handlePickupAddressesLoaded = useCallback((addresses: Address[]) => {
    setPickupAddresses(addresses);
    if (addresses.length === 0) {
      setPickupAddressError("No saved addresses found.");
    } else {
      setPickupAddressError(null); // Clear error if addresses are found
    }
  }, []); // Empty dependency array means this function reference is stable

  const handleDeliveryAddressesLoaded = useCallback((addresses: Address[]) => {
    setDeliveryAddresses(addresses);
    if (addresses.length === 0) {
      setDeliveryAddressError("No saved addresses found.");
    } else {
      setDeliveryAddressError(null); // Clear error if addresses are found
    }
  }, []); // Empty dependency array

  const handlePickupAddressSelected = useCallback((addressId: string) => {
    const selectedAddress = pickupAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setValue("pickupAddress", {
        street1: selectedAddress.street1,
        street2: selectedAddress.street2 || undefined,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip,
        county: selectedAddress.county || undefined
      });
      setPickupAddressError(null); // Clear error on selection
      setShowManualPickupEntry(false); // Switch back from manual if selection is made
    }
  }, [pickupAddresses, setValue]); // Depends on pickupAddresses and setValue

  const handleDeliveryAddressSelected = useCallback((addressId: string) => {
    const selectedAddress = deliveryAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setValue("deliveryAddress", {
        street1: selectedAddress.street1,
        street2: selectedAddress.street2 || undefined,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip,
        county: selectedAddress.county || undefined
      });
      setDeliveryAddressError(null); // Clear error on selection
      setShowManualDeliveryEntry(false); // Switch back from manual if selection is made
    }
  }, [deliveryAddresses, setValue]); // Depends on deliveryAddresses and setValue

  const handleAddressError = useCallback((error: string) => {
    console.log("Error from AddressManager reported to form:", error);
    // If the error is auth-related, trigger the auth dialog
    // Note: The AddressManager component itself now handles setting its internal error state
    // and clearing the user state if it detects a 401.
    // This handler in the form is now mostly for logging or additional UI reactions if needed.
    if (error.includes('Unauthorized') || error.includes('Authentication required')) {
      setIsAuthenticated(false);
      // Let AddressManager handle its own error state, but ensure manual mode is triggered
      // by the auth dialog closing or the error propogating.
      // We might not need to explicitly set manual entry here anymore if the auth dialog flow works.
      // setShowManualPickupEntry(true);
      // setShowManualDeliveryEntry(true);
    }
    // We don't need to call setPickupAddressError/setDeliveryAddressError here
    // as the AddressManagerWrapper now uses its own internal state managed via setErrorState prop
  }, []); // Empty dependency array is likely okay, as it only logs and sets auth state

  // Use useEffect for cleanup on unmount
  useEffect(() => {
    // Cleanup uploaded files on unmount if not submitted
    return () => {
      if (uploadedFileKeys.length > 0 && !isPending) {
        const cleanup = async () => {
          try {
            console.log("Cleaning up uploaded files on unmount:", uploadedFileKeys);
            const response = await fetch("/api/file-uploads/cleanup", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fileKeys: uploadedFileKeys,
                entityId: tempEntityId,
                entityType: "catering_order",
              }),
            });
            if (!response.ok) throw new Error("Failed to clean up files");
          } catch (error) {
            console.error("Error cleaning up files:", error);
          }
        };
        cleanup();
      }
    };
  }, [uploadedFileKeys, isPending, tempEntityId]);

  const onSubmit = (data: CreateCateringOrderInput) => {
    setGeneralError(null);
    startTransition(async () => {
      try {
        const result = await createCateringOrder(data);
        
        // If we have uploaded files, update the tempEntityId
        if (uploadedFiles.length > 0 && result.success && result.orderId) {
          try {
            await updateEntityId(result.orderId);
          } catch (error) {
            console.error("Failed to update entity ID for uploaded files:", error);
          }
        }
        
        if (result.success && result.orderNumber) {
          console.log(`Order ${result.orderNumber} created successfully!`);
          
          // Redirect to the new order's detail page
          router.push(`/admin/catering-orders/${result.orderNumber}`);
        } else {
          // Handle validation errors specifically if provided
          if (result.fieldErrors) {
             console.error("Field Validation Errors:", result.fieldErrors);
             console.error(result.error || "Validation failed. Please check the form.");
          } else {
            // Handle general server errors
            setGeneralError(result.error || 'An unexpected error occurred.');
            console.error(result.error || 'Failed to create order.');
          }
        }
      } catch (error) {
        console.error("Error creating order:", error);
        setGeneralError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    });
  };

  // Check authentication status on mount and set up auth state listener
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        if (!session) {
          setPickupAddressError("Please log in to access your addresses.");
          setDeliveryAddressError("Please log in to access your addresses.");
          setShowManualPickupEntry(true);
          setShowManualDeliveryEntry(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        setPickupAddressError("Please log in to access your addresses.");
        setDeliveryAddressError("Please log in to access your addresses.");
        setShowManualPickupEntry(true);
        setShowManualDeliveryEntry(true);
      } else {
        // Refresh addresses when user logs in
        setShowManualPickupEntry(false);
        setShowManualDeliveryEntry(false);
        setPickupAddressError(null);
        setDeliveryAddressError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleAddNewAddress = async (type: 'pickup' | 'delivery') => {
    // Check authentication before opening dialog
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Show auth dialog
      setIsAuthenticated(false);
      return;
    }
    
    setAddressDialogType(type);
    setAddressDialogOpen(true);
  };

  const handleAddressFormSubmit = async (addressData: AddressFormData) => {
    try {
      // Check authentication before submitting
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const addedAddress = await response.json();
      
      if (addressDialogType === 'pickup') {
        setPickupAddresses([...pickupAddresses, addedAddress]);
        handlePickupAddressSelected(addedAddress.id);
      } else {
        setDeliveryAddresses([...deliveryAddresses, addedAddress]);
        handleDeliveryAddressSelected(addedAddress.id);
      }
      
      setAddressDialogOpen(false);
      
    } catch (error) {
      console.error("Error adding address:", error);
      setGeneralError("Failed to add address. Please try again.");
    }
  };

  const handleLogin = () => {
    // Store the current URL to redirect back after login
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('returnTo', currentPath);
    
    // Redirect to login page
    router.push('/auth/login');
  };

  // Helper component for Manual Address Fields
  const ManualAddressFields: React.FC<{ fieldName: 'pickupAddress' | 'deliveryAddress' }> = 
    ({ fieldName }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor={`${fieldName}.street1`}>Street Address 1</Label>
          <Input 
            id={`${fieldName}.street1`} 
            {...register(`${fieldName}.street1`)}
            placeholder="123 Main St" 
          />
          {errors[fieldName]?.street1 && <p className="text-sm text-red-500">{errors[fieldName]?.street1?.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${fieldName}.street2`}>Street Address 2 (Optional)</Label>
          <Input 
            id={`${fieldName}.street2`} 
            {...register(`${fieldName}.street2`)} 
            placeholder="Apt, Suite, etc."
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${fieldName}.city`}>City</Label>
          <Input 
            id={`${fieldName}.city`} 
            {...register(`${fieldName}.city`)} 
            placeholder="Anytown" 
          />
          {errors[fieldName]?.city && <p className="text-sm text-red-500">{errors[fieldName]?.city?.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${fieldName}.state`}>State</Label>
          <Input 
            id={`${fieldName}.state`} 
            {...register(`${fieldName}.state`)} 
            placeholder="CA" 
            maxLength={2} 
          />
          {errors[fieldName]?.state && <p className="text-sm text-red-500">{errors[fieldName]?.state?.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${fieldName}.zip`}>Zip Code</Label>
          <Input 
            id={`${fieldName}.zip`} 
            {...register(`${fieldName}.zip`)} 
            placeholder="90210" 
          />
          {errors[fieldName]?.zip && <p className="text-sm text-red-500">{errors[fieldName]?.zip?.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${fieldName}.county`}>County (Optional)</Label>
          <Input 
            id={`${fieldName}.county`} 
            {...register(`${fieldName}.county`)} 
            placeholder="Los Angeles" 
          />
        </div>
      </div>
    </div>
  );

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const files = Array.from(event.target.files) as FileWithPath[];
    try {
      console.log("Starting upload of", files.length, "files");
      const result = await onUpload(files);
      console.log("Upload completed successfully:", result);

      // Set uploaded files to form state
      // setValue("attachments", result); // We'd need to add this to the schema
      
      // Track file keys for potential cleanup
      const newFileKeys = result.map((file) => file.key);
      setUploadedFileKeys((prev) => [...prev, ...newFileKeys]);
    } catch (error) {
      console.error("Upload error:", error);
      setGeneralError(
        error instanceof Error
          ? `Upload failed: ${error.message}`
          : "Failed to upload files. Please try again."
      );
    }
  };

  // Remove file handler
  const removeFile = async (fileToRemove: UploadedFile) => {
    try {
      console.log("Removing file:", fileToRemove);

      // Remove from UI immediately
      const updatedFiles = uploadedFiles.filter(
        (file) => file.key !== fileToRemove.key
      );
      // setValue("attachments", updatedFiles); // We'd need to add this to the schema

      // Remove from tracked keys
      setUploadedFileKeys((prev) =>
        prev.filter((key) => key !== fileToRemove.key)
      );

      // Delete the file
      await deleteFile(fileToRemove.key);
      console.log("File removed successfully");
    } catch (error) {
      console.error("Error removing file:", error);
      setGeneralError("Failed to remove file. Please try again.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {generalError && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            <span className="font-medium">Error:</span> {generalError}
          </div>
        )}

        {/* Client Selection Combobox */}
        <div className="space-y-2">
          <Label htmlFor="userId">Client</Label>
          <Popover open={clientComboboxOpen} onOpenChange={setClientComboboxOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={clientComboboxOpen}
                className="w-full justify-between font-normal"
              >
                {currentUserId
                  ? clients.find((client) => client.id === currentUserId)?.name
                  : "Select client..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search clients..." />
                <CommandList>
                  <CommandEmpty>No client found.</CommandEmpty>
                  <CommandGroup>
                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.name} // Use name for filtering in CommandInput
                        onSelect={(currentValue: string) => {
                          const selectedClientId = clients.find(c => c.name.toLowerCase() === currentValue.toLowerCase())?.id;
                          if (selectedClientId) {
                             setValue("userId", selectedClientId);
                             setSelectedClientName(client.name);
                          }
                          setClientComboboxOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentUserId === client.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {client.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.userId && <p className="text-sm text-red-500">{errors.userId.message}</p>}
        </div>

        {/* Order Details Section - Brokerage and Order Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brokerage Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="brokerage">Brokerage / Direct</Label>
            <Select 
              onValueChange={(value) => setValue('brokerage', value)} 
              defaultValue={form.getValues("brokerage") === null 
                ? undefined 
                : form.getValues("brokerage") || ""}
            >
              <SelectTrigger id="brokerage">
                <SelectValue placeholder="Select brokerage" />
              </SelectTrigger>
              <SelectContent>
                {BROKERAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brokerage && <p className="text-sm text-red-500">{errors.brokerage.message}</p>}
          </div>

          {/* Order Number */}
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Order Number</Label>
            <Input 
              id="orderNumber"
              {...register('orderNumber')}
              placeholder="e.g., ORD-12345"
            />
            {errors.orderNumber && <p className="text-sm text-red-500">{errors.orderNumber.message}</p>}
          </div>
        </div>

        {/* Order Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pickup Date & Time */}
          <div className="space-y-2">
            <Label htmlFor="pickupDateTime">Pickup Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch('pickupDateTime') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('pickupDateTime') ? format(watch('pickupDateTime'), "PPPp") : <span>Pick a date and time</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watch('pickupDateTime')}
                  onSelect={(date) => {
                    if (!date) {
                      setValue('pickupDateTime', undefined as unknown as Date);
                      return;
                    }
                    
                    // Preserve current time if date already exists
                    const currentDateTime = watch('pickupDateTime');
                    if (currentDateTime) {
                      const newDate = new Date(date);
                      newDate.setHours(
                        currentDateTime.getHours(),
                        currentDateTime.getMinutes(),
                        0,
                        0
                      );
                      setValue('pickupDateTime', newDate);
                    } else {
                      // Set default time (noon) if no previous time
                      const newDate = new Date(date);
                      newDate.setHours(12, 0, 0, 0);
                      setValue('pickupDateTime', newDate);
                    }
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
                  classNames={{
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-10 font-medium text-sm",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    day_disabled: "rdp-day_disabled text-red-300 line-through bg-gray-100",
                    cell: "text-center text-sm relative [&:has([aria-selected])]:bg-accent focus-within:relative focus-within:z-20",
                    nav: "absolute top-1 right-1 flex items-center space-x-1",
                  }}
                />
                {/* Time Input */}
                <div className="p-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pickupTime">Time</Label>
                    <Input
                      id="pickupTime"
                      type="time"
                      className="w-32"
                      value={watch('pickupDateTime') ? format(watch('pickupDateTime'), 'HH:mm') : ''}
                      onChange={(e) => {
                        const timeValue = e.target.value;
                        if (!timeValue) return;
                        
                        const [hours, minutes] = timeValue.split(':').map(Number);
                        const currentDate = watch('pickupDateTime');
                        
                        // If we have a date, update it with the new time
                        if (currentDate) {
                          const newDate = new Date(currentDate);
                          newDate.setHours(hours, minutes, 0, 0);
                          setValue('pickupDateTime', newDate);
                        } else {
                          // If no date selected, use today with the selected time
                          const newDate = new Date();
                          newDate.setHours(hours, minutes, 0, 0);
                          setValue('pickupDateTime', newDate);
                        }
                      }}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {errors.pickupDateTime && <p className="text-sm text-red-500">{errors.pickupDateTime.message}</p>}
          </div>

          {/* Arrival Date & Time */}
          <div className="space-y-2">
            <Label htmlFor="arrivalDateTime">Arrival Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch('arrivalDateTime') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('arrivalDateTime') ? format(watch('arrivalDateTime'), "PPPp") : <span>Pick a date and time</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watch('arrivalDateTime')}
                  onSelect={(date) => {
                    if (!date) {
                      setValue('arrivalDateTime', undefined as unknown as Date);
                      return;
                    }
                    
                    // Preserve current time if date already exists
                    const currentDateTime = watch('arrivalDateTime');
                    if (currentDateTime) {
                      const newDate = new Date(date);
                      newDate.setHours(
                        currentDateTime.getHours(),
                        currentDateTime.getMinutes(),
                        0,
                        0
                      );
                      setValue('arrivalDateTime', newDate);
                    } else {
                      // Set default time (noon) if no previous time
                      const newDate = new Date(date);
                      newDate.setHours(12, 0, 0, 0);
                      setValue('arrivalDateTime', newDate);
                    }
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
                  classNames={{
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-10 font-medium text-sm",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    day_disabled: "rdp-day_disabled text-red-300 line-through bg-gray-100",
                    cell: "text-center text-sm relative [&:has([aria-selected])]:bg-accent focus-within:relative focus-within:z-20",
                    nav: "absolute top-1 right-1 flex items-center space-x-1",
                  }}
                />
                {/* Time Input */}
                <div className="p-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="arrivalTime">Time</Label>
                    <Input
                      id="arrivalTime"
                      type="time"
                      className="w-32"
                      value={watch('arrivalDateTime') ? format(watch('arrivalDateTime'), 'HH:mm') : ''}
                      onChange={(e) => {
                        const timeValue = e.target.value;
                        if (!timeValue) return;
                        
                        const [hours, minutes] = timeValue.split(':').map(Number);
                        const currentDate = watch('arrivalDateTime');
                        
                        // If we have a date, update it with the new time
                        if (currentDate) {
                          const newDate = new Date(currentDate);
                          newDate.setHours(hours, minutes, 0, 0);
                          setValue('arrivalDateTime', newDate);
                        } else {
                          // If no date selected, use today with the selected time
                          const newDate = new Date();
                          newDate.setHours(hours, minutes, 0, 0);
                          setValue('arrivalDateTime', newDate);
                        }
                      }}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {errors.arrivalDateTime && <p className="text-sm text-red-500">{errors.arrivalDateTime.message}</p>}
          </div>

          {/* Complete Date & Time (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="completeDateTime">Complete Date & Time <span className="text-xs text-muted-foreground">(Optional)</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch('completeDateTime') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('completeDateTime') 
                    ? format(watch('completeDateTime') as Date, "PPPp") 
                    : <span>Pick a date and time</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watch('completeDateTime') as Date | undefined}
                  onSelect={(date) => {
                    if (!date) {
                      setValue('completeDateTime', undefined);
                      return;
                    }
                    
                    // Preserve current time if date already exists
                    const currentDateTime = watch('completeDateTime') as Date | undefined;
                    if (currentDateTime) {
                      const newDate = new Date(date);
                      newDate.setHours(
                        currentDateTime.getHours(),
                        currentDateTime.getMinutes(),
                        0,
                        0
                      );
                      setValue('completeDateTime', newDate);
                    } else {
                      // Set default time (noon) if no previous time
                      const newDate = new Date(date);
                      newDate.setHours(12, 0, 0, 0);
                      setValue('completeDateTime', newDate);
                    }
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
                  classNames={{
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-10 font-medium text-sm",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    day_disabled: "rdp-day_disabled text-red-300 line-through bg-gray-100",
                    cell: "text-center text-sm relative [&:has([aria-selected])]:bg-accent focus-within:relative focus-within:z-20",
                    nav: "absolute top-1 right-1 flex items-center space-x-1",
                  }}
                />
                {/* Time Input */}
                <div className="p-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="completeTime">Time</Label>
                    <Input
                      id="completeTime"
                      type="time"
                      className="w-32"
                      value={watch('completeDateTime') ? format(watch('completeDateTime') as Date, 'HH:mm') : ''}
                      onChange={(e) => {
                        const timeValue = e.target.value;
                        if (!timeValue) return;
                        
                        const [hours, minutes] = timeValue.split(':').map(Number);
                        const currentDate = watch('completeDateTime') as Date | undefined;
                        
                        // If we have a date, update it with the new time
                        if (currentDate) {
                          const newDate = new Date(currentDate);
                          newDate.setHours(hours, minutes, 0, 0);
                          setValue('completeDateTime', newDate);
                        } else {
                          // If no date selected, use today with the selected time
                          const newDate = new Date();
                          newDate.setHours(hours, minutes, 0, 0);
                          setValue('completeDateTime', newDate);
                        }
                      }}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {errors.completeDateTime && <p className="text-sm text-red-500">{errors.completeDateTime.message}</p>}
          </div>

          {/* Headcount */}
          <div className="space-y-2">
            <Label htmlFor="headcount">Headcount (Optional)</Label>
            <Input id="headcount" type="number" {...register('headcount', { valueAsNumber: true })} placeholder="e.g., 50" />
            {errors.headcount && <p className="text-sm text-red-500">{errors.headcount.message}</p>}
          </div>

          {/* Order Total */}
          <div className="space-y-2">
            <Label htmlFor="orderTotal">Order Total (Optional)</Label>
            <Input id="orderTotal" type="number" step="0.01" {...register('orderTotal', { valueAsNumber: true })} placeholder="e.g., 1250.50" />
            {errors.orderTotal && <p className="text-sm text-red-500">{errors.orderTotal.message}</p>}
          </div>

          {/* Tip */}
          <div className="space-y-2">
            <Label htmlFor="tip">Tip (Optional)</Label>
            <Input id="tip" type="number" step="0.01" {...register('tip', { valueAsNumber: true })} placeholder="e.g., 100.00" />
            {errors.tip && <p className="text-sm text-red-500">{errors.tip.message}</p>}
          </div>
        </div>

        {/* Host Needs Section */}
        <div className="space-y-4 p-4 border rounded-md bg-slate-50/50">
           <h4 className="text-md font-semibold mb-3">Host Requirements</h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="needHost">Need Host?</Label>
                <Select onValueChange={(value) => setValue('needHost', value as 'YES' | 'NO')} defaultValue={form.getValues("needHost")}>
                  <SelectTrigger id="needHost">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NO">No</SelectItem>
                    <SelectItem value="YES">Yes</SelectItem>
                    <SelectItem value="MAYBE">Maybe</SelectItem>
                  </SelectContent>
                </Select>
                {errors.needHost && <p className="text-sm text-red-500">{errors.needHost.message}</p>}
              </div>

              {/* Conditionally render Hours Needed and Number of Hosts */}
              {needHostValue === 'YES' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="hoursNeeded">Hours Needed (Optional)</Label>
                    <Input id="hoursNeeded" type="number" step="0.1" {...register('hoursNeeded', { valueAsNumber: true })} placeholder="e.g., 4.5" />
                    {errors.hoursNeeded && <p className="text-sm text-red-500">{errors.hoursNeeded.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numberOfHosts">Number of Hosts (Optional)</Label>
                    <Input id="numberOfHosts" type="number" {...register('numberOfHosts', { valueAsNumber: true })} placeholder="e.g., 2"/>
                    {errors.numberOfHosts && <p className="text-sm text-red-500">{errors.numberOfHosts.message}</p>}
                  </div>
                </>
              )}
           </div>
        </div>

        {/* Address Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 border rounded-md bg-slate-50/50">
            <h4 className="text-md font-semibold mb-3">Pickup Address</h4>
            
            {!showManualPickupEntry ? (
              <AddressManagerWrapper
                onAddressesLoaded={handlePickupAddressesLoaded}
                onAddressSelected={handlePickupAddressSelected}
                onError={handleAddressError}
                errorState={pickupAddressError}
                setErrorState={setPickupAddressError}
                onSwitchToManual={() => setShowManualPickupEntry(true)}
                onAddNewAddress={() => handleAddNewAddress('pickup')}
              />
            ) : (
              <>
                <ManualAddressFields fieldName="pickupAddress" />
                <div className="mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowManualPickupEntry(false)}
                    size="sm"
                  >
                    Use Address Manager
                  </Button>
                </div>
              </>
            )}
            
            {errors.pickupAddress && !showManualPickupEntry && (
              <div className="text-sm text-red-500 mt-2">
                {errors.pickupAddress.street1?.message || 
                errors.pickupAddress.city?.message || 
                errors.pickupAddress.state?.message || 
                errors.pickupAddress.zip?.message}
              </div>
            )}
          </div>
          
          <div className="space-y-4 p-4 border rounded-md bg-slate-50/50">
            <h4 className="text-md font-semibold mb-3">Delivery Address</h4>
            
            {!showManualDeliveryEntry ? (
              <AddressManagerWrapper
                onAddressesLoaded={handleDeliveryAddressesLoaded}
                onAddressSelected={handleDeliveryAddressSelected}
                onError={handleAddressError}
                errorState={deliveryAddressError}
                setErrorState={setDeliveryAddressError}
                onSwitchToManual={() => setShowManualDeliveryEntry(true)}
                onAddNewAddress={() => handleAddNewAddress('delivery')}
              />
            ) : (
              <>
                <ManualAddressFields fieldName="deliveryAddress" />
                <div className="mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowManualDeliveryEntry(false)}
                    size="sm"
                  >
                    Use Address Manager
                  </Button>
                </div>
              </>
            )}
            
            {errors.deliveryAddress && !showManualDeliveryEntry && (
              <div className="text-sm text-red-500 mt-2">
                {errors.deliveryAddress.street1?.message || 
                errors.deliveryAddress.city?.message || 
                errors.deliveryAddress.state?.message || 
                errors.deliveryAddress.zip?.message}
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="clientAttention">Client Attention (Optional)</Label>
            <Textarea id="clientAttention" {...register('clientAttention')} placeholder="Specific person or department" />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="pickupNotes">Pickup Notes (Optional)</Label>
            <Textarea id="pickupNotes" {...register('pickupNotes')} placeholder="e.g., Call upon arrival, specific instructions" />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="specialNotes">Special Notes (Optional)</Label>
            <Textarea id="specialNotes" {...register('specialNotes')} placeholder="e.g., Allergies, dietary restrictions, setup requirements" />
          </div>
        </div>

        {/* File Attachments Section */}
        <div className="space-y-4 p-4 border rounded-md bg-slate-50/50">
          <h4 className="text-md font-semibold mb-3">Attachments (Optional)</h4>
          <div className="space-y-2">
            <div>
              <Label htmlFor="file-upload" className="mb-2 block">Upload Files</Label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isUploading || isPending}
              />
              <p className="mt-1 text-xs text-gray-500">
                Maximum 5 files. Supported formats: PDF, Word, JPEG, PNG, WebP. Max size: 10MB per file.
              </p>
            </div>
          </div>

          {/* File list */}
          <div className="space-y-2">
            {uploadedFiles?.map((file: UploadedFile) => (
              <div
                key={file.key}
                className="flex items-center justify-between rounded-md border border-gray-200 p-2"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  {progresses && progresses[file.name] !== undefined && progresses[file.name] < 100 && (
                    <span className="text-xs text-gray-500">
                      {Math.round(progresses[file.name])}%
                    </span>
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeFile(file)}
                  disabled={isUploading || isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
            ) : (
              'Create Order'
            )}
          </Button>
        </div>
      </form>

      {/* Address Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>
            {addressDialogType === 'pickup' ? 'Add New Pickup Address' : 'Add New Delivery Address'}
          </DialogTitle>
          <DialogDescription>
            Fill in the address details below. This address will be saved for future use.
          </DialogDescription>
          <div className="pt-2">
            <AddAddressForm 
              onSubmit={handleAddressFormSubmit}
              onClose={() => setAddressDialogOpen(false)}
              allowedCounties={bayAreaCountyValues}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Dialog */}
      <Dialog open={!isAuthenticated} onOpenChange={(open) => {
        if (!open) {
          // If closing the dialog, switch to manual entry
          setShowManualPickupEntry(true);
          setShowManualDeliveryEntry(true);
        }
      }}>
        <DialogContent>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to manage addresses. You can continue with manual address entry or log in to access your saved addresses.
          </DialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowManualPickupEntry(true);
                setShowManualDeliveryEntry(true);
                setIsAuthenticated(true); // Close the dialog
              }}
            >
              Continue with Manual Entry
            </Button>
            <Button onClick={handleLogin}>
              Log In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 