// src/components/ui/DownloadPopup.tsx

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { generateSlug } from "@/lib/create-slug";
import { useRef } from "react";
import LeadCaptureForm from "./LeadCaptureForm";

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
    };
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
  const primaryDownloadUrl =
    downloadFiles && downloadFiles.length > 0 && downloadFiles[0]?.asset?.url
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
      downloadFiles.slice(1).forEach((file, index) => {
        setTimeout(
          () => {
            window.open(file.asset.url, "_blank");
          },
          500 * (index + 1),
        ); // Staggered delay between downloads
      });
    }

    // Set isClosing to prevent multiple closes
    isClosing.current = true;

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
      <DialogContent className="bg-background mt-12 w-full max-w-lg overflow-hidden rounded-lg border-none bg-white p-0 shadow-xl sm:max-w-xl md:max-w-2xl">
        <DialogTitle className="p-4 text-center text-xl font-bold">
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
