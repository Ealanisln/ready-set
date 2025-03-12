// src/components/Resources/ui/LeadCaptureForm.tsx
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  industry: string;
  newsletterConsent: boolean;
  resourceSlug: string;
  resourceUrl?: string;
  sendEmail: boolean;
}

interface LeadCaptureFormProps {
  resourceSlug: string;
  resourceTitle: string;
  onSuccess?: () => void;
  downloadUrl?: string;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  onSuccess,
  resourceSlug,
  resourceTitle,
  downloadUrl,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const downloadAttempted = useRef(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    industry: "",
    newsletterConsent: true,
    resourceSlug: resourceSlug,
    resourceUrl: downloadUrl,
    sendEmail: true,
  });

  // Update resourceUrl if downloadUrl changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      resourceUrl: downloadUrl,
    }));
  }, [downloadUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Improved download function with better debugging and fallbacks
  const triggerDownload = React.useCallback(() => {
    if (!downloadUrl) {
      console.error("Download URL is missing");
      return;
    }

    try {
      // Method 1: Direct window.open
      window.open(downloadUrl, "_blank");

      // Method 2: Create and click an anchor element (backup)
      setTimeout(() => {
        try {
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";

          // For PDF files
          if (downloadUrl.toLowerCase().endsWith(".pdf")) {
            const filename = downloadUrl.split("/").pop() || "download.pdf";
            link.setAttribute("download", filename);
          }

          document.body.appendChild(link);
          link.click();

          // Clean up
          setTimeout(() => {
            document.body.removeChild(link);
          }, 100);
        } catch (error) {
          console.error("Error in anchor element download method:", error);
        }
      }, 300);

      downloadAttempted.current = true;
    } catch (error) {
      console.error("Error triggering download:", error);
    }
  }, [downloadUrl]);

  // Dedicated effect for download
  useEffect(() => {
    if (isSubmitted && downloadUrl && !downloadAttempted.current) {
      // Try immediately
      triggerDownload();

      // Also try after a delay to ensure browser is ready
      const downloadTimer = setTimeout(() => {
        if (!downloadAttempted.current) {
          triggerDownload();
        }
      }, 800);

      return () => clearTimeout(downloadTimer);
    }
  }, [isSubmitted, downloadUrl, triggerDownload]);

  // Separate useEffect for the onSuccess callback
  useEffect(() => {
    if (isSubmitted) {
      // Delay onSuccess to allow the success message to be shown
      const successTimer = setTimeout(() => {
        onSuccess?.();
      }, 2000);
      return () => clearTimeout(successTimer);
    }
  }, [isSubmitted, onSuccess]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (!isSubmitted) {
        setIsSubmitting(false);
        setError(null);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          industry: "",
          newsletterConsent: true,
          resourceSlug: resourceSlug,
          resourceUrl: downloadUrl,
          sendEmail: true,
        });
      }
    };
  }, [resourceSlug, isSubmitted, downloadUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    downloadAttempted.current = false;

    try {
      // Store the lead in the database
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const textResponse = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setIsSubmitted(true);

      // Try to trigger download immediately after form submission
      if (downloadUrl) {
        setTimeout(() => {
          triggerDownload();
        }, 100);
      }
    } catch (err) {
      console.error("Detailed error:", err);
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
              <label
                htmlFor="newsletterConsent"
                className="text-xs leading-tight text-gray-600"
              >
                We respect your privacy. Ready Set uses your information to send
                you updates, relevant content, and promotional offers. You can{" "}
                <a
                  href="/unsubscribe"
                  className="text-blue-600 hover:underline"
                >
                  unsubscribe{" "}
                </a>{" "}
                from these communications at any time. For more details, please
                review our{" "}
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
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
