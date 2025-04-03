// src/components/Dashboard/UserView/Tabs/FilesTab.tsx

import UserFilesDisplay from "@/components/User/user-files-display";

interface FilesTabProps {
  userId: string;
  refreshTrigger: number;
}

export default function FilesTab({ userId, refreshTrigger }: FilesTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-dashed p-6">
        <h3 className="mb-4 text-base font-medium text-slate-800">
          Uploaded Documents
        </h3>
        {userId ? (
          <UserFilesDisplay
            userId={userId}
            refreshTrigger={refreshTrigger}
          />
        ) : (
          <div className="text-center text-slate-500">
            <p>Loading user information...</p>
          </div>
        )}
      </div>
    </div>
  );
}