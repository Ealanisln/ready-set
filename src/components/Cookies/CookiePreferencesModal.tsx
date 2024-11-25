"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
}

const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true and disabled
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    if (isOpen) {
      // Load saved preferences when modal opens
      const savedPreferences = localStorage.getItem('cookiePreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, [isOpen]);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Prevent toggling necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Cookie Preferences</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Necessary Cookies */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Necessary Cookies</h3>
                <p className="text-sm text-gray-600">
                  These cookies are required for the website to function properly.
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Analytics Cookies</h3>
                <p className="text-sm text-gray-600">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => handleToggle('analytics')}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Marketing Cookies</h3>
                <p className="text-sm text-gray-600">
                  Used to deliver personalized advertisements.
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => handleToggle('marketing')}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Personalization Cookies */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Personalization Cookies</h3>
                <p className="text-sm text-gray-600">
                  Enable personalized features and content.
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.personalization}
                  onChange={() => handleToggle('personalization')}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferencesModal;