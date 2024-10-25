import React from 'react';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const OverwhelmSection = () => {
  const features: FeatureCard[] = [
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: "Feeling trapped",
      description: "in the day-to-day"
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: "Can't take on",
      description: "more clients"
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: "No work life balance",
      description: "or time for friends and family (or vacations)"
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: "Your business",
      description: "can't scale the way it is now"
    }
  ];

  return (
    <section className="relative bg-gray-50 pt-16 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Feeling <span className="text-yellow-500">overwhelmed</span> by your business?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We get you. Just taking one day off probably means your operations would stop dead, because all decision-making depends on you!
          </p>
          <p className="text-lg text-gray-600 mb-8">
            So you might be thinking a skilled virtual assistant could lighten your workload and make your life easier...
          </p>
          <p className="text-lg text-gray-600 font-medium">
            But here&apos;s the thing: <span className="font-normal">you would still be shouldering most of the decision-making. Plus, VAs thrive in organised work environments. If your business isn&apos;t set up properly, hiring a VA could actually add more stress for you!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start p-6 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0 text-yellow-500 mr-4">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Improved Wave Shape */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: '160px' }}
          >
            <path
              d="M0,160 C240,220 480,100 720,160 C960,220 1200,100 1440,160 L1440,320 L0,320 Z"
              className="fill-white"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default OverwhelmSection;