import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AppointmentDialogProps {
  buttonText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  calendarUrl: string;
  customButton?: React.ReactNode;
}

const ScheduleDialog: React.FC<AppointmentDialogProps> = ({
  buttonText = "Schedule a Call",
  dialogTitle = "Schedule an Appointment",
  dialogDescription = "Choose a convenient time for your appointment.",
  calendarUrl,
  customButton,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {customButton || (
          <button 
            className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {buttonText}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] md:max-w-[75%] lg:max-w-[90%] mt-16 mb-8 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800">
        <DialogHeader className="bg-white dark:bg-gray-900">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="h-[70vh] min-h-[400px] w-full bg-white dark:bg-gray-900">
          <iframe
            src={calendarUrl}
            width="100%"
            height="100%"
            className="border-0 bg-white dark:bg-gray-900"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;