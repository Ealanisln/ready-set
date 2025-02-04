'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { PhoneCall } from "lucide-react";
import Link from 'next/link';
import AppointmentDialog from '../VirtualAssistant/Appointment';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  EmailShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookMessengerShareButton,
  FacebookIcon,
  LinkedinIcon,
  XIcon,
  EmailIcon,
  WhatsappIcon,
  TelegramIcon,
  FacebookMessengerIcon,
} from 'react-share';

interface AdCardProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  logoSrc?: string;
  blogTitle?: string;
  currentUrl?: string;
}

const BookNow: React.FC<AdCardProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink = '/booking-page',
  logoSrc = '/images/logo/logo-white.png',
  blogTitle,
  currentUrl
}) => {
  const [url, setUrl] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const calendarUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(currentUrl || window.location.href);
      setPageTitle(blogTitle || document.title || title);
    }
  }, [currentUrl, blogTitle, title]);

  const shareUrl = url || '';
  const shareTitle = pageTitle || "Save 78% on Hiring Costs with a Virtual Assistant";

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
          <h3 className="text-gray-600 mb-4 text-lg italic">Share this article</h3>
          <div className="flex justify-center space-x-4">
            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <XIcon size={32} round />
            </TwitterShareButton>

            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <FacebookMessengerShareButton url={shareUrl} appId="521270401588372">
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>

            <TelegramShareButton url={shareUrl} title={shareTitle}>
              <TelegramIcon size={32} round />
            </TelegramShareButton>

            <WhatsappShareButton url={shareUrl} title={shareTitle} separator=":: ">
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            <EmailShareButton url={shareUrl} subject={shareTitle} body="Mira este articulo, me pareció interesante:">
              <EmailIcon size={32} round />
            </EmailShareButton>

            <LinkedinShareButton url={shareUrl}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNow;