import { motion } from 'framer-motion';
import React from 'react';

interface MobileNavigationProps {
  category: 'CLIENTS' | 'VENDORS' | 'DRIVERS';
  currentIndex: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
}

// Componente de navegación móvil para testimoniales
const MobileNavigation: React.FC<MobileNavigationProps> = React.memo(
  ({ category, currentIndex, totalItems, onPrev, onNext }) => {
    const isMobile = true;
    // No mostrar navegación si hay un solo elemento o no es móvil
    if (totalItems <= 1 || !isMobile) return null;

    return (
      <motion.div
        className="absolute -bottom-8 left-0 z-30 flex w-full justify-center gap-1 md:hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { delay: 0.5, duration: 0.3 } 
        }}
      >
        {/* Botón Anterior */}
        <button
          onClick={onPrev}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent border border-white/15 text-white/80 backdrop-blur-sm transition-all hover:bg-white/5 active:scale-95"
          aria-label={`Ir al testimonio anterior de ${category}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Indicador de posición */}
        <div className="flex items-center text-xs font-medium bg-transparent border border-white/15 px-2 py-0.5 rounded backdrop-blur-sm text-white/80">
          {currentIndex + 1} / {totalItems}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={onNext}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent border border-yellow-400/15 text-yellow-400/80 backdrop-blur-sm transition-all hover:bg-yellow-400/5 active:scale-95"
          aria-label={`Ir al siguiente testimonio de ${category}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </motion.div>
    );
  }
);

export default MobileNavigation;