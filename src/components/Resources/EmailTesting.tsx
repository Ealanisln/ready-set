import React from 'react';
import { Card } from '@/components/ui/card';

{/* Fifth Section */}
const EmailTesting = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-12">
      <section className="bg-white rounded-lg shadow-lg p-8">
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-gray-800">Email A/B Testing Made Simple:</h2>
        <h3 className="text-xl text-gray-600">A Guide for Business Owners</h3>

        <p className="text-gray-600">
        If you are a business owner, small business owner, or solopreneur looking to improve your email campaigns but are not sure where to start, A/B testing is your new best friend. It is not as complicated as it sounds, and the
        insights it provides can help you make informed decisions about what works - and what doesn't.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-800">How This Guide Helps You</h2>
              <p className="text-gray-600">
               Inside this guide, you will learn what A/B testing is and how it works  - explained simply, without the jargon. You'll discover
               key areas to test, like subject lines, CTAs, visuals, and timing, along with practical tips to run tests that lead to better open 
               rates, clicks and conversions.
              </p>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-800">What You Will Get</h4>
                <ul className="space-y-4 text-gray-600">
                  <li>• What Email A/B Testing is</li>
                  <li>• Why A/B Testing Matters</li>
                  <li>• How to Get Started</li>
                  <li>• Key Email Elements to Test</li>
                  <li>• When to A/B Test</li>
                  <li>• Biggest A/B Testing Challenges</li>
                  <li>• A/B Testing Checklist</li>
                  <li>• 7 High-Performing Subject Line Strategies</li>
                </ul>
              </div>

              <p className="text-gray-600">
                This free guide is your roadmap for crafting a winning email strategy-but for monitoring, forecasting and other menial tasks, delegate it to us!
              </p>

        <p className="text-gray-600">
        <strong>Download your free Email Metrics Template report now to get started.</strong>
        </p>

        <p className="text-gray-600">
          Ready for more hands-on support? <span className="text-black-500 font-bold">Book a Consultation</span> Today and let our experts handlethe heavy lifting so you can focus on what you do best.
        </p>
        </div>

      <div className="space-y-6">
        <Card className="bg-yellow-400 p-6 rounded-lg">
          <img src="/images/resources/6.png" alt="Delivery person with package" 
            className="w-full rounded-lg mb-4"/>
          <h2 className="text-2xl font-bold text-center mb-2">
          Email A/B Testing
            <div className="mt-1">Made Simple</div>
          </h2>
          <div className="w-32 h-px bg-black mx-auto my-4"></div>
          <p className="text-center text-sm">A Guide for Business Owners</p>
        </Card>

        <div className="flex flex-col items-center mt-4">
          <img src="/images/logo/new-logo-ready-set.png" alt="Company logo" className="w-24 h-auto mb-2" />
          <div className="bg-black text-white px-4 py-0 rounded-lg">
            <p className="text-sm tracking-wider">READY SET GROUP, LLC</p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
            Download Now
          </button>
          <button className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
            Schedule a Call Today
          </button>
        </div>
      </div>
        </div>
      </section>
    </div>
    </div>

    );
        };



export default EmailTesting;