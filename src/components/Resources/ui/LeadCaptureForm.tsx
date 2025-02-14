import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { resources } from "@/components/Resources/Data/Resources";
import { generateSlug } from "@/lib/create-slug";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  industry: string;
  newsletterConsent: boolean;
  resourceSlug: string;
}

interface LeadCaptureFormProps {
  onSuccess?: () => void;
  resourceSlug: string;
  resourceTitle?: string;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  onSuccess,
  resourceSlug,
  resourceTitle,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    industry: "",
    newsletterConsent: false,
    resourceSlug: resourceSlug,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const triggerDownload = React.useCallback(() => {
    const resource = resources.find(
      (r) => generateSlug(r.title) === resourceSlug,
    );
    if (resource?.downloadUrl) {
      const link = document.createElement("a");
      link.href = resource.downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [resourceSlug]);

  useEffect(() => {
    if (isSubmitted) {
      triggerDownload();
      // Delay onSuccess to allow the success message to be shown
      const timer = setTimeout(() => {
        onSuccess?.();
      }, 2000); // Increased timeout to give users time to see the success message
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, triggerDownload, onSuccess]);

  // Add a separate effect for cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Only reset if not in submitted state
      if (!isSubmitted) {
        setIsSubmitting(false);
        setError(null);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          industry: "",
          newsletterConsent: false,
          resourceSlug: resourceSlug,
        });
      }
    };
  }, [resourceSlug, isSubmitted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit form");
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isSubmitted) {
    return (
      <Card className="w-full bg-white">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-24">
            <img
              src="/images/logo/new-logo-ready-set.png"
              alt="Company Logo"
              className="h-auto w-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Thank you for signing up!
          </CardTitle>
          <p className="text-base text-gray-600">
            Your guide is downloading now...
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-center text-sm text-gray-500">
            We've also sent a copy to your email. If you don't see it, please
            check your spam folder.
          </p>
          <div className="mt-6 text-center">
            <Button
              onClick={triggerDownload}
              variant="outline"
              className="text-sm"
            >
              Download again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-24">
          <img
            src="/images/logo/new-logo-ready-set.png"
            alt="Company Logo"
            className="h-auto w-full"
          />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 md:text-2xl">
          {resourceTitle
            ? `Get Your Free ${resourceTitle}!`
            : "Get Your Free Guide!"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Input
              placeholder="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="h-10 bg-gray-50"
              required
            />
            <Input
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="h-10 bg-gray-50"
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="h-10 bg-gray-50"
              required
            />
            <Input
              placeholder="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="h-10 bg-gray-50"
              required
            />
            <div className="flex items-start space-x-2 pt-2">
              {/* <Checkbox
                id="newsletterConsent"
                checked={formData.newsletterConsent}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    newsletterConsent: !!checked,
                  }))
                }
              /> */}
            <label
                htmlFor="newsletterConsent"
                className="text-xs leading-tight text-gray-600"
              >
                We respect your privacy. Ready Set uses your information to send you updates,
                relevant content, and promotional offers. You can unsubscribe from these
                communications at any time. For more details, please review our{" "}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
          </div>
          <Button
            type="submit"
            className="hover:bg-yelllow-700 mt-6 w-full bg-yellow-500 py-2 font-medium text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Download Guide"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadCaptureForm;
