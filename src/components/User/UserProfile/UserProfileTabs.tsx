// src/components/Dashboard/UserView/UserProfileTabs.tsx

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Control } from "react-hook-form";
import { UserFormValues } from "./types";
import ProfileTab from "./Tabs/ProfileTab";
import AddressTab from "./Tabs/AddressTab";
import DetailsTab from "./Tabs/DetailsTab";
import FilesTab from "./Tabs/FilesTab";

interface UserProfileTabsProps {
  userId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  watchedValues: UserFormValues;
  control: Control<UserFormValues>;
  refreshTrigger: number;
  isUserProfile?: boolean; // New prop for distinguishing between admin and user views
}

function UserProfileTabs({
  userId,
  activeTab,
  setActiveTab,
  watchedValues,
  control,
  refreshTrigger,
  isUserProfile = false // Default to admin view
}: UserProfileTabsProps) {
  return (
    <Tabs
      defaultValue="profile"
      value={activeTab}
      onValueChange={setActiveTab}
      className="rounded-xl bg-white shadow-sm"
    >
      <div className="border-b px-6 pt-4">
        <TabsList className="justify-start gap-2 rounded-none bg-transparent p-0">
          <TabsTrigger
            value="profile"
            className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="address"
            className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Address
          </TabsTrigger>
          
          {/* Only show type-specific details tab if user type is vendor or client */}
          {(watchedValues.type?.toLowerCase() === "vendor" ||
            watchedValues.type?.toLowerCase() === "client") && (
            <TabsTrigger
              value="details"
              className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {watchedValues.type === "vendor"
                ? "Vendor Details"
                : "Client Details"}
            </TabsTrigger>
          )}
          
          {/* Files tab */}
          <TabsTrigger
            value="files"
            className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Files
          </TabsTrigger>
          
          {/* Admin Settings tab - only visible in admin view (not user profile) */}
          {!isUserProfile && (
            <TabsTrigger
              value="admin-settings"
              className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Admin Settings
            </TabsTrigger>
          )}
        </TabsList>
      </div>

      {/* Profile Tab */}
      <TabsContent value="profile" className="m-0 p-6">
        <ProfileTab 
          control={control} 
          watchedValues={watchedValues} 
          isUserProfile={isUserProfile} 
        />
      </TabsContent>

      {/* Address Tab */}
      <TabsContent value="address" className="m-0 p-6">
        <AddressTab 
          control={control} 
          isUserProfile={isUserProfile} 
        />
      </TabsContent>

      {/* Type-specific Details Tab */}
      <TabsContent value="details" className="m-0 p-6">
        <DetailsTab 
          userType={watchedValues.type} 
          control={control} 
          isUserProfile={isUserProfile} 
        />
      </TabsContent>

      {/* Files Tab */}
      <TabsContent value="files" className="m-0 p-6">
        <FilesTab 
          userId={userId} 
          refreshTrigger={refreshTrigger} 
          isUserProfile={isUserProfile} 
        />
      </TabsContent>
      
      {/* Admin Settings Tab - only for admin view */}
      {!isUserProfile && (
        <TabsContent value="admin-settings" className="m-0 p-6">
          {/* Placeholder for AdminSettingsTab component */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Admin Settings</h3>
            {/* Admin settings content would go here */}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}

export default React.memo(UserProfileTabs);