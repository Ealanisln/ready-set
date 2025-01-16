import React from 'react';
import Image from 'next/image';
import { PhoneCall } from "lucide-react";
import Link from 'next/link';
import AppointmentDialog from '../VirtualAssistant/Appointment';

interface AdCardProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  logoSrc?: string;
}

const BookNow: React.FC<AdCardProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink = '/booking-page',
  logoSrc = '/images/logo/logo-white.png'
}) => {
  const calendarUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-16">
            <Image
              src={logoSrc}
              alt="Company logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
            Save 78% on Hiring Costs with a Virtual Assistant.
          </h2>
          <p className="text-gray-600 font-bold">
            Save More. Gain Time. Book a Call Today.
          </p>
        </div>

        {/* AppointmentDialog en lugar del CTA Button anterior */}
        <div className="flex justify-center">
          <AppointmentDialog
            buttonText="Book Now"
            buttonIcon={<PhoneCall size={20} />}
            buttonVariant="amber"
            buttonClassName="font-bold"
            dialogTitle="Schedule Your Free Consultation"
            dialogDescription="Choose a time that works best for you to discuss how we can help you save on hiring costs."
            calendarUrl={calendarUrl}
          />
        </div>

        {/* Social Share Section */}
        <div className="pt-8 mt-8 border-t border-gray-200">
          <h3 className="text-gray-600 mb-4 text-lg italic">Share this article</h3>
          <div className="flex justify-center space-x-4">
            <SocialIcon href="#" network="facebook" />
            <SocialIcon href="#" network="instagram" />
            <SocialIcon href="#" network="linkedin" />
            <SocialIcon href="#" network="tumblr" />
            <SocialIcon href="#" network="link" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Social Icon Component
interface SocialIconProps {
  href: string;
  network: 'facebook' | 'instagram' | 'linkedin' | 'tumblr' | 'link';
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, network }) => {
  return (
    <Link 
      href={href}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
    >
      <span className="sr-only">Share on {network}</span>
      <div className="w-5 h-5 text-gray-600">
        {/* You can replace these with actual icons */}
        {network === 'link' && (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )}
      </div>
    </Link>
  );
};

export default BookNow;