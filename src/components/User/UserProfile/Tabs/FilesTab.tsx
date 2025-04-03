// src/components/Dashboard/UserView/Tabs/FilesTab.tsx

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface FilesTabProps {
  userId: string;
  refreshTrigger: number;
  isUserProfile?: boolean; // Add this prop
}

export default function FilesTab({ 
  userId, 
  refreshTrigger,
  isUserProfile = false
}: FilesTabProps) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  
  useEffect(() => {
    // Cleanup function to set mounted ref to false on unmount
    return () => {
      console.log("[FilesTab] Unmounting component.");
      isMountedRef.current = false;
    };
  }, []);
  
  useEffect(() => {
    console.log(`[FilesTab] Effect triggered. userId: ${userId}, refreshTrigger: ${refreshTrigger}`);

    // Skip if already loading to prevent overlapping requests
    // if (loading) return; // Removed this check
    
    // Prevent frequent refreshes (minimum 5 seconds between refreshes)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 5000 && lastFetchTimeRef.current !== 0) {
      console.log("[FilesTab] Skipping file fetch - too soon since last refresh.");
      return;
    }
    
    // Fetch user files
    const fetchFiles = async () => {
      console.log(`[FilesTab] Starting fetch for userId: ${userId}`);
      try {
        setError(null);
        lastFetchTimeRef.current = Date.now();
        
        const response = await fetch(`/api/users/${userId}/files`);
        console.log(`[FilesTab] Fetch response status: ${response.status}`);
        
        if (!response.ok) {
          console.error(`[FilesTab] Fetch failed with status: ${response.status}`);
          throw new Error(`Failed to fetch files (status: ${response.status})`);
        }
        
        const data = await response.json();
        console.log("[FilesTab] Fetch succeeded, received data:", data);
        
        // Only update state if the component is still mounted
        if (isMountedRef.current) {
          console.log("[FilesTab] Component is mounted, updating state.");
          setFiles(data);
        } else {
          console.log("[FilesTab] Component unmounted before fetch completed, skipping state update.");
        }
      } catch (error) {
        console.error("[FilesTab] Error during fetchFiles:", error);
        if (isMountedRef.current) {
          console.log("[FilesTab] Component is mounted, setting error state.");
          setError(error instanceof Error ? error.message : "Failed to fetch files");
        } else {
          console.log("[FilesTab] Component unmounted before error handling, skipping error state update.");
        }
      } finally {
        console.log(`[FilesTab] Fetch finally block. isMounted: ${isMountedRef.current}`);
        if (isMountedRef.current) {
          console.log("[FilesTab] Component is mounted, setting loading to false.");
          setLoading(false);
        } else {
          console.log("[FilesTab] Component unmounted, skipping setLoading(false).");
        }
      }
    };
    
    fetchFiles();
  }, [userId, refreshTrigger]); // Removed 'loading' from dependency array
  
  if (loading && files.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-center">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => {
            lastFetchTimeRef.current = 0; // Reset the time to force a refresh
            setLoading(false); // Reset loading to trigger a re-fetch
          }}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }
  
  if (files.length === 0) {
    return (
      <div className="rounded-md bg-muted/40 p-8 text-center">
        <p className="text-muted-foreground">No files uploaded yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Uploaded Files</h3>
      
      {/* File list */}
      <div className="divide-y rounded-md border">
        {files.map((file: any) => (
          <div 
            key={file.id} 
            className="flex items-center justify-between p-4"
          >
            {/* File details */}
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Download button */}
              <a 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-blue-600 hover:underline"
              >
                Download
              </a>
              
              {/* Only show delete option for admins or if it's the user's own profile */}
              {(!isUserProfile || file.uploadedBy === userId) && (
                <button 
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => {/* Delete file logic here */}}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}