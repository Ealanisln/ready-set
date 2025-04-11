"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  defaultPath?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  className = "",
  defaultPath = "/"
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(defaultPath);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`flex items-center gap-2 hover:bg-accent ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}; 