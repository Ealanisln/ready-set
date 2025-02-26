// src/components/Resources/ui/DownloadPopup.tsx

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { generateSlug } from "@/lib/create-slug";
import LeadCaptureForm from "./LeadCaptureForm";
import { useRef } from "react";

interface DownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  downloadUrl: string;
  onSuccess?: () => void;
}

export const DownloadPopup: React.FC<DownloadPopupProps> = ({
  isOpen,
  onClose,
  title,
  downloadUrl,
  onSuccess,
}) => {
  const isClosing = useRef(false);

  const handleDownloadSuccess = () => {
    if (isClosing.current) return;
    // Trigger the download
    window.open(downloadUrl, "_blank");

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
      <DialogContent>
        <DialogTitle>{`Download ${title}`}</DialogTitle>
        <LeadCaptureForm
          resourceSlug={generateSlug(title)}
          resourceTitle={title}
          onSuccess={handleDownloadSuccess}
          downloadUrl={downloadUrl}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DownloadPopup;
