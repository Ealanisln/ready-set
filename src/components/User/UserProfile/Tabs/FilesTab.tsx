// src/components/User/UserProfile/Tabs/FilesTab.tsx

import UserFilesDisplay from "@/components/User/user-files-display";

interface FilesTabProps {
  userId: string;
  refreshTrigger: number;
  isUserProfile?: boolean;
}

export default function FilesTab({ 
  userId, 
  refreshTrigger,
  isUserProfile = false
}: FilesTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-medium">
          Your Documents
        </h3>
        <UserFilesDisplay
          userId={userId}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
}