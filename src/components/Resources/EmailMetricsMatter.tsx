import React from "react";
import { Card } from "@/components/ui/card";
{
  /* First Section */
}
const EmailMetricsMatter = () => {
  return (
    <div className="pt-32 min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="rounded-lg bg-white p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
            <h1 className="text-wrap-balance text-4xl font-bold text-gray-800">
                Why Email Metrics Matter
              </h1>
              <h2 className="text-xl text-gray-600">
                A Business Owner's Guide to Tracking Campaign Performance
              </h2>

              <p className="text-gray-600">
                Are you sending email after email without seeing the results you
                want? You're not alone. Too many business owners rely on
                guesswork and 'gut feelings' when it comes to their email
                campaigns—only to be left wondering why open rates are low,
                conversions are stalled, and unsubscribe rates keep climbing.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  How This Guide Helps You
                </h3>
                <p className="text-gray-600">
                  This comprehensive guide takes the mystery out of email
                  marketing metrics, showing you exactly what to track and why
                  it matters. Discover how to optimize your campaigns step by
                  step—from pinpointing subject lines that boost open rates, to
                  refining your message so you attract the right audience and
                  grow your bottom line.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-800">
                  What You Will Get
                </h4>
                <ul className="space-y-4 text-gray-600">
                  <li>• What Happens When You Ignore Your Email Metrics</li>
                  <li>• Key Email Reporting Metrics You Should Know</li>
                  <li>• Email Campaign Performance Checklist</li>
                  <li>• How It Will Help Your Business</li>
                  <li>• When to Gather and Report Email Metrics</li>
                </ul>
              </div>

              <p className="text-gray-600">
                This free guide is your roadmap for crafting a winning email
                strategy—but for monitoring, forecasting, and other menial
                tasks, delegate it to us!
              </p>

              <p className="font-semibold text-gray-800">
                Download your free Email Metrics Template report now to get
                started.
              </p>

              <p className="text-gray-800">
                Ready for more hands-on support?{" "}
                <span className="font-semibold">Book a Consultation</span> Today
                and let our experts handle the heavy lifting so you can focus on
                what you do best.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="rounded-lg bg-yellow-400 p-6">
                <img
                  src="/images/resources/4.png"
                  alt="Business people reviewing metrics"
                  className="mb-4 w-full rounded-lg"
                />
                <h2 className="mb-2 text-center text-2xl font-bold">
                  Why Email Metrics
                  <div className="mt-1">Matter</div>
                </h2>
                <div className="mx-auto my-4 h-px w-32 bg-black"></div>
                <p className="text-center text-sm">
                  A Business Owner's Guide to Tracking
                </p>
                <div className="text-center text-sm">Campaign Performance</div>
              </Card>

              <div className="mt-4 flex flex-col items-center">
                <img
                  src="/images/logo/new-logo-ready-set.png"
                  alt="Company logo"
                  className="mb-2 h-auto w-24"
                />
                <div className="rounded-lg bg-black px-4 py-0 text-white">
                  <p className="text-sm tracking-wider">READYSETLLC.COM</p>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-yellow-500">
                  Download Now
                </button>
                <button className="w-full rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-yellow-500">
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

export default EmailMetricsMatter;
