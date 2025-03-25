"use client";

import React, { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ResponsivePdfViewerProps {
  pdfName: string;
  title: string;
}

const ResponsivePdfViewer = ({ pdfName, title }: ResponsivePdfViewerProps) => {
  const [baseZoom, setBaseZoom] = useState(65); // Starting zoom level
  const [currentZoom, setCurrentZoom] = useState(65);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Calculate the appropriate base zoom based on screen size
  useEffect(() => {
    const updateBaseZoom = () => {
      if (window.innerWidth < 768) {
        setBaseZoom(120); // Mobile default
      } else {
        setBaseZoom(65); // Desktop default
      }
    };
    
    updateBaseZoom();
    setCurrentZoom(window.innerWidth < 768 ? 120 : 65);
    
    window.addEventListener("resize", updateBaseZoom);
    return () => window.removeEventListener("resize", updateBaseZoom);
  }, []);

  // Generate the view parameters with current zoom
  const getViewParams = () => {
    return `view=Fit&zoom=${currentZoom}`;
  };
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
  };
  
  // Zoom in function - increase by 20%
  const zoomIn = () => {
    const newZoom = Math.min(currentZoom + 20, 300); // Max zoom 300%
    setCurrentZoom(newZoom);
    refreshIframe(newZoom);
  };
  
  // Zoom out function - decrease by 20%
  const zoomOut = () => {
    const newZoom = Math.max(currentZoom - 20, 20); // Min zoom 20%
    setCurrentZoom(newZoom);
    refreshIframe(newZoom);
  };
  
  // Reset zoom to base level
  const resetZoom = () => {
    setCurrentZoom(baseZoom);
    refreshIframe(baseZoom);
  };
  
  // Refresh the iframe with new zoom level
  const refreshIframe = (zoom: number) => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.src = `/pdf/${pdfName}#view=Fit&zoom=${zoom}`;
    }
  };
  
  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Zoom controls */}
      <div className="flex items-center justify-end mb-2 gap-2 p-2 bg-amber-100 rounded-t-md">
        <span className="text-sm font-medium mr-2">Zoom: {currentZoom}%</span>
        <button 
          onClick={zoomOut}
          className="p-1 rounded-full bg-white hover:bg-amber-200 transition-colors"
          disabled={currentZoom <= 20}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5 text-amber-900" />
        </button>
        <button 
          onClick={resetZoom}
          className="p-1 rounded-full bg-white hover:bg-amber-200 transition-colors"
          aria-label="Reset zoom"
        >
          <RotateCcw className="h-5 w-5 text-amber-900" />
        </button>
        <button 
          onClick={zoomIn}
          className="p-1 rounded-full bg-white hover:bg-amber-200 transition-colors"
          disabled={currentZoom >= 300}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5 text-amber-900" />
        </button>
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-50 z-10 rounded-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      )}
      
      {/* PDF container */}
      <div 
        className="flex-1 w-full rounded-b-md overflow-hidden bg-amber-50"
        style={{ backgroundColor: "#FFF8E1" }}
      >
        <iframe
          ref={iframeRef}
          src={`/pdf/${pdfName}#${getViewParams()}`}
          className="h-full w-full border-0 bg-amber-50"
          title={`${title} PDF viewer`}
          onLoad={handleIframeLoad}
          style={{ 
            backgroundColor: "#FFF8E1",
            display: loading ? 'none' : 'block'
          }}
        />
      </div>
      
      {/* Styles */}
      <style jsx global>{`
        iframe[title="${title} PDF viewer"] {
          background-color: #FFF8E1 !important;
        }
        
        @media (max-width: 767px) {
          iframe[title="${title} PDF viewer"] {
            background-color: #FFF8E1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResponsivePdfViewer;