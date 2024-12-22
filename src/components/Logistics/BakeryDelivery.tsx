// src/components/Logistics/BakeryDelivery.tsx

'use client'

import { Button } from "../ui/button";
import { FormType } from "./QuoteRequest/types";

interface ServiceItem {
  title: string;
  description: string;
}

interface BakeryDeliverySectionProps {
  onRequestQuote?: (formType: FormType) => void;
}

const handleClick = (onRequestQuote?: (formType: FormType) => void) => {
  console.log('Button clicked, onRequestQuote:', !!onRequestQuote);
  if (onRequestQuote) {
    onRequestQuote("bakery");
  }
};

const BakeryDeliverySection: React.FC<BakeryDeliverySectionProps> = ({
  onRequestQuote,
}) => {
  const services: ServiceItem[] = [
    {
      title: "Wedding Cakes",
      description:
        "Ensuring that stunning centerpiece cakes arrive in pristine condition for the big day.",
    },
    {
      title: "Birthday Cakes & Desserts",
      description:
        "Keeping every celebration sweet, memorable, and hassle-free.",
    },
    {
      title: "Holiday Orders",
      description:
        "Delivering festive treats like cookies, pies, and specialty breads to spread seasonal cheer.",
    },
    {
      title: "Corporate Events & Catering",
      description:
        "Providing seamless logistics for bulk orders and large gatherings.",
    },
    {
      title: "Everyday Bread Deliveries",
      description:
        "Because fresh bread and baked goods are always in demand, we make sure they reach your customers daily, ensuring freshness with every bite.",
    },
  ];

  return (
    <section className="bg-amber-300 p-8 md:p-12">
      <div className="mx-auto grid max-w-7xl items-start gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Bakery Delivery
          </h1>

          <p className="text-gray-800">
            We've partnered with exceptional bakeries, including{" "}
            <span className="font-medium italic">The Bread Basket Bakery</span>,
            to bring you a seamless logistics delivery service tailored for
            bakery vendors.
          </p>

          <p className="text-gray-800">
            At <span className="font-semibold">Ready Set</span>, we specialize
            in delivering the finest baked goods from local vendors to their
            clients. Whether it's artisanal breads, delicate pastries, or
            show-stopping cakes, we ensure every order arrives fresh, intact,
            and on time.
          </p>

          <div className="space-y-2">
            <p className="italic text-gray-800">
              Our services are perfect for key moments such as:
            </p>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index} className="flex gap-2">
                  <span className="min-w-fit font-semibold text-gray-800">
                    {service.title} –
                  </span>
                  <span className="text-gray-700">{service.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="italic text-gray-800">
            When it comes to delivering excellence, Ready Set is your trusted
            partner for dependable and timely service.
          </p>

          {/* <button className="bg-white px-6 py-3 rounded-full font-semibold text-gray-800 
            hover:bg-gray-50 transition-colors duration-200 shadow-sm">
            Request a Quote
          </button> */}
<Button
        onClick={() => handleClick(onRequestQuote)}
        className="bg-yellow-500 text-white hover:bg-yellow-600"
      >
        Request Bakery Delivery Quote
      </Button>
        </div>

        <div className="relative h-full">
          <img
            src="/images/logistics/bakerypic.png"
            alt="Bakery display case showing various pastries and baked goods"
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

BakeryDeliverySection.displayName = 'BakeryDeliverySection';


export default BakeryDeliverySection;
