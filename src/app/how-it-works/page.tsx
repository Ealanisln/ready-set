import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Tell Us What You Need",
      description: "Fill out our online form or give us a call. Share your specific requirements—whether it's catering delivery, flower transportation, or virtual assistant services like social media management or email marketing."
    },
    {
      number: "02",
      title: "Get a Customized Plan",
      description: "We'll review your needs and craft a tailored solution just for you. You'll receive a transparent proposal outlining the services, timelines, and pricing."
    },
    {
      number: "03",
      title: "Leave the Execution to Us",
      description: "Our team gets to work! From timely deliveries to efficient administrative tasks, we handle everything with precision, professionalism, and care."
    },
    {
      number: "04",
      title: "Track and Stay Updated",
      description: "Stay informed every step of the way. Use our tracking tools for logistics or receive regular updates on virtual assistant tasks. We prioritize clear and consistent communication to keep you in the loop."
    },
    {
      number: "05",
      title: "Evaluate and Improve",
      description: "We're committed to continuous improvement. After each project or delivery, we'll check in for your feedback to ensure we're exceeding your expectations."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-yellow-50">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-4">
            
            </nav>
        </div>
        <h1 className="text-4xl font-bold text-center py-12">How it Works</h1>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-16">
          At Ready Set, we make logistics and virtual assistance simple and hassle-free. Whether you need seamless delivery services or professional virtual support, our process is designed to ensure a smooth experience every step of the way.
        </p>

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-12">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-8 border-b pb-8">
              <div className="text-6xl font-bold text-yellow-400 flex-shrink-0">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 space-y-4">
          <h2 className="text-2xl font-bold">Get Started Today!</h2>
          <p className="text-gray-600">Click below to book a consultation or request a quote.</p>
          <p className="text-gray-600">Let us handle the details so you can focus on growing your business.</p>
          <button className="mt-4 px-6 py-3 bg-yellow-400 rounded-md text-gray-800 flex items-center gap-2 mx-auto">
            Book a Discovery call
          </button>
        </div>
      </div>
     </div>
    );
};

export default HowItWorks;