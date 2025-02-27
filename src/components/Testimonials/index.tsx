"use client";

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Testimonial } from "@/types/testimonial";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Extended testimonial type to include category
interface ExtendedTestimonial extends Testimonial {
  category: "client" | "vendor" | "driver";
  shortQuote?: string;
}

const testimonialData: ExtendedTestimonial[] = [
  {
    id: 1,
    name: "Wendy S.",
    designation: "TheHRLady",
    content: "As a small business owner, my team of virtual assistants makes me feel like I have an entire team behind me. One of their tasks is to transform my PowerPoint presentations into professional, polished files that consistently impress me and my clients. Quick, efficient, and effective, they handle tasks with remarkable speed and precision. Their support has been invaluable to my business and my sanity!",
    image: "/images/testimonials/author-01.png",
    star: 5,
    category: "client",
  },
  {
    id: 2,
    name: "Cris & Ray",
    designation: "Owner of Bloom",
    content: "Ready Set has streamlined our delivery system. Orders are always on time, and our customers are thrilled.",
    image: "/images/testimonials/author-02.png",
    star: 5,
    category: "client",
  },
  {
    id: 3,
    name: "Alex R.",
    designation: "Product Supplier",
    content: "From onboarding to operations, Ready Set has exceeded expectations.",
    image: "/images/testimonials/author-03.png",
    star: 3,
    category: "client",
  },
  {
    id: 4,
    name: "Lydia N.",
    designation: "Vendor Partner",
    content: "Partnering with Ready Set has increased our efficiency by 40%. Their team is reliable and professional.",
    image: "/images/testimonials/author-04.png",
    star: 5,
    category: "client",
  },
  {
    id: 5,
    name: "George E.",
    designation: "Vendor Partner",
    content: "Efficient, reliable, and seamless partnership!",
    image: "/images/testimonials/author-05.png",
    star: 5,
    category: "vendor",
  },
  {
    id: 6,
    name: "Maria R.",
    designation: "Logistics Partner",
    content: "I love the flexibility and the team's professionalism. I feel valued every single day.",
    image: "/images/testimonials/author-06.png",
    star: 4,
    category: "driver",
  },
  {
    id: 7,
    name: "Chris L.",
    designation: "Delivery Driver",
    content: "Working with Ready Set has been life-changing for me. The support from the team is unmatched—they always ensure I have all the information I need to complete my deliveries efficiently. I've also gained access to great opportunities and flexible hours, which allow me to balance work with my personal life. I feel respected and valued every step of the way, and that motivates me to give my best every day. Ready Set is not just a job, it feels like a community that genuinely cares about its drivers.",
    image: "/images/testimonials/author-07.png",
    star: 5,
    category: "driver",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: ExtendedTestimonial }) => {
  // Determine background color based on testimonial id
  const getBgColor = () => {
    // Use a more intense yellow for yellow cards
    if (testimonial.id === 1 || testimonial.id === 4 || testimonial.id === 6) {
      return "bg-yellow-300 text-black";
    } else {
      return "bg-gray-800 text-white";
    }
  };

  return (
    <div className="relative">
      <div className={`rounded-lg p-4 ${getBgColor()}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-bold text-base">{testimonial.name}, {testimonial.designation}</h4>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`${testimonial.id === 1 || testimonial.id === 4 || testimonial.id === 6 ? "text-yellow-500" : "text-yellow-400"}`}>
                  {i < testimonial.star ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>
          <div className="ml-2">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <p className="text-sm">{testimonial.content}</p>
      </div>
    </div>
  );
};

const CategoryTestimonialCarousel = ({
  testimonials,
  title,
  subtitle
}: {
  testimonials: ExtendedTestimonial[],
  title: string,
  subtitle: string
}) => {
  const [api, setApi] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Función para avanzar al siguiente slide
  const scrollToNext = useCallback(() => {
    if (api) {
      const nextIndex = (currentIndex + 1) % testimonials.length;
      api.scrollTo(nextIndex);
      setCurrentIndex(nextIndex);
    }
  }, [api, currentIndex, testimonials.length]);

  // Configurar el autoscroll cuando el mouse está sobre el carrusel
  useEffect(() => {
    // Limpia cualquier intervalo existente inmediatamente
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
    
    // Solo crea un nuevo intervalo si está en hover y el API existe
    if (api && isHovered) {
      console.log("Iniciando autoscroll"); // Para debugging
      autoScrollRef.current = setInterval(() => {
        console.log("Avanzando slide"); // Para debugging
        scrollToNext();
      }, 1000); // Desplazamiento cada 2 segundos
    }

    // Limpiar al desmontar o cuando cambien las dependencias
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [api, isHovered, scrollToNext]);

  // Mejorar la detección de hover usando eventos nativos
  useEffect(() => {
    const element = carouselRef.current;
    
    if (!element) return;
    
    const handleMouseEnter = () => {
      console.log("Mouse enter"); // Para debugging
      setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
      console.log("Mouse leave"); // Para debugging
      setIsHovered(false);
    };
    
    // Usar eventos nativos para mejor detección
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Seguir el índice actual cuando el carrusel se desplaza
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);
    
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className="w-full lg:w-1/3 px-4">
      <div className="border-dotted border-2 border-gray-300 p-4 h-full">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold uppercase mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>

        <div 
          ref={carouselRef}
          className="relative w-full h-[500px] overflow-hidden"
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
              containScroll: "keepSnaps"
            }}
            orientation="vertical"
            className="w-full h-full"
          >
            <CarouselContent className="-mt-2 h-full">
              {testimonials.map((testimonial) => (
                <CarouselItem 
                  key={testimonial.id} 
                  className="pt-2 h-full flex items-center justify-center"
                >
                  <div className="w-full max-h-[400px] overflow-y-auto">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-2 gap-2 z-10">
              <CarouselPrevious 
                onClick={(e) => {
                  e.stopPropagation(); // Prevenir que el evento afecte al hover
                  if (api) {
                    const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                    api.scrollTo(prevIndex);
                    setCurrentIndex(prevIndex);
                  }
                }}
                className="h-8 w-8 border-0 bg-yellow-300 hover:bg-yellow-400 text-black rounded-full"
              >
                <span className="sr-only">Previous testimonial</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 rotate-90"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </CarouselPrevious>
              <CarouselNext 
                onClick={(e) => {
                  e.stopPropagation(); // Prevenir que el evento afecte al hover
                  scrollToNext();
                }}
                className="h-8 w-8 border-0 bg-yellow-300 hover:bg-yellow-400 text-black rounded-full"
              >
                <span className="sr-only">Next testimonial</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 rotate-90"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </CarouselNext>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  // Filter testimonials by category
  const clientTestimonials = testimonialData.filter(
    (testimonial) => testimonial.category === "client"
  );
  const vendorTestimonials = testimonialData.filter(
    (testimonial) => testimonial.category === "vendor"
  );
  const driverTestimonials = testimonialData.filter(
    (testimonial) => testimonial.category === "driver"
  );

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What People Say About Us</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center">
              <div className="border-b border-dotted border-gray-400 w-1/4"></div>
              <div className="px-4">
                <p className="font-medium">Real Stories. Real Impact</p>
              </div>
              <div className="border-b border-dotted border-gray-400 w-1/4"></div>
            </div>
            <p className="text-sm mt-2">
              See how Ready Set is making a difference for our clients, vendors, and drivers
            </p>
          </div>
        </div>

        <div className="flex flex-wrap -mx-4">
          <CategoryTestimonialCarousel
            testimonials={clientTestimonials}
            title="CLIENTS"
            subtitle="Why Our Clients Love Us"
          />
          <CategoryTestimonialCarousel
            testimonials={vendorTestimonials}
            title="VENDORS"
            subtitle="Trusted Partners for Seamless Operations"
          />
          <CategoryTestimonialCarousel
            testimonials={driverTestimonials}
            title="DRIVERS"
            subtitle="Our Drivers, Our Heroes"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;