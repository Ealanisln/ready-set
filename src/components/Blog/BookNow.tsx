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
import { usePathname } from 'next/navigation';

interface AdCardProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink?: string;
  logoSrc?: string;
  blogTitle?: string;
  currentUrl?: string;
}

const BookNow: React.FC<AdCardProps> = ({
  title,
  subtitle,
  ctaText,
  logoSrc = '/images/logo/logo-white.png',
  blogTitle,
  currentUrl
}) => {
  const pathname = usePathname();
  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://readysetllc.com";
  const calendarUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";

  // Lógica de compartir integrada
  useEffect(() => {
    const url = currentUrl || `${baseUrl}${pathname}`;
    const title = blogTitle || document.title || "Check this article";
    
    setShareUrl(url);
    setShareTitle(title);
  }, [currentUrl, blogTitle, pathname, baseUrl]);

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
              priority
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
            <TwitterShareButton
              url={shareUrl}
              title={shareTitle}
              aria-label="Share on Twitter"
            >
              <XIcon size={32} round />
            </TwitterShareButton>

            <FacebookShareButton
              url={shareUrl}
              aria-label="Share on Facebook"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <FacebookMessengerShareButton
              url={shareUrl}
              appId={process.env.NEXT_PUBLIC_FB_APP_ID || ""}
              aria-label="Share via Messenger"
            >
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>

            <TelegramShareButton
              url={shareUrl}
              title={shareTitle}
              aria-label="Share on Telegram"
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>

            <WhatsappShareButton
              url={shareUrl}
              title={shareTitle}
              separator=" - "
              aria-label="Share on WhatsApp"
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            <EmailShareButton
              url={shareUrl}
              subject={shareTitle}
              body="Check this interesting article:"
              aria-label="Share by Email"
            >
              <EmailIcon size={32} round />
            </EmailShareButton>

            <LinkedinShareButton
              url={shareUrl}
              aria-label="Share on LinkedIn"
            >
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNow;