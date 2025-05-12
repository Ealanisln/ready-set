'use client';

import { ReactNode, useEffect } from 'react';
import { H } from 'highlight.run';

interface HighlightProviderProps {
  children: ReactNode;
}

const HighlightProvider = ({ children }: HighlightProviderProps) => {
  useEffect(() => {
    // Only initialize in the browser, not during SSR
    if (typeof window !== 'undefined') {
      H.init('kgr0jlng', {
        serviceName: "frontend-app",
        tracingOrigins: true,
        networkRecording: {
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [
            // Block sensitive URLs
            "https://www.googleapis.com/identitytoolkit",
            "https://securetoken.googleapis.com",
          ],
        },
      });
    }
  }, []);

  return <>{children}</>;
};

export default HighlightProvider; 