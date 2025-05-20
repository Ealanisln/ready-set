'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';
import ScheduleDialog from '../Logistics/Schedule';

interface FlowerHeroProps {
  headline?: string;
  subheadline?: string;
  imagePath?: string;
}

const FlowerHero: React.FC<FlowerHeroProps> = ({ imagePath = '/images/flowers/flower4.png' }) => {
  const [isTextAnimated, setIsTextAnimated] = useState(false);
  // Initialize the FormManager
  const { openForm, DialogForm } = FormManager();

  useEffect(() => {
    // Trigger text animation when component mounts
    setIsTextAnimated(true);
  }, []);

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openForm('flower');
  };

  // Split subheadline into paragraphs for better readability
  const paragraphs = [
    'We started in 2019 in the Bay Area, focusing on reliable, thoughtful catering deliveries.',
    'During the pandemic, we partnered with local flower shops to help bring joy and connection to communities.',
    "Today, we specialize in local floral deliveries across cities like San Francisco, Atlanta, and Austin, with real-time tracking and careful handling to ensure your blooms arrive on time and reflect your shop's reputation.",
  ];

  return (
    <section
      className="relative mt-24 flex min-h-[100dvh] w-full items-start justify-center overflow-hidden sm:mt-32 md:mt-16 md:min-h-screen md:items-center"
      style={{
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right center',
      }}
    >
      {/* CAMBIO CLAVE: Se eliminó 'mx-auto' de este div contenedor para que el contenido no esté centrado */}
      <div className="container relative z-10 flex h-full items-center px-4 py-12 sm:px-6 sm:py-8 md:py-0 lg:px-8">
        {/* Este div 'max-w-7xl' ya no es necesario si queremos que el contenido se pegue al borde izquierdo del container */}
        {/* Lo vamos a dejar solo si quieres limitar el ancho máximo del contenido dentro del padding.
            Si lo que quieres es que el texto use el padding del 'container' y luego vaya hacia la derecha hasta donde le dé el 'max-w-md',
            entonces este div no ayuda, ya que es el que centraría su contenido si fuera necesario.
            La clave es que el div que contiene el texto esté a la izquierda.
         */}
        <div className="w-full">
          {' '}
          {/* CAMBIO CLAVE: Aseguramos que ocupe todo el ancho disponible para su flexbox */}
          {/* CAMBIO CLAVE: Aseguramos que los elementos flex se justifiquen al inicio (izquierda) */}
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-start md:gap-10 lg:gap-16">
            {/* Text Content */}
            {/* CAMBIO CLAVE: Añadimos 'md:mr-auto' para empujar el texto a la izquierda y dejar espacio a la derecha para la imagen */}
            <div className="mb-2 w-full text-center md:mb-0 md:mr-auto md:w-full md:max-w-md md:text-left">
              <div
                className={`transition-all duration-700 ease-in-out ${isTextAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-gray-800 sm:text-5xl md:mb-8">
                  <span className="block text-gray-900">Not Just Flowers—</span>
                  <span className="block text-gray-800">We Carry Your</span>
                  <span className="block bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                    Standards.
                  </span>
                </h1>
              </div>
              <div className="space-y-2 md:space-y-5">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`text-sm font-medium leading-relaxed text-gray-700 transition-all duration-700 md:text-base delay-${200 + index * 100} ease-in-out ${isTextAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {/* CTA Buttons */}
              <div
                className={`mt-4 flex flex-wrap justify-center gap-3 transition-all delay-700 duration-700 ease-in-out md:mt-10 md:justify-start md:gap-5 ${isTextAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                <button
                  onClick={handleQuoteClick}
                  className="transform rounded-md bg-gradient-to-r from-yellow-500 to-yellow-400 px-6 py-2.5 text-base font-medium text-gray-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-yellow-600 hover:to-yellow-500 hover:shadow-xl sm:px-10 md:px-8 md:py-3"
                >
                  Get a Quote
                </button>
                <ScheduleDialog
                  buttonText="Book a call"
                  calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
                  customButton={
                    <button className="rounded-md border border-yellow-500 px-6 py-2.5 text-base font-medium text-yellow-600 shadow-sm transition-all duration-300 hover:bg-yellow-50 hover:shadow-md sm:px-10 md:px-8 md:py-3">
                      Book a call
                    </button>
                  }
                />
              </div>
            </div>

            <div className="hidden md:block md:flex-1">
              {/* Este div sigue ocupando el espacio restante a la derecha del texto, 
                  permitiendo que la imagen de fondo se vea. */}
            </div>
          </div>
        </div>
      </div>
      {DialogForm}
    </section>
  );
};

export default FlowerHero;
