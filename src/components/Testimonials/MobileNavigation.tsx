import { motion } from 'framer-motion';
import React, { useCallback } from 'react';

interface MobileNavigationProps {
  category: 'CLIENTS' | 'VENDORS' | 'DRIVERS';
  currentIndex: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = React.memo(
  ({ category, currentIndex, totalItems, onPrev, onNext }) => {
    // Handlers con useCallback
    const handlePrev = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onPrev();
      console.log(`Navegando al anterior desde índice ${currentIndex}`);
    }, [onPrev, currentIndex]);

    const handleNext = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onNext();
      console.log(`Navegando al siguiente desde índice ${currentIndex}`);
    }, [onNext, currentIndex]);

    // No renderizar si solo hay un item
    if (totalItems <= 1) return null;

    return (
      <motion.div
        className="absolute -bottom-8 left-0 z-30 flex w-full justify-center gap-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { delay: 0.5, duration: 0.3 } 
        }}
      >
        {/* Botón Anterior */}
        <button
          onClick={handlePrev}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 border border-white/15 text-white/80 backdrop-blur-sm transition-all hover:bg-white/5 active:scale-95 touch-action-manipulation"
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
        <div className="flex items-center text-xs font-medium bg-black/40 border border-white/15 px-2 py-0.5 rounded backdrop-blur-sm text-white/80">
          {currentIndex + 1} / {totalItems}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={handleNext}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 border border-yellow-400/15 text-yellow-400/80 backdrop-blur-sm transition-all hover:bg-yellow-400/5 active:scale-95 touch-action-manipulation"
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

MobileNavigation.displayName = 'MobileNavigation';

export default MobileNavigation;