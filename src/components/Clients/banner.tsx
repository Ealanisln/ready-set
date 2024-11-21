"use client";

import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import CookiePreferencesModal from './CookiePreferencesModal'; // Adjust import path as needed

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem('cookieConsentStatus');
    if (!consentStatus) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsentStatus', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    }));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    // Implement the "Reject All" functionality
    localStorage.setItem('cookieConsentStatus', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    }));
    setIsVisible(false);
  };

  const handlePreferences = () => {
    setIsPreferencesModalOpen(true);
  };

  const handlePreferencesSave = (preferences: any) => {
    localStorage.setItem('cookieConsentStatus', 'preferences');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
        <div className="max-w-7xl mx-auto relative">
          <button 
          onClick={handleClose}
          className="absolute -top-2 right-0 text-gray-500 hover:text-gray-700 p-2" 
            aria-label="Close banner"
          >
             <X size={20} />
          </button>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pr-8">
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              We use cookies to enhance your experience, serve personalized ads or content, and analyze traffic. 
              Under the California Consumer Privacy Act (CCPA) and other U.S. privacy laws, you have the right to manage your cookie preferences. 
              By clicking &quot;Accept All,&quot; you consent to our use of cookies. To learn more, read our{' '}
              <Link href="https://support.google.com/analytics/answer/6004245?hl=en" className="text-blue-600 hover:text-blue-800 underline">
                Cookie Policy
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </Link>
            </p>
            <div className="space-x-4 pt-4">
              <button
                onClick={handleAcceptAll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={handlePreferences}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Manage Preferences
              </button>
              <button
                onClick={handleRejectAll}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Reject All
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      <CookiePreferencesModal 
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        onSave={handlePreferencesSave}
      />
    </>
  );
};

export default CookieConsentBanner;