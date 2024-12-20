import React from 'react';

interface ServiceItem {
  title: string;
  description: string;
}

const BakeryDeliverySection = () => {
  const services: ServiceItem[] = [
    {
      title: "Wedding Cakes",
      description: "Ensuring that stunning centerpiece cakes arrive in pristine condition for the big day.",
    },
    {
      title: "Birthday Cakes & Desserts",
      description: "Keeping every celebration sweet, memorable, and hassle-free.",
    },
    {
      title: "Holiday Orders",
      description: "Delivering festive treats like cookies, pies, and specialty breads to spread seasonal cheer.",
    },
    {
      title: "Corporate Events & Catering",
      description: "Providing seamless logistics for bulk orders and large gatherings.",
    },
    {
      title: "Everyday Bread Deliveries",
      description: "Because fresh bread and baked goods are always in demand, we make sure they reach your customers daily, ensuring freshness with every bite.",
    },
  ];

  return (
    <section className="bg-amber-300 p-8 md:p-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bakery Delivery
          </h1>
          
          <p className="text-gray-800">
            We've partnered with exceptional bakeries, including{' '}
            <span className="italic font-medium">The Bread Basket Bakery</span>,
            to bring you a seamless logistics delivery service tailored for bakery vendors.
          </p>
          
          <p className="text-gray-800">
            At <span className="font-semibold">Ready Set</span>, we specialize in delivering
            the finest baked goods from local vendors to their clients. Whether it's artisanal
            breads, delicate pastries, or show-stopping cakes, we ensure every order arrives
            fresh, intact, and on time.
          </p>

          <div className="space-y-2">
            <p className="text-gray-800 italic">Our services are perfect for key moments such as:</p>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-gray-800 font-semibold min-w-fit">
                    {service.title} –
                  </span>
                  <span className="text-gray-700">
                    {service.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-gray-800 italic">
            When it comes to delivering excellence, Ready Set is your trusted partner for
            dependable and timely service.
          </p>

          <button className="bg-white px-6 py-3 rounded-full font-semibold text-gray-800 
            hover:bg-gray-50 transition-colors duration-200 shadow-sm">
            Request a Quote
          </button>
        </div>

        <div className="relative h-full">
          <img
            src="/images/logistics/bakerypic.png"
            alt="Bakery display case showing various pastries and baked goods"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default BakeryDeliverySection;