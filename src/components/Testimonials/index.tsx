"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// Remover la importación de Image de Next.js para usar solución basada en background-image

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
    DRIVERS: 0
  });

  // Estado para controlar si el autoplay está pausado
  const [isPaused, setIsPaused] = useState({
    CLIENTS: false,
    VENDORS: false,
    DRIVERS: false
  });

  // Estado para controlar categoría activa en móvil
  const [activeMobileCategory, setActiveMobileCategory] = useState<'CLIENTS' | 'VENDORS' | 'DRIVERS'>('CLIENTS');
  
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
    DRIVERS: []
  });

  // Refs para los contenedores de testimonios
  const cardRefs = useRef<{[key: string]: (HTMLDivElement | null)[]}>(
    { 'CLIENTS': [], 'VENDORS': [], 'DRIVERS': [] }
  );
  
  // Cache para imagenes precargadas
  const preloadedImages = useRef<Set<string>>(new Set());

  // Aplicar optimizaciones para evitar recargas y parpadeos en móviles
  useEffect(() => {
    // Establecer estas variables al inicio para evitar cambios de estado posteriores
    setIsBrowser(true);
    
    // Función optimizada para detectar móvil
    const checkMobile = () => {
      // Usar matchMedia para mayor precisión y mejor rendimiento
      return window.matchMedia('(max-width: 767px)').matches;
    };
    
    // Detectar móvil inicial
    const initialMobile = checkMobile();
    setIsMobile(initialMobile);
    
    // Precarga de imágenes para evitar parpadeos
    const preloadImages = () => {
      // Para todas las imágenes en testimonials
      testimonials.forEach(testimonial => {
        if (testimonial.image) {
          const img = new Image();
          img.src = testimonial.image;
        }
      });
    };
    
    // Precargar imágenes al inicio
    preloadImages();
    
    // Detector de cambio de tamaño optimizado
    const handleResize = () => {
      const newIsMobile = checkMobile();
      
      // Solo actualizar si hay cambio real
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
      
      // Usar un enfoque throttled para evitar demasiadas actualizaciones
      if (!(window as any).resizeTimerId) {
        (window as any).resizeTimerId = setTimeout(() => {
          checkContentOverflow();
          (window as any).resizeTimerId = null;
        }, 500); // Tiempo más largo para reducir actualizaciones
      }
    };
    
    // Usar ResizeObserver cuando sea posible para mejor rendimiento
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(document.body);
      return () => {
        resizeObserver.disconnect();
        if ((window as any).resizeTimerId) {
          clearTimeout((window as any).resizeTimerId);
        }
      };
    } else {
      // Fallback al método tradicional
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if ((window as any).resizeTimerId) {
          clearTimeout((window as any).resizeTimerId);
        }
      };
    }
  }, []);
  
  // Función para verificar el overflow del contenido con debounce incorporado
  const checkContentOverflow = () => {
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
  };

  const testimonials: Testimonial[] = [
    {
      category: 'CLIENTS',
      name: 'Wendy Sellers',
      role: 'PPT',
      text: 'As a small business owner, my team of virtual assistants makes me feel like I have an entire team behind me. One of their tasks is to transform my PowerPoint presentations into professional, polished files that consistently impress me and my clients. Quick, efficient, and effective, they handle tasks with remarkable speed and precision. Their support has been invaluable to my business and my sanity!',
      image: '/images/testimonials/author-01.png'
    },
    {
      category: 'CLIENTS',
      name: 'Dennis Ngai.',
      role: 'Video Editing',
      text: 'These guys came through for me and built a solid business along the way. A few years back, pre-covid, my lunch catering business was taking off to a point where I had to turn down orders. Ready Set always had drivers available and helped me scale so I did not have to turn down orders. They are reliable and trustworthy.',
      image: '/images/testimonials/author-02.png'
    },
    {
      category: 'CLIENTS',
      name: 'Racheal Gallegos.',
      role: 'Vendor Partner',
      text: 'Kaleb was an exceptional asset to the company during my tenure there. I would hire him again in a second for any position. Kaleb started his journey with us in customer service and sales, where he quickly showcased his remarkable intelligence and aptitude for learning. His analytical skills and ability to see both the big picture and the finer details set him apart from the beginning. Kaleb dedication and rapid growth led him to transition into product and brand management, where he truly excelled. His innovative approach, strategic thinking, and meticulous attention to detail made a significant impact on the company success. When I left the company, I felt secure knowing that Kaleb was taking over. It was not long before he was leading the team of brand managers, steering the company vision with expertise. Kaleb ability to adapt, learn, and lead with insight and precision is truly commendable. His contributions were instrumental in the company growth, and I am confident that he will continue to achieve great success in any future endeavors. Any organization would be fortunate to have Kaleb on their team.',
      image: '/images/testimonials/author-03.png'
    },
    {
      category: 'CLIENTS',
      name: 'Crystal Rapada',
      role: 'Virtual Assistant',
      text: "A Game-Changer for CareerLearning. Ready Set Virtual Assistants was instrumental in propelling CareerLearning to new heights. Their team seamlessly integrated into our operations, from customer service to sales support and beyond. We were particularly impressed with their ability to quickly grasp complex software platforms like Zendesk, HubSpot, On24, and Shopify. Their dedication to continuous learning and growth was evident as the VA Brand Managers took on increasing responsibilities and became experts in various departments. The impact of Ready Set's email marketing team was especially noteworthy. Their coordinators expertly managed our email campaigns through Marketo and Klaviyo, while their experienced email marketing consultant provided strategic guidance that significantly boosted our results. Ultimately, these efforts, combined with their contributions to social media management and overall marketing strategy, led to a record-breaking $3.5 million in sales in 2023. If you're seeking a reliable, skilled, and innovative virtual assistant team to elevate your business, I wholeheartedly recommend Ready Set Virtual Assistants. They're not just service providers; they're true partners in growth. 5 stars. 10 out of 10!",
      image: '/images/testimonials/author-04.png',
    },
    {
      category: 'DRIVERS',
      name: 'Maria R.',
      role: 'Logistics Partner',
      text: 'I love the flexibility and the team\'s professionalism. I feel valued every single day.',
      image: '/images/testimonials/author-05.png'
    },
    {
      category: 'DRIVERS',
      name: 'Chris L.',
      role: 'Delivery Driver',
      text: 'Working with Ready Set has been life-changing for me. The support from the team is unmatched—they always ensure I have all the information I need to complete my deliveries efficiently. I\'ve also gained access to great opportunities and flexible hours, which allow me to balance work with my personal life. I feel respected and valued every step of the way, and that motivates me to give my best every day. Ready Set is not just a job; it feels like a community that genuinely cares about its drivers.',
      image: '/images/testimonials/author-06.png'
    }, 
    {
      category: 'VENDORS',
      name: 'John Smith',
      role: 'Restaurant Owner',
      text: 'Working with Ready Set has been life-changing for me. The support from the team is unmatched—they always ensure I have all the information I need to complete my deliveries efficiently. I\'ve also gained access to great opportunities and flexible hours, which allow me to balance work with my personal life. I feel respected and valued every step of the way, and that motivates me to give my best every day. Ready Set is not just a job; it feels like a community that genuinely cares about its drivers.',
      image: '/images/testimonials/author-07.png'
    }, 
    {
      category: 'VENDORS',
      name: 'Sarah Johnson',
      role: 'Business Partner',
      text: 'Working with Ready Set has been life-changing for me. The support from the team is unmatched—they always ensure I have all the information I need to complete my deliveries efficiently. I\'ve also gained access to great opportunities and flexible hours, which allow me to balance work with my personal life. I feel respected and valued every step of the way, and that motivates me to give my best every day. Ready Set is not just a job; it feels like a community that genuinely cares about its drivers.',
      image: '/images/testimonials/author-03.png'
    }, 
  ];

  // Usar useMemo para evitar re-computes innecesarios
  const groupedTestimonials = useMemo(() => {
    return testimonials.reduce((acc, testimonial) => {
      acc[testimonial.category] = acc[testimonial.category] || [];
      acc[testimonial.category].push(testimonial);
      return acc;
    }, {} as Record<Testimonial['category'], Testimonial[]>);
  }, [testimonials]);

  // Revisar si hay overflow en cada testimonio activo
  useEffect(() => {
    // Verificar el overflow si estamos en el navegador
    if (isBrowser) {
      // Revisar después de un breve retraso para asegurarnos de que el contenido está renderizado
      const timeoutId = setTimeout(checkContentOverflow, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [groupedTestimonials, isBrowser, activeIndices, activeMobileCategory]);

  // Funciones para controlar la navegación
  const nextTestimonial = (category: 'CLIENTS' | 'VENDORS' | 'DRIVERS') => {
    const items = groupedTestimonials[category] || [];
    if (items.length === 0) return;
    
    setActiveIndices(prev => ({
      ...prev,
      [category]: (prev[category] + 1) % items.length
    }));
  };

  const prevTestimonial = (category: 'CLIENTS' | 'VENDORS' | 'DRIVERS') => {
    const items = groupedTestimonials[category] || [];
    if (items.length === 0) return;
    
    setActiveIndices(prev => ({
      ...prev,
      [category]: (prev[category] - 1 + items.length) % items.length
    }));
  };

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
        
        // Cambiar cada 8 segundos (8000ms) si no está pausado
        // Tiempo más largo para reducir cambios y posibles parpadeos
        if (elapsed > 8000 && !isPaused[categoryKey]) {
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
      animationFrameIds.forEach(id => cancelAnimationFrame(id));
    };
  }, [isPaused, groupedTestimonials]);

  // Componente de estrellas memoizado para evitar re-renders
  const StarRating = React.memo(({ count = 5 }: { count?: number }) => (
    <div className="flex bg-white px-2 py-1 rounded-md">
      {[...Array(count)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  ));

  // Componente de flecha para indicar scroll memoizado
  const ScrollArrow = React.memo(() => (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg 
        className="w-5 h-5 text-white opacity-80" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 9l-7 7-7-7" 
        />
      </svg>
    </div>
  ));

  // Componente de imagen de perfil con carga estática para evitar parpadeos
  const ProfileImage = React.memo(({ imageSrc, alt }: { imageSrc?: string; alt: string }) => {
    // Simplificar la lógica de manejo de imágenes y usar placeholders de manera consistente
    // Esto evita que el componente cambie de estado y cause re-renders
    
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow-lg z-10 bg-gray-200">
        {/* Precargar imagen con visibilidad oculta para verificar si carga correctamente */}
        {imageSrc && (
          <div className="relative w-full h-full">
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
                opacity: 0
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
    <div className="flex flex-wrap justify-center gap-2 my-6 md:hidden">
      {Object.keys(groupedTestimonials).map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
    return <div className="bg-white py-10 px-4 border border-purple-500 rounded-lg">Cargando testimonios...</div>;
  }

  return (
    <section className="bg-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border border-purple-500 rounded-lg">
      <div className="max-w-7xl mx-auto">
        {/* Updated header section with dotted lines extending from title */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            What People Say About Us
          </h2>
          
          {/* Real Stories. Real Impact with dotted lines extending from both sides */}
          <div className="mb-6 sm:mb-8 flex items-center justify-center">
            <div className="relative flex items-center justify-center w-full">
              {/* Left dotted line */}
              <div className="border-t-2 border-dashed border-black w-1/4 sm:w-1/2 absolute right-1/2 mr-4"></div>
              
              {/* Text in the middle */}
              <p className="text-lg sm:text-xl text-black z-10 bg-white px-4 relative">Real Stories. Real Impact</p>
              
              {/* Right dotted line */}
              <div className="border-t-2 border-dashed border-black w-1/4 sm:w-1/2 absolute left-1/2 ml-4"></div>
            </div>
          </div>
          
          <p className="text-black max-w-2xl mx-auto text-sm sm:text-base">
            See how Ready Set is making a difference for our clients, vendors, and drivers
          </p>
        </div>

        {/* Selector de categoría para móviles */}
        <CategorySelector />

        {/* Espacio adicional entre selector y contenido en móvil */}
        <div className="h-4 md:h-0"></div>

        {/* Grid de tres columnas en desktop, una columna en móvil */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <div className="relative border-2 border-dotted border-black p-4 sm:p-6 pt-10 sm:pt-12 pb-6">
                  {/* Título de categoría */}
                  <div className="absolute -top-5 left-0 w-full text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-black inline-block px-4 sm:px-6 bg-white">{category}</h3>
                  </div>
                  
                  {/* Subtítulo */}
                  <div className="text-center -mt-6 sm:-mt-9 mb-14 sm:mb-16">
                    <p className="text-black text-xs sm:text-sm">
                      {category === 'CLIENTS' && 'Why Our Clients Love Us'}
                      {category === 'VENDORS' && 'Trusted Partners for Seamless Operations'}
                      {category === 'DRIVERS' && 'Our Drivers, Our Heroes'}
                    </p>
                  </div>
                  
                  {/* Carrusel manual */}
                  <div 
                    className="relative h-[350px] sm:h-[450px]"
                    onMouseEnter={() => setIsPaused({...isPaused, [category]: true})}
                    onMouseLeave={() => setIsPaused({...isPaused, [category]: false})}
                    onTouchStart={() => setIsPaused({...isPaused, [category]: true})}
                    onTouchEnd={() => setTimeout(() => setIsPaused({...isPaused, [category]: false}), 5000)}
                  >
                    {/* Indicadores de página */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {items.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                            idx === activeIndices[category as keyof typeof activeIndices] 
                              ? 'bg-yellow-400' 
                              : 'bg-gray-300'
                          }`}
                          onClick={() => setActiveIndices({...activeIndices, [category]: idx})}
                          aria-label={`Go to testimonial ${idx + 1}`}
                        />
                      ))}
                    </div>
                    
                    {/* Contenedor con animación de fade */}
                    <div className="h-full">
                      {items.map((testimonial, index) => {
                        const isActive = index === activeIndices[category as keyof typeof activeIndices];
                        // Alternar el layout en móvil para consistencia
                        const layoutStyle = isMobile ? (index % 2 === 0) : (index % 2 === 0);
                        
                        // Verificar si este testimonio tiene overflow
                        const cardHasOverflow = hasOverflow[category as keyof typeof hasOverflow]?.[index];
                        
                        // En móvil, preparar todos los testimonios pero ocultar los inactivos completamente
                        // Esto evita que se monten/desmonten componentes, causando parpadeos
                        
                        return (
                          <div 
                            key={index}
                            className={`absolute inset-0 ${isMobile ? '' : 'transition-opacity duration-500'} ${
                              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                            style={{ 
                              // Usar transform para mejorar rendimiento de animaciones
                              transform: `translateZ(0)`,
                              willChange: 'opacity',
                              // Para móvil: usando visibility en vez de opacity para mejor rendimiento
                              visibility: isMobile && !isActive ? 'hidden' : 'visible'
                            }}
                          >
                            <div className="relative h-full pt-6">
                              {layoutStyle ? (
                                // Left-aligned card (odd indices - first card)
                                <>
                                  {/* Profile Image - Left positioned - Más pegada al card en móvil */}
                                  <div className="absolute -top-4 sm:-top-8 left-4 sm:left-8 z-10">
                                    <ProfileImage imageSrc={testimonial.image} alt={testimonial.name} />
                                  </div>
                                  
                                  {/* Curved connector line using SVG - Escondido en móvil */}
                                  <div className="absolute top-0 left-0 w-full h-32 z-5 pointer-events-none hidden sm:block">
                                    <svg width="100%" height="100%" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      {/* Small circle at the start of the line */}
                                      <circle cx="68" cy="10" r="2" fill="black" />
                                      {/* Curved path from profile to card */}
                                      <path d="M68 10 H150 C180 10, 250 5, 270 30 S300 50, 330 35" 
                                            stroke="black" 
                                            strokeWidth="2" 
                                            fill="none" />
                                    </svg>
                                  </div>
                                  
                                  {/* Star Rating - Reposicionado en móvil (más abajo) */}
                                  <div className="absolute top-2 sm:-top-4 left-1/2 sm:left-[60%] transform -translate-x-1/2 sm:-translate-x-1/2 z-20">
                                    <StarRating count={5} />
                                  </div>
                                  
                                  {/* Card with testimonial */}
                                  <div 
                                    ref={el => {
                                      if (!cardRefs.current[category]) {
                                        cardRefs.current[category] = [];
                                      }
                                      cardRefs.current[category][index] = el;
                                    }}
                                    className="relative rounded-xl shadow-lg p-4 sm:p-6 pt-6 sm:pt-8 bg-yellow-400 text-black max-h-[320px] sm:max-h-[400px] overflow-y-auto mt-2 sm:mt-0"
                                  >
                                    <div className="mb-3 sm:mb-4">
                                      <h4 className="font-bold text-base sm:text-lg">{testimonial.name}</h4>
                                      <p className="text-xs sm:text-sm text-yellow-800">{testimonial.role}</p>
                                    </div>
                                    <p className="text-xs sm:text-sm leading-relaxed">
                                      {testimonial.text}
                                    </p>
                                    
                                    {/* Indicador de scroll si hay overflow (móvil y desktop) */}
                                    {isActive && cardHasOverflow && (
                                      <ScrollArrow />
                                    )}
                                  </div>
                                </>
                              ) : (
                                // Right-aligned card (even indices - second card)
                                <>
                                  {/* Profile Image - Right positioned - Más pegada al card en móvil */}
                                  <div className="absolute -top-4 sm:-top-8 right-4 sm:right-8 z-10">
                                    <ProfileImage imageSrc={testimonial.image} alt={testimonial.name} />
                                  </div>
                                  
                                  {/* Curved connector line using SVG - Escondido en móvil */}
                                  <div className="absolute top-0 right-0 w-full h-32 z-5 pointer-events-none hidden sm:block">
                                    <svg width="100%" height="100%" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
                                      {/* Small circle at the start of the line */}
                                      <circle cx="68" cy="10" r="2" fill="black" />
                                      {/* Curved path from profile to card */}
                                      <path d="M68 10 H150 C180 10, 250 5, 270 30 S300 50, 330 35" 
                                            stroke="black" 
                                            strokeWidth="2" 
                                            fill="none" />
                                    </svg>
                                  </div>
                                  
                                  {/* Star Rating - Reposicionado en móvil (más abajo) */}
                                  <div className="absolute top-2 sm:-top-4 right-1/2 sm:right-[60%] transform translate-x-1/2 sm:translate-x-1/2 z-20">
                                    <StarRating count={5} />
                                  </div>
                                  
                                  {/* Card with testimonial - Padding ajustado en móvil */}
                                  <div 
                                    ref={el => {
                                      if (!cardRefs.current[category]) {
                                        cardRefs.current[category] = [];
                                      }
                                      cardRefs.current[category][index] = el;
                                    }}
                                    className="relative rounded-xl shadow-lg p-4 sm:p-6 pt-6 sm:pt-8 pr-4 sm:pr-24 bg-black text-white max-h-[320px] sm:max-h-[400px] overflow-y-auto mt-2 sm:mt-0"
                                  >
                                    <div className="mb-3 sm:mb-4">
                                      <h4 className="font-bold text-base sm:text-lg">{testimonial.name}</h4>
                                      <p className="text-xs sm:text-sm text-yellow-400">{testimonial.role}</p>
                                    </div>
                                    <p className="text-xs sm:text-sm leading-relaxed">
                                      {testimonial.text}
                                    </p>
                                    
                                    {/* Indicador de scroll si hay overflow (móvil y desktop) */}
                                    {isActive && cardHasOverflow && (
                                      <ScrollArrow />
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
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