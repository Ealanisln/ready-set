"use client";

import React, { useState, useEffect } from "react";

interface ResponsivePdfViewerProps {
  pdfName: string;
  title: string;
}

const ResponsivePdfViewer = ({ pdfName, title }: ResponsivePdfViewerProps) => {
  const [viewerParams, setViewerParams] = useState("view=Fit");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Función para actualizar parámetros basados en el ancho de la pantalla
    const updateViewerParams = () => {
      if (window.innerWidth < 768) {
        // Dispositivos móviles - ajuste completo con un zoom específico para móviles
        setViewerParams("view=Fit&zoom=120");
      } else {
        // Tablets y escritorio - valor de zoom específico
        setViewerParams("zoom=65&view=Fit");
      }
    };
    
    // Configuración inicial
    updateViewerParams();
    
    // Escuchar cambios de tamaño de pantalla
    window.addEventListener("resize", updateViewerParams);
    
    // Limpiar listener al desmontar
    return () => window.removeEventListener("resize", updateViewerParams);
  }, []);
  
  // Manejar el evento de carga del iframe
  const handleIframeLoad = () => {
    setLoading(false);
  };
  
  return (
    <div className="relative h-full w-full">
      {/* Indicador de carga */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-50 z-10 rounded-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      )}
      
      {/* Contenedor del PDF con fondo ámbar claro */}
      <div 
        className="h-full w-full rounded-md overflow-hidden bg-amber-50"
        style={{ backgroundColor: "#FFF8E1" }}
      >
        <iframe
          src={`/pdf/${pdfName}#${viewerParams}`}
          className="h-full w-full border-0 bg-amber-50"
          title={`${title} PDF viewer`}
          onLoad={handleIframeLoad}
          style={{ 
            backgroundColor: "#FFF8E1",
            display: loading ? 'none' : 'block'
          }}
        />
      </div>
      
      {/* Estilos globales para asegurar que el fondo sea consistente */}
      <style jsx global>{`
        /* Estilo global para el contenedor del PDF */
        iframe[title="${title} PDF viewer"] {
          background-color: #FFF8E1 !important;
        }
        
        /* Específico para móviles */
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