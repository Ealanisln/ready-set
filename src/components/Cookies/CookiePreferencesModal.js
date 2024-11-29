import React, { useState } from 'react';
import { X } from 'lucide-react';

const CookiePreferencesModal = ({ isOpen, onClose, onSave }) => {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });

  const handleToggle = (category) => {
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSave = () => {
    // Save preferences to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    onSave(preferences);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Manage Cookie Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="necessary" className="text-sm font-medium text-gray-700">
              Necessary Cookies
              <p className="text-xs text-gray-500 mt-1">Always enabled. These are essential for basic site functionality.</p>
            </label>
            <input 
              type="checkbox" 
              id="necessary"
              checked={preferences.necessary}
              onChange={() => handleToggle('necessary')}
              disabled
              className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="analytics" className="text-sm font-medium text-gray-700">
              Analytics Cookies
              <p className="text-xs text-gray-500 mt-1">Help us understand how users interact with our website.</p>
            </label>
            <input 
              type="checkbox" 
              id="analytics"
              checked={preferences.analytics}
              onChange={() => handleToggle('analytics')}
              className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="marketing" className="text-sm font-medium text-gray-700">
              Marketing Cookies
              <p className="text-xs text-gray-500 mt-1">Used to track visitors across websites for personalized advertising.</p>
            </label>
            <input 
              type="checkbox" 
              id="marketing"
              checked={preferences.marketing}
              onChange={() => handleToggle('marketing')}
              className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="personalization" className="text-sm font-medium text-gray-700">
              Personalization Cookies
              <p className="text-xs text-gray-500 mt-1">Help provide a more personalized experience.</p>
            </label>
            <input 
              type="checkbox" 
              id="personalization"
              checked={preferences.personalization}
              onChange={() => handleToggle('personalization')}
              className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferencesModal;