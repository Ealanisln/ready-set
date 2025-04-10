// src/components/Dashboard/UserView/UserProfileTabs.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserFormValues } from "./types";
import { Control } from "react-hook-form";
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
  isUserProfile?: boolean;
}

export default function UserProfileTabs({
  userId,
  activeTab,
  setActiveTab,
  watchedValues,
  control,
  refreshTrigger,
  isUserProfile = false
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
          {(watchedValues.type === "vendor" ||
            watchedValues.type === "client") && (
            <TabsTrigger
              value="details"
              className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {watchedValues.type === "vendor"
                ? "Vendor Details"
                : "Client Details"}
            </TabsTrigger>
          )}
          <TabsTrigger
            value="files"
            className="rounded-t-lg border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Files
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Profile Tab */}
      <TabsContent value="profile" className="m-0 p-6">
        <ProfileTab control={control} watchedValues={watchedValues} />
      </TabsContent>

      {/* Address Tab */}
      <TabsContent value="address" className="m-0 p-6">
        <AddressTab control={control} />
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
        <FilesTab userId={userId} refreshTrigger={refreshTrigger} />
      </TabsContent>
    </Tabs>
  );
}