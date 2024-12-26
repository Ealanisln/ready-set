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
      title: "Wedding Cakes: ",
      description:
        "Ensuring that stunning centerpiece cakes arrive in pristine condition for the big day.",
    },
    {
      title: "Birthday Cakes & Desserts: ",
      description:
        "Keeping every celebration sweet, memorable, and hassle-free.",
    },
    {
      title: "Holiday Orders: ",
      description:
        "Delivering festive treats like cookies, pies, and specialty breads to spread seasonal cheer.",
    },
    {
      title: "Corporate Events & Catering: ",
      description:
        "Providing seamless logistics for bulk orders and large gatherings.",
    },
    {
      title: "Everyday Bread Deliveries: ",
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

          <div className="space-y-4">
            <p className="italic text-gray-800">
              Our services are perfect for key moments such as:
            </p>
            <ul className="list-none space-y-6">
              {services.map((service, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-gray-800 text-2xl leading-none">•</span>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">{service.title}</span>
                    <span className="text-gray-700">{service.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="italic text-gray-800">
            When it comes to delivering excellence, Ready Set is your trusted
            partner for dependable and timely service.
          </p>

          <Button
            onClick={() => handleClick(onRequestQuote)}
            className="bg-black text-white hover:bg-gray-900"
          >
            Request Bakery Delivery Quote
          </Button>
        </div>
        <div className="w-full px-4 md:px-6 lg:px-8">
           <div className="relative w-full mt-8 md:mt-12 lg:mt-20">
           <div className="aspect-w-16 aspect-h-9 md:aspect-h-10 lg:aspect-h-7">
           <div className="rounded-3xl overflow-hidden w-full h-full">
            <img src="/images/logistics/bakerypic.png" 
              alt="A container showing delicious breads" 
              className="w-full h-full object-cover object-center"/>
          </div>
        </div>
        </div>
       </div>
      </div>
    </section>
  );
};

BakeryDeliverySection.displayName = 'BakeryDeliverySection';

export default BakeryDeliverySection;