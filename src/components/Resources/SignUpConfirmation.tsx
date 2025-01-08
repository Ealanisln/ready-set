// app/components/ConfirmationCard.tsx
import Image from 'next/image';

interface ConfirmationCardProps {
  title?: string;
  subtitle?: string;
  note?: string;
}

const ConfirmationCard = ({
  title = "Thank you for signing up!",
  subtitle = "Your free guide is on its way to your email.",
  note = "Kindly check your inbox for an email from us, and if it isn't there, please check your spam or junk folder."
}: ConfirmationCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-[2.5rem] shadow-lg max-w-xl w-full p-12 text-center relative">
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Ready Set Logo"
            width={120}
            height={40}
            className="mx-auto"
          />
        </div>
        
        <h1 className="text-4xl font-semibold text-gray-700 mb-4">
          {title}
        </h1>
        
        <h2 className="text-2xl text-gray-600 mb-8">
          {subtitle}
        </h2>
        
        <div className="text-gray-500">
          <span className="font-medium">Note: </span>
          {note}
        </div>
      </div>
    </div>
  );
};