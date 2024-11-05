// src/components/VirtualAssistant/Appointment.tsx

import Link from "next/link";
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
}

export const CustomButton: React.FC<ButtonProps> = ({
  href,
  children,
  onClick,
  icon,
}) => {
  const buttonClass =
    "text-white text-lg font-medium py-4 px-8 rounded-full transition duration-300 ease-in-out bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center";

  const content = (
    <>
      {children}
      {icon && <span className="ml-1.5">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <button className={buttonClass}>{content}</button>
      </Link>
    );
  } else {
    return (
      <button className={buttonClass} onClick={onClick}>
        {content}
      </button>
    );
  }
};

const AppointmentDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton icon={<PhoneCall size={16} />}>
          Book a Discovery call
        </CustomButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] md:max-w-[75%] lg:max-w-[90%]">
        <DialogHeader>
          <DialogTitle>Reservar una Cita</DialogTitle>
          <DialogDescription>
            Elige un horario adecuado para tu cita.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[70vh] min-h-[400px] w-full">
          <iframe
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3UnNtdbGuwqDc9-InHC8YY2i2OjO9IHwYSdH79vz1TSPfWWe-fSDP5Gk1idbTbnttIJ-rqGGyP?gv=true"
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
