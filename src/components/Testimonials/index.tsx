// src/components/Testimonials/index.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import page from './page';

const Testimonials = () => {
  interface Testimonial {
    category: 'CLIENTS' | 'VENDORS' | 'DRIVERS';
    name: string;
    role: string;
    text: string;
    image?: string;
  }

  // Estado para controlar qué testimonio está activo en cada categoría
  const [activeIndices, setActiveIndices] = useState({
    CLIENTS: 0,
    VENDORS: 0,
    DRIVERS: 0,
  });

  // Estado para controlar si el autoplay está pausado
  const [isPaused, setIsPaused] = useState({
    CLIENTS: false,
    VENDORS: false,
    DRIVERS: false,
  });

  // Estado para controlar categoría activa en móvil
  const [activeMobileCategory, setActiveMobileCategory] = useState<
    'CLIENTS' | 'VENDORS' | 'DRIVERS'
  >('CLIENTS');

  // Estado para detectar si estamos en el navegador
  const [isBrowser, setIsBrowser] = useState(false);

  // Estado para detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(false);

  // Estado para controlar si hay contenido que desborda - Memoizado para evitar re-renders
  const [hasOverflow, setHasOverflow] = useState<{
    CLIENTS: boolean[];
    VENDORS: boolean[];
    DRIVERS: boolean[];
  }>({
    CLIENTS: [],
    VENDORS: [],
    DRIVERS: [],
  });

  // Añade este efecto después de declarar todos tus estados
  useEffect(() => {
    // Este código solo se ejecuta en el cliente
    setIsBrowser(true);
    setIsMobile(window.innerWidth < 768);

    // Agregar listener para detectar cambios en el tamaño de ventana
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Refs para los contenedores de testimonios
  const cardRefs = useRef<{ [key: string]: (HTMLDivElement | null)[] }>({
    CLIENTS: [],
    VENDORS: [],
    DRIVERS: [],
  });

  // Cache para imagenes precargadas
  const preloadedImages = useRef<Set<string>>(new Set());

  // Ahora el useMemo para agrupar testimonials solo se recalculará si cambia la referencia a testimonials
  const groupedTestimonials = useMemo(() => {
    return page.reduce(
      (acc, page) => {
        const category = page.category as keyof typeof acc;
        acc[category] = acc[category] || [];
        acc[category].push(page as Testimonial);
        return acc;
      },
      {} as Record<Testimonial['category'], Testimonial[]>,
    );
  }, []); // Esta dependencia ahora viene del import

  const checkContentOverflow = useCallback(() => {
    // Limitar la frecuencia de actualización del estado para evitar re-renders excesivos
    if ((window as any).overflowThrottleTimeout) {
      clearTimeout((window as any).overflowThrottleTimeout);
    }

    (window as any).overflowThrottleTimeout = setTimeout(() => {
      const newHasOverflow = { ...hasOverflow };

      Object.keys(groupedTestimonials).forEach((category) => {
        const categoryKey = category as 'CLIENTS' | 'VENDORS' | 'DRIVERS';
        const items = groupedTestimonials[categoryKey] || [];

        if (!cardRefs.current[categoryKey]) {
          cardRefs.current[categoryKey] = [];
        }

        items.forEach((_, index) => {
          const element = cardRefs.current[categoryKey][index];
          if (element) {
            const hasContentOverflow = element.scrollHeight > element.clientHeight;

            // Inicializar el array si no existe
            if (!newHasOverflow[categoryKey]) {
              newHasOverflow[categoryKey] = [];
            }

            // Asignar el valor de overflow sólo si cambia
            if (newHasOverflow[categoryKey][index] !== hasContentOverflow) {
              newHasOverflow[categoryKey][index] = hasContentOverflow;
            }
          }
        });
      });

      // Sólo actualizar el estado si hay cambios reales
      const hasChanged = JSON.stringify(newHasOverflow) !== JSON.stringify(hasOverflow);
      if (hasChanged) {
        setHasOverflow(newHasOverflow);
      }
    }, 300);
  }, [groupedTestimonials, hasOverflow]);

  // Revisar si hay overflow en cada testimonio activo
  useEffect(() => {
    // Verificar el overflow si estamos en el navegador
    if (isBrowser) {
      // Revisar después de un breve retraso para asegurarnos de que el contenido está renderizado
      const timeoutId = setTimeout(checkContentOverflow, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [groupedTestimonials, isBrowser, activeIndices, activeMobileCategory, checkContentOverflow]);

  // Funciones para controlar la navegación
  const nextTestimonial = useCallback(
    (category: 'CLIENTS' | 'VENDORS' | 'DRIVERS') => {
      const items = groupedTestimonials[category] || [];
      if (items.length === 0) return;

      setActiveIndices((prev) => ({
        ...prev,
        [category]: (prev[category] + 1) % items.length,
      }));
    },
    [groupedTestimonials, setActiveIndices],
  );

  const prevTestimonial = useCallback(
    (category: 'CLIENTS' | 'VENDORS' | 'DRIVERS') => {
      const items = groupedTestimonials[category] || [];
      if (items.length === 0) return;

      setActiveIndices((prev) => ({
        ...prev,
        [category]: (prev[category] - 1 + items.length) % items.length,
      }));
    },
    [groupedTestimonials, setActiveIndices],
  );

  // Usar requestAnimationFrame en lugar de setInterval para mejor rendimiento y evitar parpadeos
  useEffect(() => {
    let animationFrameIds: number[] = [];
    let lastTimestamps: Record<string, number> = {};

    // Función que coordina todas las animaciones
    const animate = (timestamp: number) => {
      // Procesar cada categoría
      Object.keys(groupedTestimonials).forEach((category) => {
        const categoryKey = category as 'CLIENTS' | 'VENDORS' | 'DRIVERS';

        // Inicializar timestamp si es necesario
        if (!lastTimestamps[categoryKey]) {
          lastTimestamps[categoryKey] = timestamp;
        }

        // Calcular tiempo transcurrido desde último cambio
        const elapsed = timestamp - lastTimestamps[categoryKey];

        // Cambiar cada 10 segundos (10000ms) si no está pausado
        // Tiempo más largo para reducir cambios y posibles parpadeos
        if (elapsed > 10000 && !isPaused[categoryKey]) {
          nextTestimonial(categoryKey);
          lastTimestamps[categoryKey] = timestamp;
        }
      });

      // Continuar la animación
      const id = requestAnimationFrame(animate);
      animationFrameIds.push(id);
    };

    // Iniciar la animación
    const id = requestAnimationFrame(animate);
    animationFrameIds.push(id);

    // Limpieza al desmontar
    return () => {
      animationFrameIds.forEach((id) => cancelAnimationFrame(id));
    };
  }, [isPaused, groupedTestimonials, nextTestimonial]);

  // Componente de estrellas memoizado para evitar re-renders
  const StarRating = React.memo(
    ({ count = 5, position = 'right' }: { count?: number; position?: 'right' | 'left' }) => (
      <div
        className={`-mt-2 flex rounded-md bg-white px-0 py-0 sm:mt-0 ${position === 'left' ? 'justify-end' : 'justify-start'}`}
      >
        {[...Array(count)].map((_, i) => (
          <svg
            key={i}
            className="h-8 w-8 text-yellow-400 sm:h-7 sm:w-7"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    ),
  );

  // Componente de flecha para indicar scroll mejorado
  const ScrollArrow = React.memo(() => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

    // Referencia para el elemento contenedor actual
    const arrowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Encontrar el elemento padre con scroll (el card)
      if (arrowRef.current) {
        let parent = arrowRef.current.parentElement;

        // Buscar el primer padre con overflow auto o scroll
        while (parent && !['auto', 'scroll'].includes(getComputedStyle(parent).overflowY)) {
          parent = parent.parentElement;
        }

        setScrollElement(parent);

        // Establecer el desplazamiento máximo disponible
        if (parent) {
          setMaxScroll(parent.scrollHeight - parent.clientHeight);
        }
      }
    }, []);

    useEffect(() => {
      if (!scrollElement) return;

      // Función para manejar el evento de scroll
      const handleScroll = () => {
        // Obtener posición actual de scroll
        const currentPosition = scrollElement.scrollTop;
        setScrollPosition(currentPosition);

        // Actualizar máximo scroll (puede cambiar si el contenido cambia)
        setMaxScroll(scrollElement.scrollHeight - scrollElement.clientHeight);
      };

      // Ejecutar una vez al inicio para verificar el estado inicial
      handleScroll();

      // Agregar el event listener
      scrollElement.addEventListener('scroll', handleScroll);

      // Limpiar el event listener cuando el componente se desmonte
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
      };
    }, [scrollElement]);

    // Calcular la posición dinámica y opacidad de la flecha
    const arrowPosition = Math.min(80, 20 + (scrollPosition / maxScroll) * 60);
    const arrowOpacity = maxScroll > 0 ? 1 - (scrollPosition / maxScroll) * 1.3 : 0;

    return (
      <div
        ref={arrowRef}
        className={`absolute left-1/2 -translate-x-1/2 transform transition-all duration-200`}
        style={{
          bottom: `${arrowPosition}px`,
          opacity: Math.max(0, arrowOpacity),
          visibility: arrowOpacity <= 0.1 ? 'hidden' : 'visible',
        }}
      >
        <div className={`animate-bounce`}>
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  });

  // Componente de imagen de perfil con carga estática para evitar parpadeos
  const ProfileImage = React.memo(({ imageSrc, alt }: { imageSrc?: string; alt: string }) => {
    // Simplificar la lógica de manejo de imágenes y usar placeholders de manera consistente
    // Esto evita que el componente cambie de estado y cause re-renders

    return (
      <div className="z-10 h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow-lg sm:h-20 sm:w-20">
        {/* Precargar imagen con visibilidad oculta para verificar si carga correctamente */}
        {imageSrc && (
          <div className="relative h-full w-full">
            {/* Usar estilos inline para evitar cambios de DOM que causen parpadeo */}
            <div
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
              }}
              aria-label={alt}
            />

            {/* Imagen de respaldo que solo se muestra si la otra falla */}
            <div
              className="fallback-image"
              style={{
                backgroundImage: `url(/api/placeholder/80/80)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
              }}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Si no hay imagen, mostrar placeholder */}
        {!imageSrc && (
          <div
            style={{
              backgroundImage: `url(/api/placeholder/80/80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}
            aria-label={alt}
          />
        )}
      </div>
    );
  });

  // Selector de categoría para móviles memoizado
  const CategorySelector = React.memo(() => (
    <div className="my-6 flex flex-wrap justify-center gap-2 md:hidden">
      {Object.keys(groupedTestimonials).map((category) => (
        <button
          key={category}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === activeMobileCategory
              ? 'bg-black text-white'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
          onClick={() => setActiveMobileCategory(category as 'CLIENTS' | 'VENDORS' | 'DRIVERS')}
        >
          {category}
        </button>
      ))}
    </div>
  ));

  // Si no estamos en el navegador, renderizamos un contenedor vacío
  if (!isBrowser) {
    return (
      <div className="rounded-lg border border-black bg-white px-4 py-10">
        Loading Testimonials...
      </div>
    );
  }

  return (
    <section
      id="testimonials"
      className="w-full rounded-none border-x-0 border-b-0 border-t border-black bg-white px-0 py-10 sm:py-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Updated header section with dotted lines extending from title */}
        <div className="relative mb-8 text-center sm:mb-12">
          <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">
            What People Say About Us
          </h2>

          {/* Real Stories. Real Impact with dotted lines extending from both sides */}
          <div className="mb-6 flex items-center justify-center sm:mb-8">
            <div className="relative flex w-full items-center justify-center">
              {/* Left dotted line */}
              <div className="absolute right-1/2 mr-4 w-1/4 border-t-2 border-dashed border-black sm:w-1/2"></div>

              {/* Text in the middle */}
              <p className="relative z-10 bg-white px-4 text-lg text-black sm:text-xl">
                Real Stories. Real Impact
              </p>

              {/* Right dotted line */}
              <div className="absolute left-1/2 ml-4 w-1/4 border-t-2 border-dashed border-black sm:w-1/2"></div>
            </div>
          </div>

          <p className="mx-auto max-w-2xl text-sm text-black sm:text-base">
            See how Ready Set is making a difference for our clients, vendors, and drivers
          </p>
        </div>

        {/* Selector de categoría para móviles */}
        <CategorySelector />

        {/* Espacio adicional entre selector y contenido en móvil */}
        <div className="h-4 md:h-0"></div>

        {/* Grid de tres columnas en desktop, una columna en móvil */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {Object.entries(groupedTestimonials).map(([category, items]) => {
            // En móvil, solo mostrar la categoría activa
            const isCategoryVisible = !isMobile || category === activeMobileCategory;

            return (
              <div
                key={category}
                className={`relative transition-all duration-300 ${
                  isCategoryVisible ? 'block' : 'hidden md:block'
                }`}
              >
                {/* Contenedor con borde punteado */}
                <div className="relative border-2 border-dotted border-black p-4 pb-6 pt-10 sm:p-6 sm:pt-12">
                  {/* Título de categoría */}
                  <div className="absolute -top-5 left-0 w-full text-center">
                    <h3 className="inline-block bg-white px-4 text-xl font-bold text-black sm:px-6 sm:text-2xl">
                      {category}
                    </h3>
                  </div>

                  {/* Subtítulo */}
                  <div className="-mt-6 mb-14 text-center sm:-mt-9 sm:mb-16">
                    <p className="text-xs text-black sm:text-sm">
                      {category === 'CLIENTS' && 'Why Our Clients Love Us'}
                      {category === 'VENDORS' && 'Trusted Partners for Seamless Operations'}
                      {category === 'DRIVERS' && 'Our Drivers, Our Heroes'}
                    </p>
                  </div>

                  {/* Carrusel manual */}
                  <div
                    className="relative h-[350px] sm:h-[450px]"
                    onMouseEnter={() => setIsPaused({ ...isPaused, [category]: true })}
                    onMouseLeave={() => setIsPaused({ ...isPaused, [category]: false })}
                    onTouchStart={() => setIsPaused({ ...isPaused, [category]: true })}
                    onTouchEnd={() =>
                      setTimeout(() => setIsPaused({ ...isPaused, [category]: false }), 5000)
                    }
                  >
                    {/* Indicadores de página */}
                    <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
                      {items.map((_, idx: number) => (
                        <button
                          key={idx}
                          className={`h-2 w-2 rounded-full transition-colors sm:h-3 sm:w-3 ${
                            idx === activeIndices[category as keyof typeof activeIndices]
                              ? 'bg-yellow-400'
                              : 'bg-gray-300'
                          }`}
                          onClick={() => setActiveIndices({ ...activeIndices, [category]: idx })}
                          aria-label={`Go to testimonial ${idx + 1}`}
                        />
                      ))}
                    </div>

                    {/* Contenedor con animación usando Motion */}
                    <div className="h-full">
                      <AnimatePresence mode="wait">
                        {items.map((testimonial, index) => {
                          const isActive =
                            index === activeIndices[category as keyof typeof activeIndices];
                          // Alternar el layout en móvil para consistencia
                          const layoutStyle = isMobile ? index % 2 === 0 : index % 2 === 0;

                          // Verificar si este testimonio tiene overflow
                          const cardHasOverflow =
                            hasOverflow[category as keyof typeof hasOverflow]?.[index];

                          // Solo mostramos el testimonio activo para la animación
                          if (!isActive) return null;

                          return (
                            <motion.div
                              key={`${category}-${index}`}
                              className="absolute inset-0"
                              initial={{
                                opacity: 0,
                                x: layoutStyle ? -30 : 30,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                transition: {
                                  duration: 0.4,
                                  ease: 'easeOut',
                                },
                              }}
                              exit={{
                                opacity: 0,
                                x: layoutStyle ? 30 : -30,
                                transition: {
                                  duration: 0.3,
                                  ease: 'easeIn',
                                },
                              }}
                              style={{
                                willChange: 'transform, opacity',
                              }}
                            >
                              <div className="relative h-full pt-6">
                                {layoutStyle ? (
                                  // Left-aligned card (odd indices - first card)
                                  <>
                                    {/* Profile Image - Left positioned - Más pegada al card en móvil */}
                                    <motion.div
                                      className="absolute -top-4 left-4 z-10 sm:-top-8 sm:left-8"
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{
                                        scale: 1,
                                        opacity: 1,
                                        transition: { delay: 0.2, duration: 0.3 },
                                      }}
                                    >
                                      <ProfileImage
                                        imageSrc={testimonial.image}
                                        alt={testimonial.name}
                                      />
                                    </motion.div>

                                    {/* Star Rating - Reposicionado en móvil (más abajo) */}
                                    <motion.div
                                      className="absolute left-1/2 top-2 z-20 -translate-x-1/2 transform sm:-top-4 sm:left-[60%] sm:-translate-x-1/2"
                                      initial={{ y: -10, opacity: 0 }}
                                      animate={{
                                        y: 0,
                                        opacity: 1,
                                        transition: { delay: 0.4, duration: 0.3 },
                                      }}
                                    >
                                      <StarRating count={5} />
                                    </motion.div>

                                    {/* Card with testimonial */}
                                    <motion.div
                                      ref={(el) => {
                                        if (!cardRefs.current[category]) {
                                          cardRefs.current[category] = [];
                                        }
                                        cardRefs.current[category][index] = el;
                                      }}
                                      className="relative mt-2 max-h-[320px] overflow-y-auto rounded-xl bg-yellow-400 p-4 pt-6 text-black shadow-lg sm:mt-0 sm:max-h-[400px] sm:p-6 sm:pt-8"
                                      initial={{ y: 20, opacity: 0 }}
                                      animate={{
                                        y: 0,
                                        opacity: 1,
                                        transition: { delay: 0.1, duration: 0.4 },
                                      }}
                                    >
                                      <div className="mb-3 sm:mb-4">
                                        <h4 className="text-base font-bold sm:text-lg">
                                          {testimonial.name}
                                        </h4>
                                        <p className="text-xs text-yellow-800 sm:text-sm">
                                          {testimonial.role}
                                        </p>
                                      </div>
                                      <p className="text-xs leading-relaxed sm:text-sm">
                                        {testimonial.text}
                                      </p>

                                      {/* Indicador de scroll si hay overflow (móvil y desktop) */}
                                      {cardHasOverflow && (
                                        <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{
                                            opacity: 1,
                                            transition: { delay: 0.6, duration: 0.3 },
                                          }}
                                        >
                                          <ScrollArrow />
                                        </motion.div>
                                      )}
                                    </motion.div>
                                  </>
                                ) : (
                                  // Right-aligned card (even indices - second card)
                                  <>
                                    {/* Profile Image - Right positioned - Más pegada al card en móvil */}
                                    <motion.div
                                      className="absolute -top-4 right-4 z-10 sm:-top-8 sm:right-8"
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{
                                        scale: 1,
                                        opacity: 1,
                                        transition: { delay: 0.2, duration: 0.3 },
                                      }}
                                    >
                                      <ProfileImage
                                        imageSrc={testimonial.image}
                                        alt={testimonial.name}
                                      />
                                    </motion.div>

                                    {/* Star Rating - Reposicionado en móvil (más abajo) */}
                                    <motion.div
                                      className="absolute right-1/2 top-2 z-20 translate-x-1/2 transform sm:-top-4 sm:right-[60%] sm:translate-x-1/2"
                                      initial={{ y: -10, opacity: 0 }}
                                      animate={{
                                        y: 0,
                                        opacity: 1,
                                        transition: { delay: 0.4, duration: 0.3 },
                                      }}
                                    >
                                      <StarRating count={5} />
                                    </motion.div>

                                    {/* Card with testimonial - Padding ajustado en móvil */}
                                    <motion.div
                                      ref={(el) => {
                                        if (!cardRefs.current[category]) {
                                          cardRefs.current[category] = [];
                                        }
                                        cardRefs.current[category][index] = el;
                                      }}
                                      className="relative mt-2 max-h-[320px] overflow-y-auto rounded-xl bg-black p-4 pr-4 pt-6 text-white shadow-lg sm:mt-0 sm:max-h-[400px] sm:p-6 sm:pr-24 sm:pt-8"
                                      initial={{ y: 20, opacity: 0 }}
                                      animate={{
                                        y: 0,
                                        opacity: 1,
                                        transition: { delay: 0.1, duration: 0.4 },
                                      }}
                                    >
                                      <div className="mb-3 sm:mb-4">
                                        <h4 className="text-base font-bold sm:text-lg">
                                          {testimonial.name}
                                        </h4>
                                        <p className="text-xs text-yellow-400 sm:text-sm">
                                          {testimonial.role}
                                        </p>
                                      </div>
                                      <p className="text-xs leading-relaxed sm:text-sm">
                                        {testimonial.text}
                                      </p>

                                      {/* Indicador de scroll si hay overflow (móvil y desktop) */}
                                      {cardHasOverflow && (
                                        <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{
                                            opacity: 1,
                                            transition: { delay: 0.6, duration: 0.3 },
                                          }}
                                        >
                                          <ScrollArrow />
                                        </motion.div>
                                      )}
                                    </motion.div>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
