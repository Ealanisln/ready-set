"use client";

import { useEffect } from "react";

interface ScrollToSectionProps {
  targetId?: string;
}

export default function ScrollToSection({ targetId }: ScrollToSectionProps) {
  useEffect(() => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Default behavior: scroll to top
      window.document.scrollingElement?.scrollTo(0, 0);
    }
  }, [targetId]);

  return null;
}