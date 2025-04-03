// src/components/User/user-files-display.tsx

import React, { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface UserFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category?: string;
  uploadedAt: string;
}

interface UserFilesDisplayProps {
  userId: string;
  refreshTrigger?: number;
}

export default function UserFilesDisplay({ userId, refreshTrigger = 0 }: UserFilesDisplayProps) {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchUserFiles = async () => {
      console.log('Fetching files for userId:', userId);
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/${userId}/files`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (Array.isArray(data)) {
          console.log('Setting files:', data);
          setFiles(data);
        } else {
          console.warn("Unexpected response format:", data);
          setFiles([]);
        }
      } catch (err) {
        console.error("Error fetching user files:", err);
        setError(err instanceof Error ? err.message : "Failed to load files");
        setFiles([]);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };
    
    if (userId) {
      console.log('Starting fetch for userId:', userId);
      fetchUserFiles();
    } else {
      console.log('No userId provided, skipping fetch');
      setLoading(false);
    }
  }, [userId, refreshTrigger]);

  const handleDeleteFile = async (fileId: string) => {
    if (isDeleting[fileId]) return;
    
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }
    
    try {
      setIsDeleting(prev => ({ ...prev, [fileId]: true }));
      
      const response = await fetch('/api/file-uploads', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileId,
          userId // Pass the userId from props to the API
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete file");
      }
      
      // Remove the file from the local state
      setFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success("File deleted successfully");
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete file");
    } finally {
      setIsDeleting(prev => ({ ...prev, [fileId]: false }));
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Group files by category
  const filesByCategory = files.reduce<Record<string, UserFile[]>>((acc, file) => {
    const category = file.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(file);
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-4">Loading files...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">Error: {error}</div>;
  }

  if (files.length === 0) {
    return <div className="text-center py-4">No files uploaded yet</div>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(filesByCategory).map(([category, categoryFiles]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-lg font-medium capitalize">{category}</h3>
          <div className="divide-y divide-gray-200">
            {categoryFiles.map(file => (
              <div key={file.id} className="py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <a 
                      href={file.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline truncate"
                    >
                      {file.fileName}
                    </a>
                  </div>
                  <div className="mt-1 flex text-sm text-gray-500 space-x-2">
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span>•</span>
                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteFile(file.id)}
                  disabled={isDeleting[file.id]}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}