"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EmailMetricsLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Why Email Metrics Matter
              </h1>
              <h2 className="text-xl text-gray-700">
                A Business Owner's Guide to Tracking Campaign Performance
              </h2>
            </div>

            <p className="text-gray-600">
              Are you sending email after email without seeing the results you want? You're not
              alone. Too many business owners rely on guesswork and 'gut feelings' when it
              comes to their email campaigns—only to be left wondering why open rates are
              low, conversions are stalled, and unsubscribe rates keep climbing
            </p>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                How This Guide Helps You
              </h3>
              <p className="text-gray-600">
                This comprehensive guide takes the mystery out of email marketing metrics,
                showing you exactly what to track and why it matters. Discover how to optimize
                your campaigns step by step—from pinpointing subject lines that boost open rates,
                to refining your message so you attract the right audience and grow your bottom
                line.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What You Will Get
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• What Happens When You Ignore Your Email Metrics</li>
                <li>• Key Email Reporting Metrics You Should Know</li>
                <li>• Email Campaign Performance Checklist</li>
                <li>• How It Will Help Your Business</li>
                <li>• When to Gather and Report Email Metrics</li>
              </ul>
            </div>

            <p className="text-gray-600">
              This free guide is your roadmap for crafting a winning email strategy—but
              for monitoring, forecasting, and other menial tasks, delegate it to us!
            </p>

            <p className="text-gray-700 font-medium">
              Download your free Email Metrics Template report now to get started.
            </p>

            <div className="space-y-4">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                Download Now
              </Button>
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">Ready for more hands-on support?</p>
                <Button variant="outline" className="w-full">
                  Book a Consultation Today
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Image Card */}
          <div className="lg:mt-0 mt-8">
            <Card className="bg-yellow-400">
              <CardContent className="p-6">
                <div className="relative w-full h-64 mb-6">
                  <Image
                    src="/api/placeholder/800/600"
                    alt="Email marketing team collaboration"
                    className="rounded-lg object-cover"
                    fill
                  />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                  Why Email Metrics Matter
                </h2>
                <p className="text-center text-gray-800">
                  A Business Owner's Guide to Tracking Campaign Performance
                </p>
              </CardContent>
              <CardFooter className="justify-center pb-6">
                <Image
                  src="/api/placeholder/150/50"
                  alt="ReadySetLLC.com logo"
                  width={150}
                  height={50}
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailMetricsLanding;