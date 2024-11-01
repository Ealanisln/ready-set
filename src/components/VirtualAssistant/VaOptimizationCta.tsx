import Image from 'next/image';
import Link from 'next/link';

const BusinessScaleSection = () => {
  const benefits = [
    {
      imageWebp: "/images/virtual/administrative-support.webp",
      imageFallback: "/images/virtual/administrative-support.jpg",
      alt: "Business collaboration",
      title: "Build a business that runs without you",
      description: "Streamline your processes and automate tasks, instead of doing everything manually."
    },
    {
      imageWebp: "/images/virtual/content-creation.webp",
      imageFallback: "/images/virtual/content-creation.jpg",
      alt: "Work life balance",
      title: "Enjoy more free time",
      description: "Imagine saving 20 hours a week and doing more of what you love just by having the right virtual assistant, tech and processes."
    },
    {
      imageWebp: "/images/virtual/customer-service.webp",
      imageFallback: "/images/virtual/customer-service.jpg",
      alt: "Remote work setup",
      title: "Make more money with less stress",
      description: "With the right scaling techniques, you'll be able to take on more clients, create better offers, and expand your market."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Top Section with Venn Diagram and CTA */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
        <div className="relative w-full aspect-square max-w-md">
          <Image 
            src="/images/virtual/va-diagram.svg" 
            alt="Business scaling venn diagram showing People, Technology, and Process intersection"
            fill
            className="object-contain"
          />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold">
            <span className="text-yellowd-500">Hiring VAs</span> is only part of the solution.
          </h2>
          
          <div className="space-y-4">
            <p className="text-lg">
              The good news is, you can still drive your business to success.{' '}
              <strong>But hiring a VA will only get you halfway there.</strong>
            </p>
            
            <p className="text-lg">
              To succeed long-term, you also need to optimise your processes and upgrade your technology. 
              That&apos;s how you set up a work environment for true success!
            </p>
          </div>
          
          <Link 
            href="/book-call"
            className="inline-block px-8 py-4 bg-amber-400 rounded-full font-semibold text-black hover:bg-amber-500 transition-colors"
          >
            BOOK A DISCOVERY CALL
          </Link>
        </div>
      </div>

      {/* Bottom Section with Scale Message and Images */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-semibold">
            <span className="text-yellowd-500">Scale your business</span> the right way.
          </h2>
          <p className="text-xl">
            With the right <strong>technology, processes and virtual assistants</strong>, you can:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <picture>
                <source srcSet={benefit.imageWebp} type='image/webp' />
                <Image
                  src={benefit.imageFallback}
                  alt={benefit.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={85}
                />
                </picture>
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">
                  {benefit.title}
                </h3>
                <p className="text-lg text-gray-700">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
         {/* Wave Shape */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-auto fill-white"
          preserveAspectRatio="none"
          style={{ height: '160px' }} // Added fixed height for better wave appearance
        >
          <path d="M0,160 C360,240 720,80 1080,160 C1260,200 1440,160 1440,160 L1440,320 L0,320 Z" />
        </svg>
      </div>
      </div>
    </section>
  );
};

export default BusinessScaleSection;