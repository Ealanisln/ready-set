import { Testimonial } from "@/types/testimonial";
import SectionTitle from "../Common/SectionTitle";
import Image from "next/image";

// Extended testimonial type to include category
interface ExtendedTestimonial extends Testimonial {
  category: "client" | "vendor" | "driver";
  shortQuote?: string;
}

const testimonialData: ExtendedTestimonial[] = [
  {
    id: 1,
    name: "Wendy Sellers",
    designation: "",
    content: "As a small business owner, my team of virtual assistants makes me feel like I have an entire team behind me. One of their tasks is to transform my PowerPoint presentations into professional, polished files that consistently impress me and my clients. Quick, efficient, and effective, they handle tasks with remarkable speed and precision. Their support has been invaluable to my business and my sanity!.",
    image: "/images/testimonials/author-01.png",
    star: 5,
    category: "client",
  },
  {
    id: 2,
    name: "Dennis Ngai",
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
    star: 4,
    category: "vendor",
  },
  {
    id: 4,
    name: "Lydia N.",
    designation: "Vendor Partner",
    content: "Partnering with Ready Set has increased our efficiency by 40%. Their team is reliable and professional.",
    image: "/images/testimonials/author-04.png",
    star: 5,
    category: "vendor",
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

const CategoryTestimonial = ({ 
  testimonials, 
  title, 
  subtitle 
}: { 
  testimonials: ExtendedTestimonial[], 
  title: string, 
  subtitle: string 
}) => {
  return (
    <div className="w-full lg:w-1/3 px-4">
      <div className="border-dotted border-2 border-gray-300 p-4 h-full">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold uppercase mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>

        <div className="space-y-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="relative">
              <div className="bg-yellow-100 rounded-lg p-4 mb-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-base">{testimonial.name}, {testimonial.designation}</h4>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
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
          ))}
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
          <CategoryTestimonial 
            testimonials={clientTestimonials} 
            title="CLIENTS" 
            subtitle="Why Our Clients Love Us" 
          />
          <CategoryTestimonial 
            testimonials={vendorTestimonials} 
            title="VENDORS" 
            subtitle="Trusted Partners for Seamless Operations" 
          />
          <CategoryTestimonial 
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