'use client';

import React from 'react';
import Image from 'next/image';
import { PhoneCall } from "lucide-react";
import Link from 'next/link';
import AppointmentDialog from '../VirtualAssistant/Appointment';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';

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
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = "Save 78% on Hiring Costs with a Virtual Assistant";

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

        {/* AppointmentDialog */}
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
          <h3 className="text-gray-600 mb-4 text-lg italic">Share this offer</h3>
          <div className="flex justify-center space-x-4">
            <FacebookShareButton url={shareUrl} title={shareTitle}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>

            <LinkedinShareButton url={shareUrl} title={shareTitle}>
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>

            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>


            <EmailShareButton url={shareUrl} subject={shareTitle}>
              <EmailIcon size={40} round />
            </EmailShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNow;