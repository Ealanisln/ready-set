import React from 'react';
import { Clock, Truck, Shield } from 'lucide-react';
import Link from 'next/link';

const LogisticsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('/images/logistics/bg-hero.jpg')",
              backgroundSize: 'cover',
              height: '100vh'
            }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-grow flex items-center justify-center px-4 pt-20">
            <div className="max-w-2xl bg-white/95 rounded-2xl p-10 backdrop-blur-sm shadow-lg text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Premium Logistics Services
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Bay Area's Most Trusted Delivery Partner Since 2019
              </p>
              <div className="flex gap-4 justify-center">
                <Link 
                  href="/quote"
                  className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                >
                  Get Quote
                </Link>
                <Link
                  href="/schedule"
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Schedule a Call
                </Link>
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="pb-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Specialized Delivery Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="mb-4">
                    <Truck className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Specialized Delivery</h3>
                  <p className="text-gray-600 mb-6">
                    Expert handling of your needs with temperature-controlled vehicles and trained professionals.
                  </p>
                  <Link 
                    href="/learn-more"
                    className="inline-flex items-center text-yellow-500 font-medium hover:text-yellow-600"
                  >
                    Learn More
                    <span className="ml-2">→</span>
                  </Link>
                </div>

                {/* Time-Critical Delivery Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="mb-4">
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Time-Critical Delivery</h3>
                  <p className="text-gray-600 mb-6">
                    Guaranteed on-time delivery for your events with real-time tracking and dedicated route optimization.
                  </p>
                  <Link 
                    href="/learn-more"
                    className="inline-flex items-center text-yellow-500 font-medium hover:text-yellow-600"
                  >
                    Learn More
                    <span className="ml-2">→</span>
                  </Link>
                </div>

                {/* Quality Guaranteed Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="mb-4">
                    <Shield className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Quality Guaranteed</h3>
                  <p className="text-gray-600 mb-6">
                    Trusted by leading tech companies including Apple, Google, Facebook, and Netflix for reliable service.
                  </p>
                  <Link 
                    href="/learn-more"
                    className="inline-flex items-center text-yellow-500 font-medium hover:text-yellow-600"
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
    </div>
  );
};

export default LogisticsPage;