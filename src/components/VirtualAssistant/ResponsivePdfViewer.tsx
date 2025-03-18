import React, { useState, useEffect } from "react";

const ResponsivePdfViewer = ({ pdfName, title }: { pdfName: string; title: string }) => {
  const [viewerParams, setViewerParams] = useState("view=Fit");
  
  useEffect(() => {
    // Función para actualizar parámetros basados en el ancho de la pantalla
    const updateViewerParams = () => {
      if (window.innerWidth < 768) {
        // Dispositivos móviles - ajuste completo sin zoom específico
        setViewerParams("view=Fit");
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
  
  return (
    <iframe
      src={`/pdf/${pdfName}#${viewerParams}`}
      className="h-full w-full rounded-md border-0"
      title={`${title} PDF viewer`}
    />
  );
};

export default ResponsivePdfViewer;