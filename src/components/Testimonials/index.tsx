"use client";

import React from 'react';
import Image from 'next/image'; // Importamos el componente Image de Next.js

interface Testimonial {
  category: 'CLIENTS' | 'VENDORS' | 'DRIVERS';
  name: string;
  role: string;
  text: string;
  image?: string;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      category: 'CLIENTS',
      name: 'Wendy Sellers.',
      role: 'PPT',
      text: 'As a small business owner, my team of virtual assistants makes me feel like I have an entire team behind me. One of their tasks is to transform my PowerPoint presentations into professional, polished files that consistently impress me and my clients. Quick, efficient, and effective, they handle tasks with remarkable speed and precision. Their support has been invaluable to my business and my sanity!',
      image: '/images/testimonials/author-01.png'
    },
    {
      category: 'CLIENTS',
      name: 'Dennis Ngai.',
      role: 'Video Editing',
      text: 'These guys came through for me and built a solid business along the way. A few years back, pre-covid, my lunch catering business was taking off to a point where I had to turn down orders. Ready Set always had drivers available and helped me scale so I did not have to turn down orders. They are reliable and trustworthy',
      image: '/images/testimonials/author-02.png'
    },
    {
      category: 'CLIENTS',
      name: 'Racheal Gallegos.',
      role: 'Vendor Partner',
      text: 'Kaleb was an exceptional asset to the company during my tenure there. I would hire him again in a second for any position. Kaleb started his journey with us in customer service and sales, where he quickly showcased his remarkable intelligence and aptitude for learning. His analytical skills and ability to see both the big picture and the finer details set him apart from the beginning. Kaleb’s dedication and rapid growth led him to transition into product and brand management, where he truly excelled. His innovative approach, strategic thinking, and maticulous attention to detail made a significatn impact on the company’s success. When I left the company, I felt secure knowing that Kaleb was taking over. It wasn’t long before he was leading the team of brand managers, steering the conpany’s vision with expertise. Kaleb ability to adapt, learn, and lead with insight and precision is truly commendable. His contributions were instrumental in the company growth, and I am confident that he will continue to achieve great success in any future endeavors. Any organization would be fortunate to have Kaleb on their team.',
      image: '/images/testimonials/author-03.png'
    },
    {
      category: 'CLIENTS',
      name: 'Crystal Rapada.',
      role: 'Virtual Assistant',
      text: 'A Game-Changer for CareerLearning. Ready Set Virtual Assistants was instrumental in propelling CareerLearning to new heights. Their team seamlessly integrated into our operations, from customer service to sales support and beyond. We were particularly impressed with their ability to quickly grasp complex software platforms like Zendesk, HubSpot, On24, and Shopify. Their dedication to continuous learning and growth was evident as the VA Brand Managers took on increasing responsibilities and became experts in various departments. The impact of Ready Set’s email marketing team was especially noteworthy. Their coordinators expertly managed our email campaigns through Marketo and Klaviyo, while their experienced email marketing consultant provided strategic guidance that significantly boosted our results. Ultimately, these efforts, combined with their contributions to social media management and overall marketing strategy, led to a record-breaking $3.5 million in sales in 2023. If you’re seeking a reliable, skilled, and innovative virtual assistant team to elevate your business, I wholeheartedly recommend Ready Set Virtual Assistants. They’re not just service providers; they’re true partners in growth. 5 stars. 10 out of 10!',
      image: '/images/testimonials/author-04.png'
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
      name: 'Chris L.',
      role: 'Delivery Driver',
      text: 'Working with Ready Set has been life-changing for me. The support from the team is unmatched—they always ensure I have all the information I need to complete my deliveries efficiently. I\'ve also gained access to great opportunities and flexible hours, which allow me to balance work with my personal life. I feel respected and valued every step of the way, and that motivates me to give my best every day. Ready Set is not just a job; it feels like a community that genuinely cares about its drivers.',
      image: '/images/testimonials/author-07.png'
    }, 

    {
      category: 'VENDORS',
      name: 'Chris L.',
      role: 'Delivery Driver',
      text: 'Working with Ready Set has been life-changing for me. The support from the team is unmatched—they always ensure I have all the information I need to complete my deliveries efficiently. I\'ve also gained access to great opportunities and flexible hours, which allow me to balance work with my personal life. I feel respected and valued every step of the way, and that motivates me to give my best every day. Ready Set is not just a job; it feels like a community that genuinely cares about its drivers.',
      image: '/images/testimonials/author-06.png'
    }, 
  ];

  const groupedTestimonials = testimonials.reduce((acc, testimonial) => {
    acc[testimonial.category] = acc[testimonial.category] || [];
    acc[testimonial.category].push(testimonial);
    return acc;
  }, {} as Record<Testimonial['category'], Testimonial[]>);

  // Updated star component to match the design
  const StarRating = ({ count = 5 }: { count?: number }) => (
    <div className="flex bg-white px-2 py-1 rounded-md">
      {[...Array(count)].map((_, i) => (
        <svg
          key={i}
          className="w-6 h-6 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  // Componente de imagen de perfil actualizado
  const ProfileImage = ({ imageSrc, alt }: { imageSrc?: string; alt: string }) => {
    const [imageError, setImageError] = React.useState(false);
    
    return (
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg z-10 bg-gray-200">
        {imageSrc && !imageError ? (
          <Image 
            src={imageSrc}
            alt={alt}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <img 
            src="/api/placeholder/80/80"
            alt={alt}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border border-purple-500 rounded-lg">
      <div className="max-w-7xl mx-auto">
        {/* Updated header section with dotted lines extending from title */}
        <div className="text-center mb-12 relative">
          <h2 className="text-4xl font-bold text-black mb-4">
            What People Say About Us
          </h2>
          
          {/* Real Stories. Real Impact with dotted lines extending from both sides */}
          <div className="mb-8 flex items-center justify-center">
            <div className="relative flex items-center justify-center w-full">
              {/* Left dotted line - changed from w-1/3 to w-2/5 */}
              <div className="border-t-2 border-dashed border-black w-1/2 absolute right-1/2 mr-4"></div>
              
              {/* Text in the middle */}
              <p className="text-xl text-black z-10 bg-white px-4 relative">Real Stories. Real Impact</p>
              
              {/* Right dotted line - changed from w-1/3 to w-2/5 */}
              <div className="border-t-2 border-dashed border-black w-1/2 absolute left-1/2 ml-4"></div>
            </div>
          </div>
          
          <p className="text-black max-w-2xl mx-auto">
            See how Ready Set is making a difference for our clients, vendors, and drivers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(groupedTestimonials).map(([category, items]) => (
            <div key={category} className="relative">
              {/* Full container with dotted border and position relative */}
              <div className="relative border-2 border-dotted border-black p-6 pt-12 pb-6">
                {/* Category header positioned to break the top border */}
                <div className="absolute -top-5 left-0 w-full text-center">
                  <h3 className="text-2xl font-bold text-black inline-block px-6 bg-white">{category}</h3>
                </div>
                
               {/* Subtitle - Pegado prácticamente al título principal */}
               <div className="text-center -mt-9 mb-12">
                  <p className="text-black text-sm">
                    {category === 'CLIENTS' && 'Why Our Clients Love Us'}
                    {category === 'VENDORS' && 'Trusted Partners for Seamless Operations'}
                    {category === 'DRIVERS' && 'Our Drivers, Our Heroes'}
                  </p>
                </div>
                
                {/* All testimonial cards within the dotted border */}
                <div className="space-y-12">
                  {items.map((testimonial, index) => (
                    <div key={index} className="relative pt-6">
                      {/* Alternating layout based on index */}
                      {index % 2 === 0 ? (
                        // Left-aligned card (odd indices - first card)
                        <>
                          {/* Profile Image - Left positioned */}
                          <div className="absolute -top-8 left-8 z-10">
                            <ProfileImage imageSrc={testimonial.image} alt={testimonial.name} />
                          </div>
                          
                          {/* Curved connector line using SVG */}
                          <div className="absolute top-0 left-0 w-full h-32 z-5 pointer-events-none">
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
                          
                          {/* Star Rating - Right of profile */}
                          <div className="absolute -top-4 left-[60%] transform -translate-x-1/2 z-20">
                            <StarRating count={5} />
                          </div>
                          
                          {/* Card with testimonial */}
                          <div className="relative rounded-xl shadow-lg p-6 pt-8 pl-24 bg-yellow-400 text-black">
                            <div className="mb-4">
                              <h4 className="font-bold text-lg">{testimonial.name}</h4>
                              <p className="text-sm text-yellow-800">{testimonial.role}</p>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {testimonial.text}
                            </p>
                          </div>
                        </>
                      ) : (
                        // Right-aligned card (even indices - second card)
                        <>
                          {/* Profile Image - Right positioned */}
                          <div className="absolute -top-8 right-8 z-10">
                            <ProfileImage imageSrc={testimonial.image} alt={testimonial.name} />
                          </div>
                          
                          {/* Curved connector line using SVG */}
                          <div className="absolute top-0 right-0 w-full h-32 z-5 pointer-events-none">
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
                          
                          {/* Star Rating - Left of profile */}
                          <div className="absolute -top-4 right-[60%] transform translate-x-1/2 z-20">
                            <StarRating count={5} />
                          </div>
                          
                          {/* Card with testimonial */}
                          <div className="relative rounded-xl shadow-lg p-6 pt-8 pr-24 bg-black text-white">
                            <div className="mb-4">
                              <h4 className="font-bold text-lg">{testimonial.name}</h4>
                              <p className="text-sm text-yellow-400">{testimonial.role}</p>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {testimonial.text}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;