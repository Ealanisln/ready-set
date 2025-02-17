// components/CookiePreferencesModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import type { CookiePreferences } from "@/types/cookies";

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
}

const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('cookiePreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading cookie preferences:', error);
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  const handlePreferenceChange = (
    key: keyof CookiePreferences, 
    checked: boolean
  ): void => {
    setPreferences(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Cookie Preferences</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between space-x-4">
            <div>
              <h4 className="font-medium">Necessary Cookies</h4>
              <p className="text-sm text-gray-500">Required for the website to function</p>
            </div>
            <Switch 
              checked={preferences.necessary} 
              disabled 
              onCheckedChange={() => {}}
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div>
              <h4 className="font-medium">Analytics Cookies</h4>
              <p className="text-sm text-gray-500">Help us improve our website</p>
            </div>
            <Switch 
              checked={preferences.analytics}
              onCheckedChange={(checked: boolean) => 
                handlePreferenceChange('analytics', checked)
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div>
              <h4 className="font-medium">Marketing Cookies</h4>
              <p className="text-sm text-gray-500">Used for targeted advertising</p>
            </div>
            <Switch 
              checked={preferences.marketing}
              onCheckedChange={(checked: boolean) => 
                handlePreferenceChange('marketing', checked)
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div>
              <h4 className="font-medium">Personalization Cookies</h4>
              <p className="text-sm text-gray-500">Remember your preferences</p>
            </div>
            <Switch 
              checked={preferences.personalization}
              onCheckedChange={(checked: boolean) => 
                handlePreferenceChange('personalization', checked)
              }
            />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferencesModal;