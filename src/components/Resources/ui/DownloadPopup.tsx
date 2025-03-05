// src/components/ui/DownloadPopup.tsx

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { generateSlug } from "@/lib/create-slug";
import LeadCaptureForm from "./LeadCaptureForm";
import { useRef } from "react";

interface DownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  downloadUrl?: string;
  downloadFiles?: Array<{
    _key: string;
    asset: {
      _id: string;
      url: string;
      originalFilename: string;
    }
  }>;
  onSuccess?: () => void;
}

export const DownloadPopup: React.FC<DownloadPopupProps> = ({
  isOpen,
  onClose,
  title,
  downloadUrl,
  downloadFiles,
  onSuccess,
}) => {
  const isClosing = useRef(false);

  // Determine the primary download URL (prefer Sanity files if available)
  const primaryDownloadUrl = downloadFiles && downloadFiles.length > 0 
    ? downloadFiles[0].asset.url 
    : downloadUrl;

  const handleDownloadSuccess = () => {
    if (isClosing.current) return;
    
    // If we have a direct download URL or a single file, open it
    if (primaryDownloadUrl) {
      window.open(primaryDownloadUrl, "_blank");
    }
    
    // Multi-file download support (for Sanity files)
    if (downloadFiles && downloadFiles.length > 1) {
      // Open additional files
      downloadFiles.slice(1).forEach(file => {
        setTimeout(() => {
          window.open(file.asset.url, "_blank");
        }, 500); // Small delay between downloads
      });
    }

    setTimeout(() => {
      onSuccess?.();
      onClose();
      // Reset the flag after a short delay
      setTimeout(() => {
        isClosing.current = false;
      }, 100);
    }, 3000);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isClosing.current) {
          onClose();
        }
      }}
    >
      <DialogContent className="bg-background bg-white rounded-lg border-none shadow-xl w-full max-w-lg sm:max-w-xl md:max-w-2xl p-0 overflow-hidden mt-12">
        <DialogTitle className="text-center text-xl font-bold p-4">
          {`Download ${title}`}
        </DialogTitle>
        <LeadCaptureForm
          resourceSlug={generateSlug(title)}
          resourceTitle={title}
          onSuccess={handleDownloadSuccess}
          downloadUrl={primaryDownloadUrl || ""}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DownloadPopup;