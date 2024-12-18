import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">How it Works</CardTitle>
          <p className="text-gray-600 mt-2">
            At Ready Set, we make logistics and virtual assistance simple and hassle-free. Whether you need seamless delivery services or professional virtual support, our process is designed to ensure a smooth experience every step of the way.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="text-6xl font-bold text-yellow-400 flex-shrink-0">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 space-y-4">
            <h2 className="text-2xl font-bold">Get Started Today!</h2>
            <p>Click below to book a consultation or request a quote.</p>
            <p className="text-gray-600">Let us handle the details so you can focus on growing your business.</p>
            <button className="bg-yellow-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-500 transition-colors">
              Book a Discovery Call
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowItWorks;