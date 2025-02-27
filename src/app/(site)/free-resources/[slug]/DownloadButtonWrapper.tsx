'use client';

import { useState } from "react";
import { DownloadPopup } from "@/components/Resources/ui/DownloadPopup";

// Define the interface for the downloadable files
interface DownloadableFile {
  _key: string;
  asset: {
    _id: string;
    url: string;
    originalFilename: string;
  }
}

// Props for the DownloadButtonWrapper component
interface DownloadButtonWrapperProps {
  files?: DownloadableFile[];
  guideTitle: string;
}

// Client component that wraps the download button functionality
export function DownloadButtonWrapper({ 
  files, 
  guideTitle 
}: DownloadButtonWrapperProps) {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  
  const hasDownloadableFiles = files && files.length > 0;
  
  if (!hasDownloadableFiles) return null;
  
  return (
    <div className="mt-6 text-center">
      <button
        onClick={() => setIsDownloadOpen(true)}
        className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition duration-200"
      >
        Download Guide
      </button>
      
      <DownloadPopup
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        title={guideTitle}
        downloadFiles={files}
      />
    </div>
  );
}