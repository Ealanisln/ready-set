import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { generateSlug } from "@/lib/create-slug";

// Dynamically import LeadCaptureForm
const LeadCaptureForm = dynamic(
  () => import("@/components/Resources/ui/LeadCaptureForm"),
  { ssr: false },
);

interface DownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSuccess?: () => void;
}

export const DownloadPopup: React.FC<DownloadPopupProps> = ({
  isOpen,
  onClose,
  title,
  onSuccess,
}) => {
  const isClosing = React.useRef(false);

  const handleDownloadSuccess = () => {
    if (isClosing.current) return;
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
      <DialogContent className="p-0 sm:max-w-[600px]">
        <DialogTitle className="sr-only">{`Download ${title}`}</DialogTitle>
        <LeadCaptureForm
          resourceSlug={(() => {
            const slug = generateSlug(title);
            return slug;
          })()}
          resourceTitle={title}
          onSuccess={handleDownloadSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DownloadPopup;
