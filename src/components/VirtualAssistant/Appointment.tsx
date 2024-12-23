import Link from "next/link";
import { forwardRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PhoneCall } from "lucide-react";

interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'black' | 'black-small' | 'amber' | 'gray';
}

export const CustomButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ href, children, onClick, icon, className = "", variant = 'default' }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'black':
          return "bg-black text-white hover:bg-gray-800 py-5 px-8 text-lg";
        case 'black-small':
          return "bg-black text-white hover:bg-gray-800 py-3 px-6 text-base";
        case 'amber':
          return "bg-amber-400 text-black hover:bg-amber-500 py-4 px-8";
        case 'gray':
          return "bg-gray-900 text-white hover:bg-gray-800 py-4 px-10 tracking-wide uppercase text-lg";
        default:
          return "bg-amber-400 text-black hover:bg-amber-500 md:px-10 md:py-5 md:text-lg px-8 py-4 text-base";
      }
    };

    const defaultButtonClass = `
      rounded-full 
      font-semibold 
      transition-colors 
      flex items-center gap-2
      ${getVariantClasses()}
    `;

    const buttonClass = `${defaultButtonClass} ${className}`;

    const content = (
      <>
        {children}
        {icon && <span className="ml-1.5">{icon}</span>}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={buttonClass} ref={ref as React.Ref<HTMLAnchorElement>}>
          {content}
        </Link>
      );
    }

    return (
      <button 
        className={buttonClass} 
        onClick={onClick} 
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {content}
      </button>
    );
  }
);

// Add display name
CustomButton.displayName = 'CustomButton';

interface AppointmentDialogProps {
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonClassName?: string;
  buttonVariant?: 'default' | 'black' | 'black-small' | 'amber' | 'gray';
  dialogTitle?: string;
  dialogDescription?: string;
  calendarUrl: string;
  customButton?: React.ReactNode;
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  buttonText = "Book a Discovery call",
  buttonIcon = <PhoneCall size={16} />,
  buttonClassName = "",
  buttonVariant = 'default',
  dialogTitle = "Schedule an Appointment",
  dialogDescription = "Choose a convenient time for your appointment.",
  calendarUrl,
  customButton,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {customButton || (
          <CustomButton 
            icon={buttonIcon} 
            className={buttonClassName}
            variant={buttonVariant}
          >
            {buttonText}
          </CustomButton>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] md:max-w-[75%] lg:max-w-[90%] mt-16 mb-8">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="h-[70vh] min-h-[400px] w-full">
          <iframe
            src={calendarUrl}
            width="100%"
            height="100%"
            className="border-0"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;