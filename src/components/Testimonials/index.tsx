// components/TestimonialsSection.tsx
import React from 'react';

interface Testimonial {
  category: 'CLIENTS' | 'VENDORS' | 'DRIVERS';
  name: string;
  role: string;
  text: string;
  image?: string; // Added image property
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      category: 'CLIENTS',
      name: 'Wendy S.',
      role: 'TheHRLady',
      text: 'As a small business owner, my team makes me feel like I have an entire team behind me. One of their tasks is to transform my presentations into professional, polished materials that consistently impress me and my clients. Quick, perfect, and effective, they handle tasks with remarkable speed and precision.',
      image: '/images/wendy.jpg'
    },
    {
      category: 'CLIENTS',
      name: 'Cris & Ray',
      role: 'Owner of Bloom',
      text: 'Ready Set has transformed our delivery system. Custom solutions and always on time, our customers are thrilled with the reliable, seamless partnership!',
      image: '/images/crisray.jpg'
    },
    {
      category: 'VENDORS',
      name: 'Alex R.',
      role: 'Product Supplier',
      text: 'From onboarding to operations, Ready Set has exceeded expectations.',
      image: '/images/alex.jpg'
    },
    {
      category: 'VENDORS',
      name: 'Lydia N.',
      role: 'Vendor Partner',
      text: 'Partnering with Ready Set has increased our efficiency by 40%. Their team is reliable and professional.',
      image: '/images/lydia.jpg'
    },
    {
      category: 'VENDORS',
      name: 'George E.',
      role: 'Vendor Partner',
      text: 'Efficient, reliable, and seamless partnership!',
      image: '/images/george.jpg'
    },
    {
      category: 'DRIVERS',
      name: 'Maria R.',
      role: 'Logistics Partner',
      text: 'I love the flexibility and the team\'s professionalism. I feel valued every single day.',
      image: '/images/maria.jpg'
    },
    {
      category: 'DRIVERS',
      name: 'Chris L.',
      role: 'Delivery Driver',
      text: 'Working with Ready Set has been life-changing for me. The support from the team is unmatched—they always ensure I have all the information I need to complete my deliveries efficiently. I\'ve also gained access to great opportunities and flexible hours, which allow me to balance work with my personal life. I feel respected and valued every step of the way, and that motivates me to give my best every day. Ready Set is not just a job; it feels like a community that genuinely cares about its drivers.',
      image: '/images/chris.jpg'
    }
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

  // Placeholder image component since we don't have actual images
  const ProfileImage = ({ alt }: { alt: string }) => (
    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg z-10 bg-gray-200">
      <img 
        src={`/api/placeholder/80/80`} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
    </div>
  );

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
    <div className="border-t-2 border-dashed border-black w-2/5 absolute right-1/2 mr-4"></div>
    
    {/* Text in the middle */}
    <p className="text-xl text-black z-10 bg-white px-4 relative">Real Stories. Real Impact</p>
    
    {/* Right dotted line - changed from w-1/3 to w-2/5 */}
    <div className="border-t-2 border-dashed border-black w-2/5 absolute left-1/2 ml-4"></div>
  </div>
</div>
          
          <p className="text-black max-w-2xl mx-auto">
            See how Ready Set is making a difference for our clients, vendors, and drivers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(groupedTestimonials).map(([category, items]) => (
            <div key={category} className="space-y-8 relative">
              {/* Category Header with Dotted Border */}
              {/* Category Header - Removed dotted border */}
<div className="text-center relative pb-8 mb-8">
  <div className="p-4">
    <h3 className="text-2xl font-bold text-black">{category}</h3>
    <p className="text-black text-sm">
      {category === 'CLIENTS' && 'Why Our Clients Love Us'}
      {category === 'VENDORS' && 'Trusted Partners for Seamless Operations'}
      {category === 'DRIVERS' && 'Our Drivers, Our Heroes'}
    </p>
  </div>
</div>
              
              <div className="space-y-12">
                {items.map((testimonial, index) => (
                  <div key={index} className="relative pt-6">
                    {/* Profile Image - Positioned to overlap card */}
                    <div className="absolute -top-8 left-8 z-10">
                      <ProfileImage alt={testimonial.name} />
                    </div>
                    
                    {/* Line connecting to stars */}
                    <div className="absolute -top-4 left-24 right-24 border-t border-gray-300 z-5"></div>
                    
                    {/* Star Rating - Positioned in the center top */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <StarRating count={5} />
                    </div>
                    
                    {/* Card with testimonial */}
                    <div 
                      className={`relative rounded-xl shadow-lg p-6 pt-8 pl-24 ${
                        index % 2 === 0 
                          ? 'bg-yellow-400 text-black' 
                          : 'bg-black text-white'
                      }`}
                    >
                      
                      <div className="mb-4">
                        <h4 className="font-bold text-lg">{testimonial.name}</h4>
                        <p className={`text-sm ${
                          index % 2 === 0 ? 'text-yellow-800' : 'text-yellow-400'
                        }`}>
                          {testimonial.role}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;