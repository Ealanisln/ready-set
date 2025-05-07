"use client";

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

const FAQSection = () => {
  const [openModal, setOpenModal] = useState<null | 'flowerMap' | 'flowerService' | 'driversRequirements'>(null);

  const mileagePricing: FAQItem[] = [
    {
      question: 'How many miles are included in the standard delivery fee?',
      answer: 'Each delivery includes up to 10 miles at no additional cost.',
    },
    {
      question: 'What happens if the delivery exceeds 10 miles?',
      answer: 'For any distance beyond 10 miles, a charge of $3.00 per additional mile will apply.',
    },
    {
      question: 'What is the maximum mileage covered under the base rate?',
      answer:
        "You're allowed 10 miles per arrangement, which is aggregated across orders. For example, 10 orders allow for a combined total of 100 miles. After that, the $3.00 per extra mile fee kicks in.",
    },
  ];

  const orderDeliveryDetails: FAQItem[] = [
    {
      question: 'What are the available pickup times for deliveries?',
      answer:
        "Our standard pickup windows are 8:00-9:00 AM for morning pickups and 2:00-3:00 PM for afternoon pickups. However, we're happy to accommodate custom pickup times upon request.",
    },
    {
      question: 'How are the orders transported to ensure safety and quality?',
      answer:
        'Orders are transported in secure containers that hold 4-6 arrangements, keeping them stable and well-organized during delivery.',
    },
    {
      question: 'How fast is the delivery process?',
      answer:
        'Our drivers begin deliveries immediately after pickup and typically deliver 6-10 orders per hour, depending on route density and traffic.',
    },
  ];

  const orderCapacityPricing: FAQItem[] = [
    {
      question: 'Is there a limit to how many orders can be delivered at once?',
      answer: "There's no maximum order limit, but generally up to 30 orders can fit in one van.",
    },
    {
      question: 'Will the pricing change for larger orders?',
      answer: (
        <>
          Each delivery location is charged a flat rate, but larger or more complex orders may incur
          additional fees.
          <div className="mt-2">
            {' '}
            {/* Aquí se agregó el <div> */}
            <ul className="list-disc pl-5">
              <li>
                Sprays and wreaths are charged at twice the standard delivery fee due to their size
                and handling requirements.
              </li>
            </ul>
          </div>{' '}
          {/* Cierre del <div> agregado */}
        </>
      ),
    },
  ];

  const deliveryErrors: FAQItem[] = [
    {
      question: 'What happens if a driver delivers to the wrong address?',
      answer:
        "If the mistake is on our end, we'll correct it at no extra cost. If the delivery needs to be changed due to late updates or redirection, a new delivery fee will apply.",
    },
  ];

  const billingSubscription: FAQItem[] = [
    {
      question: 'Is there a subscription or membership fee?',
      answer:
        "No, we don't offer memberships or subscriptions. We invoice weekly or on the 1st and 15th of each month, depending on delivery volume. Clients with over $1,000/week in volume are invoiced bi-monthly (1st and 15th).",
    },
  ];

  const FAQSectionComponent = ({
    // Renombramos para evitar confusión con la constante
    title,
    items,
  }: {
    title: string;
    items: FAQItem[];
  }) => (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-bold text-gray-800">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <p className="font-medium">Q: {item.question}</p>
            {/* Solo renderiza como <p> si es string, si no, usa un <div> para evitar errores de anidamiento */}
            {typeof item.answer === 'string' ? (
              <p className="text-gray-600">A: {item.answer}</p>
            ) : (
              <div className="text-gray-600">A: {item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-12 text-center text-4xl font-bold">
          Frequently Asked Questions
          <br />
          (FAQs)
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <FAQSectionComponent title="Mileage Pricing" items={mileagePricing} />
            <FAQSectionComponent title="Order & Delivery Details" items={orderDeliveryDetails} />
          </div>
          <div>
            <FAQSectionComponent title="Order Capacity & Pricing" items={orderCapacityPricing} />
            <FAQSectionComponent title="Delivery Errors & Corrections" items={deliveryErrors} />
            <FAQSectionComponent title="Billing & Subscription" items={billingSubscription} />
          </div>
        </div>

        {/* Downloadable Resources Section */}
        <div className="mt-12 rounded-lg border-2 border-dashed border-yellow-400 p-6">
          <h3 className="mb-6 text-center text-2xl font-bold">Downloadable Resources</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-yellow-500"
              onClick={() => setOpenModal('flowerMap')}
            >
              Flower Area Map
            </button>
            <button
              className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-yellow-500"
              onClick={() => setOpenModal('flowerService')}
            >
              Our Flower Service
            </button>
            <button
              className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-yellow-500"
              onClick={() => setOpenModal('driversRequirements')}
            >
              Drivers Requirements
              <span className="ml-2 text-sm"></span>
            </button>
          </div>

          {/* Modal para Flower Area Map */}
          {openModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-xs text-center">
                <p className="mb-6">This page is under development. Please check back soon for more information.</p>
                <button
                  className="mt-2 rounded bg-yellow-400 px-4 py-2 font-semibold text-gray-900 hover:bg-yellow-500"
                  onClick={() => setOpenModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
