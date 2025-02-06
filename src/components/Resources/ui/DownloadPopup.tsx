import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import dynamic from 'next/dynamic';
import { generateSlug } from '@/lib/create-slug';

// Dynamically import LeadCaptureForm
const LeadCaptureForm = dynamic(
  () => import('@/components/Resources/ui/LeadCaptureForm'),
  { ssr: false }
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
  onSuccess
}) => {
  const handleDownloadSuccess = () => {
    onSuccess?.(); // For any additional success tracking
    // Removed onClose() here ❌
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 sm:max-w-[600px]">
        <DialogTitle className="sr-only">
          {`Download ${title}`}
        </DialogTitle>
        <LeadCaptureForm
          resourceSlug={generateSlug(title)}
          resourceTitle={title}
          onSuccess={handleDownloadSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DownloadPopup;