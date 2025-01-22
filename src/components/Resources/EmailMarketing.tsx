import React from 'react';
import { Card } from '@/components/ui/card';

const EmailMarketingGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* First Section */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-800">Why Email Metrics Matter</h1>
              <h2 className="text-xl text-gray-600">A Business Owner's Guide to Tracking Campaign Performance</h2>
              
              <p className="text-gray-600">
                Are you sending email after email without seeing the results you want? You're not alone. Too many business owners rely on guesswork and 'gut feelings' when it comes to their email campaigns—only to be left wondering why open rates are low, conversions are stalled, and unsubscribe rates keep climbing.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">How This Guide Helps You</h3>
                <p className="text-gray-600">
                  This comprehensive guide takes the mystery out of email marketing metrics, showing you exactly what to track and why it matters. Discover how to optimize your campaigns step by step—from pinpointing subject lines that boost open rates, to refining your message so you attract the right audience and grow your bottom line.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">What You Will Get</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• What Happens When You Ignore Your Email Metrics</li>
                  <li>• Key Email Reporting Metrics You Should Know</li>
                  <li>• Email Campaign Performance Checklist</li>
                  <li>• How It Will Help Your Business</li>
                  <li>• When to Gather and Report Email Metrics</li>
                </ul>
              </div>

              <p className="text-gray-600">
                This free guide is your roadmap for crafting a winning email strategy—but for monitoring, forecasting, and other menial tasks, delegate it to us!
              </p>
              
              <p className="text-gray-800 font-semibold">
                Download your free Email Metrics Template report now to get started.
              </p>

              <p className="text-gray-800">
                Ready for more hands-on support? <span className="font-semibold">Book a Consultation</span> Today and let our experts handle the heavy lifting so you can focus on what you do best.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="bg-yellow-400 p-6 rounded-lg">
                <img 
                  src="/images/resources/4.png"
                  alt="Business people reviewing metrics"
                  className="w-full rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-center mb-2">Why Email Metrics Matter</h2>
                <p className="text-center text-sm">A Business Owner's Guide to Tracking Campaign Performance</p>
              </Card>

              <div className="space-y-4">
                <button className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                  Download Now
                </button>
                <button className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                  Book a Consultation Today
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Second Section */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">What Is Email Marketing</h2>
              <h3 className="text-xl text-gray-600">A Business Owner's Guide to Getting Started</h3>

              <p className="text-gray-600">
                Does the idea of email marketing feel overwhelming or outdated? Many business owners mistakenly think email marketing is reserved for large corporations or struggle with ineffective campaigns. In reality, email marketing is a powerful tool to build meaningful customer relationships and drive sales—no matter your business size.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">What You Will Learn</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• What Is Email Marketing?</li>
                  <li>• The Pros and Cons of Email Marketing</li>
                  <li>• Types of Email Marketing Campaigns</li>
                  <li>• How to Build an Email List</li>
                  <li>• Getting Customer Consent</li>
                  <li>• Lead Magnets That Work: Discover how to use free resources to attract and retain subscribers.</li>
                  <li>• Email Authentication Essentials</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-yellow-400 p-6 rounded-lg">
                <img 
                  src="/images/resources/2.png"
                  alt="Person working on email marketing"
                  className="w-full rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-center mb-2">What Is Email Marketing</h2>
                <p className="text-center text-sm">The Business Owner's Guide to Getting Started</p>
              </Card>

              <p className="text-gray-600">
                This guide offers clear steps to understand email marketing, grow your audience, and build meaningful connections with your customers. Use it to get started today.
              </p>

              <div className="space-y-4">
                <button className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                  Download Now
                </button>
                <button className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                  Book a Consultation Today
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmailMarketingGuide;