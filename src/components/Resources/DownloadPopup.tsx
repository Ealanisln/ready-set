import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  industry: string;
  newsletterConsent: boolean;
}

interface LeadCaptureFormProps {
  onSuccess?: () => void;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    industry: "",
    newsletterConsent: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsSubmitted(true);
      onSuccess?.(); // Call the success callback to trigger download
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isSubmitted) {
    return (
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 w-32">
          <img 
              src="/images/logo/new-logo-ready-set.png"
              alt="Company Logo" 
              className="w-full h-auto"
            />
          </div>
          <CardTitle className="mb-2 text-3xl font-bold">
            Thank you for signing up!
          </CardTitle>
          <p className="text-lg text-gray-600">
            Your guide is downloading now...
          </p>
        </CardHeader>
        <CardContent>
          <p className="mt-4 text-center text-gray-500">
            We've also sent a copy to your email. If you don't see it, please check your spam folder.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-6 w-32">
        <img 
              src="/images/logo/new-logo-ready-set.png"
              alt="Company Logo" 
              className="w-full h-auto"
            />
        </div>
        <CardTitle className="text-2xl font-bold">
          Get Your Free Guide!
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 text-sm text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                placeholder="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="newsletterConsent"
                checked={formData.newsletterConsent}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, newsletterConsent: !!checked }))
                }
              />
              <label
                htmlFor="newsletterConsent"
                className="text-sm leading-none text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to receive newsletters, updates, and promotional emails
                from Ready Set. I can unsubscribe at any time.
              </label>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Download Guide'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadCaptureForm;