import React from 'react';
import { Clock, Truck, Shield } from 'lucide-react';
import Link from 'next/link';

const LogisticsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-[600px] lg:min-h-[800px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: "url('/images/logistics/bg-hero.jpg')",
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24">
          <div className="max-w-xl bg-white/95 rounded-lg p-8 backdrop-blur-sm">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Logistics Services
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Bay Area's Most Trusted Delivery Partner Since 2019
            </p>
            <div className="flex gap-4">
              <Link 
                href="/quote"
                className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
              >
                Get Quote
              </Link>
              <Link
                href="/schedule"
                className="px-6 py-3 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                Schedule a Call
              </Link>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
              {/* Specialized Delivery Card */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                  <Truck className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Specialized Delivery</h3>
                <p className="text-gray-600 mb-4">
                  Expert handling of your needs with temperature-controlled vehicles and trained professionals.
                </p>
                <Link 
                  href="/learn-more"
                  className="text-yellow-500 font-medium hover:text-yellow-600 inline-flex items-center"
                >
                  Learn More
                  <span className="ml-2">→</span>
                </Link>
              </div>

              {/* Time-Critical Delivery Card */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Time-Critical Delivery</h3>
                <p className="text-gray-600 mb-4">
                  Guaranteed on-time delivery for your events with real-time tracking and dedicated route optimization.
                </p>
                <Link 
                  href="/learn-more"
                  className="text-yellow-500 font-medium hover:text-yellow-600 inline-flex items-center"
                >
                  Learn More
                  <span className="ml-2">→</span>
                </Link>
              </div>

              {/* Quality Guaranteed Card */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                  <Shield className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
                <p className="text-gray-600 mb-4">
                  Trusted by leading tech companies including Apple, Google, Facebook, and Netflix for reliable service.
                </p>
                <Link 
                  href="/learn-more"
                  className="text-yellow-500 font-medium hover:text-yellow-600 inline-flex items-center"
                >
                  Learn More
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsPage;